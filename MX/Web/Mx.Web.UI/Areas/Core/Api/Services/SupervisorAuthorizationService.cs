using System.Linq;
using AutoMapper;
using Mx.Foundation.Services.Contracts.QueryServices;
using Mx.Web.UI.Areas.Core.Api.Models;

namespace Mx.Web.UI.Areas.Core.Api.Services
{
    public class SupervisorAuthorizationService : ISupervisorAuthorizationService
    {
        private readonly IUserAuthenticationQueryService _userAuthenticationQueryService;

        public SupervisorAuthorizationService(IUserAuthenticationQueryService userAuthenticationQueryService) 
        {
            _userAuthenticationQueryService = userAuthenticationQueryService;
        }

        public SupervisorAuthorizationResponse Authorize(SupervisorAuthorization auth, Task[] tasks)
        {
            if (string.IsNullOrWhiteSpace(auth.UserName)
                || string.IsNullOrWhiteSpace(auth.Password))
            {
                return new SupervisorAuthorizationResponse
                {
                    Authorized = false,
                };
            }
            var response = _userAuthenticationQueryService.ValidateUser(auth.UserName, auth.Password);
            if (!response.IsValid)
            {
                return new SupervisorAuthorizationResponse
                {
                    Authorized = false,
                };
            }

            var userResponse = _userAuthenticationQueryService.GetByUserId(response.Id);

            var businessUser = Mapper.Map<BusinessUser>(userResponse);

            return new SupervisorAuthorizationResponse
            {
                User = businessUser,
                Authorized = tasks.All(task => businessUser.Permission.HasPermission(task))
            };
        }

    }
}