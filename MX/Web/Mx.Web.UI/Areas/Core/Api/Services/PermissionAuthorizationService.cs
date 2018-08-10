using System;
using System.Linq;
using Mx.Web.UI.Config.WebApi;
using Mx.Web.UI.Areas.Core.Api.Models;

namespace Mx.Web.UI.Areas.Core.Api.Services
{
    public class PermissionAuthorizationService : IAuthorizationService
    {
        private readonly IAuthenticationService _authenticationService;

        public PermissionAuthorizationService(IAuthenticationService authenticationService)
        {
            _authenticationService = authenticationService;
        }

        public Boolean HasAuthorization(params Task[] tasks)
        {
            if (!tasks.Any()) return true;

            var user = _authenticationService.User;

            if (user == null)
            {
                throw new InvalidCredentialsException();
            }

            return tasks.All(task => user.Permission.HasPermission(task));
        }
    }
}