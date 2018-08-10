using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web.Http;
using AutoMapper;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Deliveries.Services.Contracts.CommandServices;
using Mx.Deliveries.Services.Contracts.QueryServices;
using Mx.Deliveries.Services.Contracts.Requests;
using Mx.Services.Shared.Contracts;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Areas.Workforce.DriverDistance.Api.Models;
using Mx.Web.UI.Areas.Workforce.DriverDistance.Api.Models.Enums;
using Mx.Web.UI.Config.Translations;
using Mx.Web.UI.Config.WebApi;

namespace Mx.Web.UI.Areas.Workforce.DriverDistance.Api
{
    [Permission(Task.Labor_EmployeePortal_DriverDistance_CanViewOthersEntries)]
    public class DriverDistanceManagerController : ApiController
    {
        private readonly IMappingEngine _mappingEngine;
        private readonly IDriverDistanceQueryService _driverDistanceQueryService;
        private readonly ISupervisorAuthorizationService _supervisorAuthorizationService;
        private readonly IAuthenticationService _authenticationService;
        private readonly IDriverDistanceCommandService _driverDistanceCommandService;
        private readonly IEntityTimeQueryService _entityTimeQueryService;
        private readonly ITranslationService _translationService;
        private readonly IUserQueryService _userQueryService;

        public DriverDistanceManagerController(
            IMappingEngine mappingEngine,
            IDriverDistanceQueryService driverDistanceQueryService,
            ISupervisorAuthorizationService supervisorAuthorizationService,
            IAuthenticationService authenticationService,
            IDriverDistanceCommandService driverDistanceCommandService,
            IEntityTimeQueryService entityTimeQueryService,
            ITranslationService translationService,
            IUserQueryService userQueryService)
        {
            _mappingEngine = mappingEngine;
            _driverDistanceQueryService = driverDistanceQueryService;
            _supervisorAuthorizationService = supervisorAuthorizationService;
            _authenticationService = authenticationService;
            _driverDistanceCommandService = driverDistanceCommandService;
            _entityTimeQueryService = entityTimeQueryService;
            _translationService = translationService;
            _userQueryService = userQueryService;
        }

        public IEnumerable<DriverDistanceRecord> GetRecordsForEntityByDate(Int64 entityId, DateTime date)
        {
            var results = _driverDistanceQueryService.GetByEntityForDate(entityId, date);

            var mappedResults = _mappingEngine.Map<IEnumerable<DriverDistanceRecord>>(results);

            return mappedResults;
        }

        public void PutActionDriverDistanceRecord( [FromUri] Int64 entityId, [FromBody] ActionDriverDistanceRequest request)
        {
            var user = _authenticationService.User;

            CheckAuthorize(user, request.Authorization);

            var auditUser = _mappingEngine.Map<AuditUser>(user);
            var actionTime = _entityTimeQueryService.GetCurrentStoreTime(entityId);

            switch (request.Status)
            {
                case DriverDistanceStatus.Approved:
                    _driverDistanceCommandService.ApproveDriverDistance(request.DriverDistanceId, auditUser, actionTime);
                    break;
                case DriverDistanceStatus.Denied:
                    _driverDistanceCommandService.DenyDriverDistance(request.DriverDistanceId, auditUser, actionTime);
                    break;
            }

            ApplicationHub.RefreshNotifications(entityId);
        }

        public IEnumerable<Administration.User.Api.Models.User> GetActiveUsersByAssignedEntity([FromUri] Int64 entityId)
        {
            var results = _userQueryService.GetActiveUsersByAssignedEntity(entityId);

            var mappedAndOrderedResults = _mappingEngine.Map<IEnumerable<Administration.User.Api.Models.User>>(results)
                .OrderBy(x => x.FirstName).ThenBy(x => x.LastName);

            return mappedAndOrderedResults;
        }

        public Int64 Post([FromUri] Int64 entityId, [FromBody] CreateAuthorizedDriverDistanceRequest request)
        {
            var user = _authenticationService.User;
            var authorised = CheckAuthorize(user, request.Authorization, true);

            var currentTime = _entityTimeQueryService.GetCurrentStoreTime(entityId);
            var newDriverDistanceRequest = _mappingEngine.Map<AddDriverDistanceRequest>(request.CreateDriverDistanceRequest);

            newDriverDistanceRequest.EntityId = entityId;
            newDriverDistanceRequest.SubmitTime = currentTime;

            var responseId = _driverDistanceCommandService.CreateDriverDistance(newDriverDistanceRequest);

            if (responseId > 0)
            {
                var auditUser = _mappingEngine.Map<AuditUser>(user);

                if (authorised)
                {
                    _driverDistanceCommandService.ApproveDriverDistance(responseId, auditUser, currentTime);
                }
            }
            return responseId;
        }

        private Boolean CheckAuthorize(BusinessUser user, SupervisorAuthorization authorization, bool optional = false)
        {
            if (optional && string.IsNullOrEmpty(authorization.Password) && string.IsNullOrEmpty(authorization.UserName))
                return false;

            var approval = _supervisorAuthorizationService.Authorize(authorization,
                new[] { Task.Labor_EmployeePortal_DriverDistance_CanAuthorise });

            if (!approval.Authorized || approval.User.Id != user.Id)
            {
                var translations = _translationService.Translate<Models.L10N>(user.Culture);

                throw new CustomErrorMessageException(HttpStatusCode.Conflict, new ErrorMessage(translations.InvalidCredentials));
            }
            return true;
        }

    }
}