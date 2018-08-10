using System;
using System.Collections.Generic;
using System.Web.Http;
using AutoMapper;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Inventory.Services.Contracts.CommandServices;
using Mx.Inventory.Services.Contracts.QueryServices;
using Mx.Inventory.Services.Contracts.Requests;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Areas.Inventory.Order.Api.Models;
using Mx.Web.UI.Config.Helpers;
using Mx.Web.UI.Config.WebApi;

namespace Mx.Web.UI.Areas.Inventory.Order.Api
{
    [Permission(Task.Inventory_Ordering_Receive_CanView)]
    public class ReturnOrderController : ApiController
    {
        private readonly IMappingEngine _mapper;
        private readonly IOrderQueryService _orderQueryService;
        private readonly IOrderCommandService _orderCommandService;
        private readonly IAuthenticationService _authenticationService;
        private readonly IEntityTimeQueryService _entityTimeQueryService;
        private readonly IDeliveryCommandService _deliveryCommandService;

        public ReturnOrderController(
            IMappingEngine mappingEngine,
            IOrderQueryService orderQueryService,
            IOrderCommandService orderCommandService,
            IAuthenticationService authenticationService,
            IEntityTimeQueryService entityTimeQueryService,
            IDeliveryCommandService deliveryCommandService
            )
        {
            _mapper = mappingEngine;
            _orderQueryService = orderQueryService;
            _orderCommandService = orderCommandService;
            _authenticationService = authenticationService;
            _entityTimeQueryService = entityTimeQueryService;
            _deliveryCommandService = deliveryCommandService;
        }

        public IEnumerable<ReceiveOrderHeader> GetReceivedOrders(
            [FromUri]Int64 entityId,
            [FromUri]String fromDate,
            [FromUri]String toDate)
        {
            var startDate = fromDate.AsDateTime() ?? DateTime.Now;
            var endDate = toDate.AsDateTime() ?? DateTime.Now;

            var orders = _orderQueryService.GetReceivedOrders(entityId, startDate.Date, endDate.Date);

            return _mapper.Map<IEnumerable<ReceiveOrderHeader>>(orders);
        }

        public Boolean PostReturnItemsInOrder(
            [FromUri] Int64 orderId,
            [FromBody] IEnumerable<ReceiveOrderDetail> items)
        {
            var entityId = _authenticationService.User.MobileSettings.EntityId;
            var requestTime = _entityTimeQueryService.GetCurrentStoreTime(entityId);

            var request = new DeliveryReceiveRequest
            {
                Id = orderId,
                ApplyTime = requestTime,
                RequestTime = requestTime,
                RequestUser = _authenticationService.User.UserName,
                Details = _mapper.Map<IEnumerable<DeliveryReceiveDetailRequest>>(items)
            };

            return _deliveryCommandService.ReturnDeliveryItems(entityId, request);
        }
    }
}