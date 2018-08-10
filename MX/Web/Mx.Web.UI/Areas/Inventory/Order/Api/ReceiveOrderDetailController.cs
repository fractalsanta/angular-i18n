using System;
using System.Collections.Generic;
using System.Net;
using System.Web.Http;
using AutoMapper;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Inventory.Services.Contracts.CommandServices;
using Mx.Legacy.Services.Contracts.CommandServices;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Areas.Inventory.Order.Api.Models;
using Mx.Inventory.Services.Contracts.Requests;
using Mx.Labor.Services.Contracts.QueryServices;
using Mx.Labor.Services.Contracts.Requests;
using Mx.Services.Shared.Contracts;
using Mx.Web.UI.Config.Helpers;
using Mx.Web.UI.Config.WebApi;

namespace Mx.Web.UI.Areas.Inventory.Order.Api
{    
    [Permission(Task.Inventory_Receiving_CanReceive)]
    public class ReceiveOrderDetailController : ApiController
    {
        private readonly IMappingEngine _mapper;
        private readonly IEntityTimeQueryService _entityTimeQueryService;
        private readonly IAuthenticationService _authenticationService;
        private readonly IDeliveryCommandService _deliveryCommandService;
        private readonly ILegacyOrderCommandService _legacyOrderCommandService;
        private readonly IPeriodCloseQueryService _periodCloseQueryService;

        public ReceiveOrderDetailController(IMappingEngine mappingEngine
            , IEntityTimeQueryService entityTimeQueryService
            , IAuthenticationService authenticationService
            , IDeliveryCommandService deliveryCommandService
            , ILegacyOrderCommandService legacyOrderCommandService
            , IPeriodCloseQueryService periodCloseQueryService
            )
        {
            _mapper = mappingEngine;
            _entityTimeQueryService = entityTimeQueryService;
            _authenticationService = authenticationService;
            _deliveryCommandService = deliveryCommandService;
            _legacyOrderCommandService = legacyOrderCommandService;
            _periodCloseQueryService = periodCloseQueryService;
        }

        [Permission(Task.Inventory_Ordering_CanView)]
        public Boolean PostReceiveOrder(
            [FromUri]Int64 entityId,
            [FromUri]String applyDate,
            [FromUri]Int64 orderId,
            [FromUri]String invoiceNumber,
            [FromBody]IEnumerable<ReceiveOrderDetail> items)
        {                        
            var requestTime = _entityTimeQueryService.GetCurrentStoreTime(entityId);
            var user = _authenticationService.User;
            var request = new DeliveryReceiveRequest
            {
                Id = orderId,
                InvoiceNumber = invoiceNumber,
                ApplyTime = applyDate.AsDateTime() ?? requestTime,
                RequestTime = requestTime,
                RequestUser = user.UserName,
                Details = _mapper.Map<IEnumerable<DeliveryReceiveDetailRequest>>(items)
            };

            CheckPeriodStatus(entityId, request.ApplyTime, user);

            var auditUser = _mapper.Map<AuditUser>(_authenticationService.User);

            var result = _deliveryCommandService.ReceiveItemsOnDelivery(entityId, request, auditUser);

            ApplicationHub.RefreshNotifications(entityId);

            return result;
        }

        [Permission(Task.Inventory_Ordering_Receive_CanView)]
        public Boolean PostAdjustment(
            [FromUri] Int64 entityId,
            [FromUri] Int64 orderId,
            [FromBody] IEnumerable<ReceiveOrderDetail> items)
        {
            var requestTime = _entityTimeQueryService.GetCurrentStoreTime(entityId);

            var request = new DeliveryReceiveRequest
            {
                Id = orderId,
                ApplyTime = requestTime,
                RequestTime = requestTime,
                RequestUser = _authenticationService.User.UserName,
                Details = _mapper.Map<IEnumerable<DeliveryReceiveDetailRequest>>(items)
            };

            var auditUser = _mapper.Map<AuditUser>(_authenticationService.User);

            return _deliveryCommandService.AdjustItemsOnDelivery(entityId, request, auditUser);
        }

        [Permission(Task.Inventory_Ordering_CanChangeApplyDate)]
        public ChangeApplyDateResponse PostChangeApplyDate(
            [FromUri] Int64 orderId,
            [FromUri] String newApplyDate)
        {
            var applyDate = newApplyDate.AsDateTime() ?? DateTime.Now;
            var entityId = _authenticationService.User.MobileSettings.EntityId;
            var result = _legacyOrderCommandService.ChangeApplyDate(entityId, orderId, applyDate);
            return new ChangeApplyDateResponse
            {
                IsPeriodClosed = result.IsPeriodClosed,
                NewOrderId = result.NewOrderId
            };
        }

        private void CheckPeriodStatus(Int64 entityId, DateTime date, BusinessUser user)
        {
            var periodRequest = new PeriodCloseRequest
            {
                EntityId = entityId,
                CalendarDay = date
            };
            var period = _periodCloseQueryService.GetForDate(periodRequest);

            if (period.IsClosed && !user.Permission.HasPermission(Task.Orders_CanEditClosedPeriods))
            {
                throw new HttpResponseException(HttpStatusCode.Forbidden);
            }
        }
    }
}