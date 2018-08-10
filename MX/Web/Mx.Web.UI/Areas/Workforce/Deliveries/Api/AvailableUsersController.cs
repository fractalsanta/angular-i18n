using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using AutoMapper;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Deliveries.Services.Contracts.QueryServices;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Areas.Workforce.Deliveries.Api.Models;
using Mx.Web.UI.Config.Helpers;
using Mx.Web.UI.Config.WebApi;

namespace Mx.Web.UI.Areas.Workforce.Deliveries.Api
{
    [Permission(Task.Labor_EmployeePortal_Deliveries_CanView)]
    public class AvailableUsersController : ApiController
    {
        private readonly IMappingEngine _mapper;
        private readonly IAuthenticationService _authenticationService;
        private readonly IAuthorizationService _authorizationService;
        private readonly IEntityTimeQueryService _entityTimeQueryService;
        private readonly ILabourWorkedShiftQueryService _labourWorkedShiftQueryService;

        public AvailableUsersController(
            IMappingEngine mapper,
            IAuthenticationService authenticationService,
            IAuthorizationService authorizationService,
            IEntityTimeQueryService entityTimeQueryService,
            ILabourWorkedShiftQueryService labourWorkedShiftQueryService)
        {
            _mapper = mapper;
            _authenticationService = authenticationService;
            _authorizationService = authorizationService;
            _entityTimeQueryService = entityTimeQueryService;
            _labourWorkedShiftQueryService = labourWorkedShiftQueryService;
        }

        public IEnumerable<ClockedOnUser> Get(long entityId, string date)
        {
            var user = _authenticationService.User;
            var storeDate = _entityTimeQueryService.GetCurrentStoreTime(entityId).Date;
            var selectedDate = (date ?? "").AsDateTime() ?? storeDate;

            var usersByEntityAndDate = _labourWorkedShiftQueryService.GetClockedOnUsersByEntityAndDate(entityId, selectedDate);
            var users = _mapper.Map<IEnumerable<ClockedOnUser>>(usersByEntityAndDate).ToList();

            if (!_authorizationService.HasAuthorization(Task.Labor_EmployeePortal_Deliveries_CanViewOthersEntries))
            {
                users.RemoveAll(u => u.Id != user.Id);
            }

            return users;
        }
    }
}