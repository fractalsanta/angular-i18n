using System;
using System.Collections.Generic;
using System.Globalization;
using System.Web.Http;
using AutoMapper;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Inventory.Services.Contracts.CommandServices;
using Mx.Inventory.Services.Contracts.QueryServices;
using Mx.Services.Shared.Contracts;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Areas.Inventory.Order.Api.Models;
using Mx.Web.UI.Config.Helpers;
using Mx.Web.UI.Config.WebApi;

namespace Mx.Web.UI.Areas.Inventory.Order.Api
{
    [Permission(Task.Inventory_Ordering_Receive_CanView)]
    public class ReceiveOrderController : ApiController
    {
        private readonly IMappingEngine _mapper;
        private readonly IOrderQueryService _orderQueryService;
        private readonly IOrderCommandService _orderCommandService;
        private readonly IAuthenticationService _authenticationService;
        private readonly IEntityTimeQueryService _entityTimeQueryService;

        public ReceiveOrderController(
            IMappingEngine mappingEngine, 
            IOrderQueryService orderQueryService, 
            IOrderCommandService orderCommandService, 
            IAuthenticationService authenticationService,
            IEntityTimeQueryService entityTimeQueryService
            )
        {
            _mapper = mappingEngine;
            _orderQueryService = orderQueryService;
            _orderCommandService = orderCommandService;
            _authenticationService = authenticationService;
            _entityTimeQueryService = entityTimeQueryService;
        }

        public ReceiveOrder GetReceiveOrder([FromUri]Int64 orderId)
        {
            var order = _orderQueryService.GetDeliveryById(orderId);
            var mappedOrder = _mapper.Map<ReceiveOrder>(order);
            mappedOrder.CanBePushedToTomorrow = _orderQueryService.CanBePushedToTomorrow(orderId);
            mappedOrder.HasBeenCopied = _orderQueryService.HasBeenCopiedFrom(orderId);

            return mappedOrder;
        }

        public IEnumerable<ReceiveOrderHeader> GetPlacedAndReceivedOrders(
            [FromUri]Int64 entityId,
            [FromUri]String fromDate,
            [FromUri]String toDate)
        {
            var startDate = fromDate.AsDateTime() ?? DateTime.Now;
            var endDate = toDate.AsDateTime() ?? DateTime.Now;
            // orders are time based so the following will pick up all orders due on the last day.  You can be specific about time, which notifications does.
            var orders = _orderQueryService.GetPlacedOrders(entityId, startDate.Date, endDate.Date.AddDays(1));
            return _mapper.Map<IEnumerable<ReceiveOrderHeader>>(orders);
        }

        public void PostPushForTomorrow([FromUri] long orderId)
        {
            if (_orderQueryService.CanBePushedToTomorrow(orderId))
            {
                _orderCommandService.PushSupplyOrderToTomorrow(orderId, _authenticationService.User.UserName);
            }
        }

        public List<ReceiveOrderDetail> PostAddItems([FromUri] Int64 entityId, [FromUri] Int64 orderId, [FromBody]IEnumerable<string> itemCodes)
        {
            var auditUser = _mapper.Map<AuditUser>(_authenticationService.User);

            var newItems = _orderCommandService.ReceiveOrderAddItems(orderId, itemCodes, auditUser);

            return _mapper.Map<List<ReceiveOrderDetail>>(newItems);
        }
        
        public string GetLocalStoreDateTimeString(long entityId)
        {
            return _entityTimeQueryService.GetCurrentStoreTime(entityId).ToString(CultureInfo.InvariantCulture);
        }
    }
}