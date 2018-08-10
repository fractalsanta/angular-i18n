using System.Security.Authentication;
using System.Threading;
using AutoMapper;
using Mx.Foundation.Services.Contracts.QueryServices;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Config.WebApi;

namespace Mx.Web.UI.Areas.Core.Api.Services
{
    public class ThreadPrincipalAuthenticationService : IAuthenticationService
    {
        private readonly IUserAuthenticationQueryService _userAuthenticationQueryService;

        public ThreadPrincipalAuthenticationService(IUserAuthenticationQueryService userAuthenticationQueryService)
        {
            _userAuthenticationQueryService = userAuthenticationQueryService;
        }
        public BusinessUser User
        {
            get
            {
                var userIdentity = Thread.CurrentPrincipal.Identity as BaseIdentity;
                if (userIdentity == null)
                {
                    return null;
                }
                var user = _userAuthenticationQueryService.GetByUserId(userIdentity.UserId);
                return Mapper.Map<BusinessUser>(user);
            }
        }

        public long UserId
        {
            get
            {
                var userIdentity = Thread.CurrentPrincipal.Identity as BaseIdentity;

                if (userIdentity == null)
                {
                    throw new AuthenticationException("No user found.");
                }
                return userIdentity.UserId;
            }
        }
    }
}