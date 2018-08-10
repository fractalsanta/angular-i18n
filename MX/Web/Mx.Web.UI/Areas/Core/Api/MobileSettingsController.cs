using System;
using System.Web.Http;
using AutoMapper;
using Mx.Foundation.Services.Contracts.CommandServices;
using Mx.Foundation.Services.Contracts.Requests;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Config.WebApi;

namespace Mx.Web.UI.Areas.Core.Api
{
    public class MobileSettingsController : ApiController
    {
        private readonly IUserAuthenticationCommandService _userAuthCommandService;

        public MobileSettingsController(IUserAuthenticationCommandService userAuthCommandService)
        {
            _userAuthCommandService = userAuthCommandService;
        }

        public void Post([FromBody] MobileSettings mobileSettings)
        {
            var user = User.Identity as BaseIdentity;
            if (user != null)
            {
                UpdateMobileSettings(mobileSettings, user.UserId);
            }
        }

        private void UpdateMobileSettings(MobileSettings mobileSettings, Int64 userId)
        {
            var request = Mapper.Map<MobileSettings, MobileSettingsRequest>(mobileSettings);

            _userAuthCommandService.UpdateMobileSettings(request, userId);

            // TODO Needs to be implemented
            //ProviderCache.RemoveUser(userName);
        }
    }
}