using System;
using System.Web.Http;
using Mx.Configuration;
using Mx.Foundation.Services.Contracts.PartnerLogin;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Areas.Core.PartnerRedirect.Api.Models;
using Mx.Web.UI.Config.WebApi;


namespace Mx.Web.UI.Areas.Core.PartnerRedirect.Api
{
    [Permission(Task.Core_PartnerRedirect_CanAccess)]
    public class PartnerRedirectController : ApiController
    {
        private readonly IConnectToPartnerService _connectToPartnerService;
        private readonly IAuthenticationService _authenticationService;

        public PartnerRedirectController(IConnectToPartnerService connectToPartnerService, IAuthenticationService authenticationService)
        {
            _connectToPartnerService = connectToPartnerService;
            _authenticationService = authenticationService;
        }

        public LinkRequest Get()
        {
            var userId = _authenticationService.User.Id;
            var timeStamp = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
            var site = Request.RequestUri.Authority;
            var signature = _connectToPartnerService.SignMxUser(userId, site, timeStamp, MxAppSettings.MxCertificateSubject);
            return new LinkRequest() { Url = MxAppSettings.PartnerSiteUrL, Signature = signature, UserId = userId, Timestamp = timeStamp, Site = site };
        }

    }
}