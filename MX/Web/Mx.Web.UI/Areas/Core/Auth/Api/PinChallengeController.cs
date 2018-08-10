using System;
using System.Web.Http;
using Mx.Foundation.Services.Contracts.QueryServices;
using Mx.Foundation.Services.Contracts.Responses;
using Mx.Services.Shared;

namespace Mx.Web.UI.Areas.Core.Auth.Api
{
    public class PinChallengeController : ApiController
    {
        private readonly IUserAuthenticationQueryService _userAuthenticationQueryService;

        public PinChallengeController(
            IUserAuthenticationQueryService userAuthenticationQueryService)
        {
            _userAuthenticationQueryService = userAuthenticationQueryService;
        }

        [AllowAnonymous]
        public PasswordChallengeResponse Get(String username)
        {
            return _userAuthenticationQueryService.GeneratePinChallenge(username);
        }
    }
}