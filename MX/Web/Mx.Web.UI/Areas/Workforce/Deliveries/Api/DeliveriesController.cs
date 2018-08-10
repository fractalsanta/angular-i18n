using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web.Http;
using AutoMapper;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Deliveries.Services.Contracts.CommandServices;
using Mx.Deliveries.Services.Contracts.Enums;
using Mx.Deliveries.Services.Contracts.QueryServices;
using Mx.Deliveries.Services.Contracts.Requests;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Areas.Workforce.Deliveries.Api.Models;
using Mx.Web.UI.Areas.Workforce.Deliveries.Api.Models.Enums;
using Mx.Web.UI.Config.Helpers;
using Mx.Web.UI.Config.WebApi;
using TransactionDeliveryType = Mx.Web.UI.Areas.Workforce.Deliveries.Api.Models.Enums.TransactionDeliveryType;

namespace Mx.Web.UI.Areas.Workforce.Deliveries.Api
{
    [Permission(Task.Labor_EmployeePortal_Deliveries_CanView)]
    public class DeliveriesController : ApiController
    {
        private readonly IMappingEngine _mapper;
        private readonly IAuthenticationService _authenticationService;
        private readonly IEntityTimeQueryService _entityTimeQueryService;
        private readonly ISupervisorAuthorizationService _supervisorAuthorizationService;
        private readonly ITransactionDeliveryQueryService _transactionDeliveryQueryService;
        private readonly ITransactionDeliveryCommandService _transactionDeliveryCommandService;

        public DeliveriesController(
            IMappingEngine mapper,
            IAuthenticationService authenticationService,
            IEntityTimeQueryService entityTimeQueryService,
            ISupervisorAuthorizationService supervisorAuthorizationService,
            ITransactionDeliveryQueryService transactionDeliveryQueryService,
            ITransactionDeliveryCommandService transactionDeliveryCommandService)
        {
            _mapper = mapper;
            _authenticationService = authenticationService;
            _entityTimeQueryService = entityTimeQueryService;
            _supervisorAuthorizationService = supervisorAuthorizationService;
            _transactionDeliveryQueryService = transactionDeliveryQueryService;
            _transactionDeliveryCommandService = transactionDeliveryCommandService;
        }

        public DeliveryData Get(long entityId, string date)
        {
            var user = _authenticationService.User;
            var storeDate = _entityTimeQueryService.GetCurrentStoreTime(entityId).Date;
            var selectedDate = (date ?? "").AsDateTime() ?? storeDate;

            var allDeliveries = _mapper.Map<IEnumerable<ExtraDeliveryRequest>>(
                    _transactionDeliveryQueryService.GetByEntityAndDateRange(entityId, selectedDate, selectedDate))
                    .ToList();

            var deliveryData = new DeliveryData
            {
                SelectedDate = selectedDate,
                MaxDate = storeDate
            };

            if (user.Permission.HasPermission(Task.Labor_EmployeePortal_Deliveries_CanViewOthersEntries))
            {
                deliveryData.ExtraDeliveryRequests = allDeliveries.Where(delivery =>
                    delivery.DeliveryType == TransactionDeliveryType.Extra);
                deliveryData.DeliveriesQty = allDeliveries.Count(delivery =>
                    delivery.DeliveryType == TransactionDeliveryType.Regular);
                deliveryData.ExtraDeliveriesQty = allDeliveries.Count(delivery =>
                    delivery.DeliveryType == TransactionDeliveryType.Extra &&
                    delivery.Status == ExtraDeliveryOrderStatus.Approved);
                deliveryData.TotalDeliveriesQty = deliveryData.DeliveriesQty + deliveryData.ExtraDeliveriesQty;
            }
            else
            {
                deliveryData.ExtraDeliveryRequests = allDeliveries
                    .Where(d => d.DeliveryType == TransactionDeliveryType.Extra && d.User.Id == user.Id)
                    .ToList();
            }

            return deliveryData;
        }

        public void Post( [FromUri] long entityId, [FromBody] ExtraDeliveryRequest request)
        {
            var user = _authenticationService.User;
            var approval = _supervisorAuthorizationService.Authorize(request.Authorization,
                new[] {Task.Labor_EmployeePortal_ExtraDeliveries_CanAuthorise});

            if ((request.Authorization.UserName.HasValue() || request.Authorization.Password.HasValue()) &&
                (!approval.Authorized || approval.User.Id != _authenticationService.UserId))
            {
                // TODO:   Localise
                throw new CustomErrorMessageException(HttpStatusCode.Conflict, new ErrorMessage("InvalidCredentials"));
            }

            var tdr = _mapper.Map<TransactionDeliveryRequest>(request);
            
            tdr.EntityId = _authenticationService.User.MobileSettings.EntityId;
            tdr.DeliveryType = Mx.Deliveries.Services.Contracts.Enums.TransactionDeliveryType.Extra;
            
            if (approval.Authorized)
            {
                tdr.Status = TransactionDeliveryStatus.Approved;
                tdr.AuthorisedByUserId = user.Id;
                tdr.AuthorisedByUserName = user.FirstName + " " + user.LastName;
            }
            else
            {
                tdr.Status = TransactionDeliveryStatus.Pending;
            }

            _transactionDeliveryCommandService.CreateTransactionDelivery(tdr);

        }
    }
}