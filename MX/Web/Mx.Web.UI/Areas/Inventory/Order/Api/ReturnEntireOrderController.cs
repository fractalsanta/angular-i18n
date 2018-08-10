using System;
using System.Web.Http;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Inventory.Services.Contracts.CommandServices;
using Mx.Inventory.Services.Contracts.Requests;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Config.WebApi;

namespace Mx.Web.UI.Areas.Inventory.Order.Api
{
    [Permission(Task.Inventory_Ordering_Receive_CanView)]
    public class ReturnEntireOrderController : ApiController
    {
        private readonly IAuthenticationService _authenticationService;
        private readonly IEntityTimeQueryService _entityTimeQueryService;
        private readonly IDeliveryCommandService _deliveryCommandService;

        public ReturnEntireOrderController(
            IAuthenticationService authenticationService,
            IEntityTimeQueryService entityTimeQueryService,
            IDeliveryCommandService deliveryCommandService
            )
        {
            _authenticationService = authenticationService;
            _entityTimeQueryService = entityTimeQueryService;
            _deliveryCommandService = deliveryCommandService;
        }

        public bool PostReturnEntireOrder( [FromUri] Int64 orderId)
        {
            var entityId = _authenticationService.User.MobileSettings.EntityId;
            var requestTime = _entityTimeQueryService.GetCurrentStoreTime(entityId);

            var request = new DeliveryReceiveRequest
            {
                Id = orderId,
                ApplyTime = requestTime,
                RequestTime = requestTime,
                RequestUser = _authenticationService.User.UserName
            };

            _deliveryCommandService.ReturnEntireDeliveryOrder(entityId, request);
            return true;
        }
    }
}
