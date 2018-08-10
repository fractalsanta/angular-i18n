using System;
using System.Net;
using System.Web.Http;
using AutoMapper;
using Mx.Deliveries.Services.Contracts.CommandServices;
using Mx.Deliveries.Services.Contracts.QueryServices;
using Mx.Deliveries.Services.Contracts.Requests;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Areas.Workforce.Deliveries.Api.Models;
using Mx.Web.UI.Areas.Workforce.Deliveries.Api.Models.Enums;
using Mx.Web.UI.Config.WebApi;

namespace Mx.Web.UI.Areas.Workforce.Deliveries.Api
{
    [Permission(Task.Labor_EmployeePortal_Deliveries_CanView, Task.Labor_EmployeePortal_ExtraDeliveries_CanAuthorise)]
    public class DeliveriesAuthorizeController : ApiController
    {
        private readonly IMappingEngine _mapper;
        private readonly IAuthenticationService _authenticationService;
        private readonly ISupervisorAuthorizationService _supervisorAuthorizationService;
        private readonly ITransactionDeliveryQueryService _transactionDeliveryQueryService;
        private readonly ITransactionDeliveryCommandService _transactionDeliveryCommandService;

        public DeliveriesAuthorizeController(
            IMappingEngine mapper,
            IAuthenticationService authenticationService,
            ISupervisorAuthorizationService supervisorAuthorizationService,
            ITransactionDeliveryQueryService transactionDeliveryQueryService,
            ITransactionDeliveryCommandService transactionDeliveryCommandService)
        {
            _mapper = mapper;
            _authenticationService = authenticationService;
            _supervisorAuthorizationService = supervisorAuthorizationService;
            _transactionDeliveryQueryService = transactionDeliveryQueryService;
            _transactionDeliveryCommandService = transactionDeliveryCommandService;
        }

        public bool Put( [FromUri] Int64 entityId, [FromBody] DeliveryAuthorisedRequest request)
        {
            var user = _authenticationService.User;

            var approval = _supervisorAuthorizationService.Authorize(request.Authorization,
                new[] {Task.Labor_EmployeePortal_ExtraDeliveries_CanAuthorise});
            if (!approval.Authorized || approval.User.Id != _authenticationService.UserId)
            {
                // TODO:   Localise
                throw new CustomErrorMessageException(HttpStatusCode.Conflict, new ErrorMessage("InvalidCredentials"));
            }

            var deliveryRequest = _mapper.Map<ExtraDeliveryRequest>(_transactionDeliveryQueryService.GetById(request.Id));

            deliveryRequest.Status = request.Status;
            deliveryRequest.AuthorisedByUserId = user.Id;
            deliveryRequest.AuthorisedByUserName = user.FirstName + " " + user.LastName;

            if (request.Status == ExtraDeliveryOrderStatus.Denied)
            {
                deliveryRequest.DenyReason = request.DenyReason;
            }

            _transactionDeliveryCommandService.UpdateTransactionDelivery(_mapper.Map<TransactionDeliveryRequest>(deliveryRequest));

            return true;
        }
    }
}