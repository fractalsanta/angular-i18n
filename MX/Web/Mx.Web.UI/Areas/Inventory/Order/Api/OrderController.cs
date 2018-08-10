using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Web.Http;
using AutoMapper;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Inventory.Services.Contracts.CommandServices;
using Mx.Inventory.Services.Contracts.QueryServices;
using Mx.Inventory.Services.Contracts.Requests;
using Mx.Inventory.Services.Contracts.Responses;
using Mx.Services.Shared.Contracts;
using Mx.Services.Shared.ExtensionMethods;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Areas.Inventory.Order.Api.Models;
using Mx.Web.UI.Config.Helpers;
using Mx.Web.UI.Config.WebApi;
using Mx.Web.UI.Areas.Core.Api.Models;

namespace Mx.Web.UI.Areas.Inventory.Order.Api
{
    [Permission(Task.Inventory_Ordering_Place_CanView)]
    public class OrderController : ApiController
    {
        private readonly IMappingEngine _mappingEngine;
        private readonly IOrderQueryService _orderQueryService;
        private readonly IOrderCommandService _orderCommandService;
        private readonly IAuthenticationService _authenticationService;
        private readonly IDeliveryCommandService _deliveryCommandService;
        private readonly IEntityTimeQueryService _entityTimeQueryService;

        public OrderController(
            IMappingEngine mappingEngine,
            IOrderQueryService orderQueryService,
            IOrderCommandService orderCommandService,
            IAuthenticationService authenticationService,
            IDeliveryCommandService deliveryCommandService,
            IEntityTimeQueryService entityTimeQueryService)
        {
            _mappingEngine = mappingEngine;
            _orderQueryService = orderQueryService;
            _orderCommandService = orderCommandService;
            _authenticationService = authenticationService;
            _deliveryCommandService = deliveryCommandService;
            _entityTimeQueryService = entityTimeQueryService;
        }

        public IEnumerable<OrderHeader> GetOrdersByRange(
            [FromUri] Int64 entityId,
            [FromUri] String fromDate,
            [FromUri] String toDate)
        {
            var startDate = fromDate.AsDateTime() ?? DateTime.Now;
            var endDate = toDate.AsDateTime() ?? DateTime.Now;
            var orders = _orderQueryService.GetOrdersByRange(entityId, startDate.Date, endDate.Date);
            return _mappingEngine.Map<IEnumerable<OrderHeader>>(orders.OrderByDescending(x => x.OrderDate));
        }

        public Models.Order GetOrder([FromUri] Int64 entityId, [FromUri] Int64 orderId)
        {
            var order = _orderQueryService.GetOrder(orderId);
            if (order != null && order.EntityId != entityId)
            {
                throw new HttpResponseException(HttpStatusCode.Forbidden);
            }
            return _mappingEngine.Map<Models.Order>(order);
        }

        public List<OrderDetail> PostAddItems([FromUri] Int64 entityId, [FromUri] Int64 orderId, [FromBody]IEnumerable<string> itemCodes)
        {
            var auditUser = _mappingEngine.Map<AuditUser>(_authenticationService.User);

            var newItems = _orderCommandService.OrderAddItems(orderId, itemCodes, auditUser);
            return _mappingEngine.Map<List<OrderDetail>>(newItems);
        }

        public Int64 PostCreateAutoSelectTemplate(
            [FromUri] Int64 entityId,
            [FromUri] Int64 vendorId,
            [FromUri] String deliveryDate,
            [FromUri] Int32 daysToCover)
        {
            var parsedDeliveryDate = deliveryDate.AsDateTime() ?? DateTime.Now;
            var auditUser = _mappingEngine.Map<AuditUser>(_authenticationService.User);

            var order = _orderCommandService.CreateAutoSelectTemplate(entityId, vendorId, parsedDeliveryDate.Date, daysToCover, -1, auditUser);
            return order.Id;
        }

        public void PutPurchaseUnitQuantity(
            [FromUri] Int64 entityId,
            [FromUri] Int64 salesOrderItemId,
            [FromUri] Int64 supplyOrderItemId,
            [FromUri] double quantity)
        {
            try
            {
                var auditUser = _mappingEngine.Map<AuditUser>(_authenticationService.User);

                _orderCommandService.UpdatePurchaseUnitQuantity(entityId, salesOrderItemId, supplyOrderItemId, quantity, auditUser);
            }
            catch (ArgumentException ex)
            {
                if (ex.Message.Equals("salesOrderItemId"))
                {
                    throw new HttpResponseException(HttpStatusCode.Conflict);
                }
                throw;
            }
        }

