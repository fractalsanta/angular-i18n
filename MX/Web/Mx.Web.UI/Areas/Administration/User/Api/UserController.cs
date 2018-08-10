using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using AutoMapper;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Administration.Services.Contracts.CommandServices;
using Mx.Services.Shared.Contracts;
using Mx.Web.UI.Areas.Administration.User.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Administration.Services.Contracts.Requests;
using Mx.Web.UI.Config.WebApi;

namespace Mx.Web.UI.Areas.Administration.User.Api
{
    [Permission(Task.Administration_UserSetup_CanView)]
    public class UserController : ApiController
    {
        private readonly IMappingEngine _mappingEngine;
        private readonly IUserQueryService _userQueryService;
        private readonly ISecurityGroupQueryService _securityGroupQueryService;
        private readonly IAuthorizationService _authorizationService;
        private readonly IAuthenticationService _authenticationService;
        private readonly IUserCommandService _userCommandService;

        public UserController(
            IMappingEngine mappingEngine,
            IUserQueryService userQueryService,
            ISecurityGroupQueryService securityGroupQueryService,
            IAuthorizationService authorizationService,
            IAuthenticationService authenticationService,
            IUserCommandService userCommandService)
        {
            _mappingEngine = mappingEngine;
            _userQueryService = userQueryService;
            _securityGroupQueryService = securityGroupQueryService;
            _authorizationService = authorizationService;
            _authenticationService = authenticationService;
            _userCommandService = userCommandService;
        }

        public IEnumerable<Models.User> GetUsers([FromUri] Int64 entityId, [FromUri] Boolean includeDescendents = false, [FromUri] Boolean includeTerminated = false)
        {
            var results = _userQueryService.GetByEntityIdWithEntity(entityId, includeDescendents);

            if (!includeTerminated)
            {
                results = results.Where(x => x.Status != "Terminated");
            }

            return _mappingEngine.Map<IEnumerable<Models.User>>(results).OrderBy(x => x.LastName).ThenBy(x => x.FirstName).ThenBy(x => x.MiddleName);
        }

        public IEnumerable<SecurityGroup> GetSecurityGroups()
        {
            var user = _authenticationService.User;

            var securityGroups = _authorizationService.HasAuthorization(Task.Security_CanAccessAllGroups) ?
                _securityGroupQueryService.GetAll() :
                _securityGroupQueryService.GetAccessibleGroups(user.Id);

            return _mappingEngine.Map<IEnumerable<SecurityGroup>>(securityGroups);
        }

        public Int64 PostCreateNewUser(
            [FromUri] Int64 entityId,
            [FromUri] String employeeNumber,
            [FromUri] String firstName,
            [FromUri] String lastName,
            [FromUri] String middleName,
            [FromUri] String userName,
            [FromUri] String password,
            [FromUri] List<Int64> securityGroups
            )
        {
            var user = _authenticationService.User;

            var request = new BasicUserRequest
            {
                EmployeeNumber = employeeNumber,
                FirstName = firstName,
                LastName = lastName,
                MiddleName = middleName,
                Password = password,
                SecurityGroups = securityGroups,
                UserName = userName,
                EntityId = entityId,
                AuditUser = _mappingEngine.Map<AuditUser>(user)
            };

            var id = _userCommandService.CreateNewUser(request);

            return id;
        }

        public String GetUserNameFromFirstNameAndLastName(
            [FromUri] String firstName,
            [FromUri] String lastName
            )
        {
            var request = new BasicUserRequest
            {
                FirstName = firstName,
                LastName = lastName
            };

            var userName = _userQueryService.GetUniqueUserNameFromFirstNameAndLastName(request);

            return userName;
        }

        public void PutUpdateBasicUser(
          [FromUri] Int64 id,
          [FromUri] Int64 entityId,
          [FromUri] String employeeNumber,
          [FromUri] String firstName,
          [FromUri] String lastName,
          [FromUri] String middleName,
          [FromUri] String userName,
          [FromUri] String password,
          [FromUri] String status
          )
        {
            var user = _authenticationService.User;

            var request = new BasicUserRequest
            {
                Id = id,
                EmployeeNumber = employeeNumber,
                FirstName = firstName,
                LastName = lastName,
                MiddleName = middleName,
                Password = password,
                UserName = userName,
                EntityId = entityId,
                Status = status,
                AuditUser = _mappingEngine.Map<AuditUser>(user)
            };

            _userCommandService.UpdateBasicUser(request);

        }

        public void PutUpdateUserSecurityGroups(
          [FromUri] Int64 userId,
          [FromUri] List<Int64> securityGroups
          )
        {
            var user = _authenticationService.User;

            var request = new UpdateUserSecurityGroupsRequest
            {
                UserId = userId,
                SecurityGroups = securityGroups,
                AuditUser = _mappingEngine.Map<AuditUser>(user)
            };

            _userCommandService.UpdateUserSecurityGroups(request);
        }
    }
}