        public CreateOrderResult PostCreateSupplyOrder(
            [FromUri] Int64 orderId,
            [FromUri] Boolean autoReceive,
            [FromUri] String invoiceNumber,
            [FromUri] String receiveTime)
        {

            var user = _authenticationService.User;
            CreateSupplyOrderResponse result;
            try
            {
                var auditUser = _mappingEngine.Map<AuditUser>(_authenticationService.User);

                result = _orderCommandService.CreateSupplyOrder(orderId, auditUser, autoReceive);
            }
            catch (Exception ex)
            {
                if (ex.Message.Equals("transactionSalesOrderId"))
                {
                    throw new HttpResponseException(HttpStatusCode.Conflict);
                }
                throw;
            }

            if (autoReceive && user.Permission.HasPermission(Task.Inventory_Ordering_CanAutoReceiveOrder))
            {
                var receiveTimeDate = receiveTime.AsDateTime() ?? DateTime.Now;
                AutoReceiveOrder(invoiceNumber, receiveTimeDate, result, user.UserName, result.EntityId);
            }

            ApplicationHub.RefreshNotifications(result.EntityId);

            return _mappingEngine.Map<CreateOrderResult>(result);
        }

        private void AutoReceiveOrder(string invoiceNumber, DateTime receiveTime, CreateSupplyOrderResponse result, string userName, long entityId)
        {
            var order = _orderQueryService.GetDeliveryById(result.SupplyOrderId);
            var items = _mappingEngine.Map<IEnumerable<ReceiveOrderDetail>>(order.Items);
            var auditUser = _mappingEngine.Map<AuditUser>(_authenticationService.User);

            items.ForEach(x => x.ReceivedQuantity = x.OrderedQuantity);

            var request = new DeliveryReceiveRequest
            {
                Id = result.SupplyOrderId,
                InvoiceNumber = invoiceNumber,
                ApplyTime = receiveTime,
                RequestUser = userName,
                RequestTime = _entityTimeQueryService.GetCurrentStoreTime(entityId),
                Details = _mappingEngine.Map<IEnumerable<DeliveryReceiveDetailRequest>>(items),
                AutoReceive = true
            };

            _deliveryCommandService.ReceiveItemsOnDelivery(entityId, request, auditUser);
        }

        public void DeleteOrder([FromUri] Int64 orderId)
        {
            var auditUser = _mappingEngine.Map<AuditUser>(_authenticationService.User);

            _orderCommandService.DeleteOrder(orderId, auditUser);
        }

        public IEnumerable<OrderItemHistoryHeader> GetOrderItemHistory([FromUri] Int64 transactionSalesOrderItemId)
        {
            var orderItemHistory = _orderQueryService.GetOrderItemHistory(transactionSalesOrderItemId);

            return _mappingEngine.Map<IEnumerable<OrderItemHistoryHeader>>(orderItemHistory);
        }

        #region Scheduled Order Services
        public IEnumerable<ScheduledOrderHeader> GetScheduledOrders(
           [FromUri]Int64 entityId,
           [FromUri]String fromDate)
        {
            var startDate = fromDate.AsDateTime() ?? DateTime.Now;
            var orders = _orderQueryService.GetScheduledOrders(entityId, startDate.Date);
            return _mappingEngine.Map<IEnumerable<ScheduledOrderHeader>>(orders);
        }

        public void PutVoidedScheduledOrder(
            [FromUri] Int64 entityId,
            [FromUri] String startDate,
            [FromUri] Int32 actionItemInstanceId,
            [FromUri] String currentUserFullName,
            [FromUri] Int32 actionItemId)
        {
            var date = startDate.AsDateTime() ?? DateTime.Now;

            _orderCommandService.InsertVoidedScheduledOrder(entityId, date, actionItemInstanceId, currentUserFullName, actionItemId);

            ApplicationHub.RefreshNotifications(entityId);
        }

        public Int64 PostGenerateSalesOrderFromScheduledOrder(
            [FromUri] Int64 entityId,
            [FromUri] String startDate,
            [FromUri] Int32 actionItemId,
            [FromUri] Int32 actionItemInstanceId)
        {
            var date = startDate.AsDateTime();
            if (date != null)
            {
                if (actionItemInstanceId <= 0)
                {
                    actionItemInstanceId = _orderCommandService.CreateOrderActionItem(entityId, date.Value, actionItemId);
                }
                var result = _orderCommandService.GenerateSalesOrderFromScheduledOrder(entityId, date.Value,
                    actionItemInstanceId, actionItemId);

                return result.Id;
            }
            
            throw new HttpResponseException(HttpStatusCode.BadRequest);
        }
        #endregion

        public string GetStoreLocalDateTimeString(long entityId)
        {
            return _entityTimeQueryService.GetCurrentStoreTime(entityId).ToString(CultureInfo.InvariantCulture);
        }
    }
}