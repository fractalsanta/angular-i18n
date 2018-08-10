using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Http;
using Mx.Configuration;
using Mx.Foundation.Services.Contracts.PartnerLogin;
using Mx.Foundation.Services.Contracts.QueryServices;
using Mx.Services.Shared.Auditing.Enums;
using Mx.Services.Shared.Auditing.Interfaces;
using Mx.Services.Shared.Contracts;
using Mx.Services.Shared.Security.Interfaces;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Config;

namespace Mx.Web.UI.Areas.Core.Auth.Api
{
    public class PartnerLoginController : ApiController
    {
        private const string MobileLoginFailureAuditTitle = "Mobile Partner Login Failure";
        private readonly IPartnerLoginAuthenticationQueryService _partnerLoginAuthenticationQueryService;
        private readonly IUserAuthenticationQueryService _userAuthenticationQueryService;
        private readonly IAuthenticationTokenManagementService _tokenManagementService;
        private readonly IAuditService _auditService;
        private readonly INetUtilityService _netUtilityService;

        public PartnerLoginController(IPartnerLoginAuthenticationQueryService partnerLoginAuthenticationQueryService,
            IUserAuthenticationQueryService userAuthenticationQueryService,
            IAuthenticationTokenManagementService tokenManagementService, IAuditService auditService,
            INetUtilityService netUtilityService)
        {
            _partnerLoginAuthenticationQueryService = partnerLoginAuthenticationQueryService;
            _userAuthenticationQueryService = userAuthenticationQueryService;
            _tokenManagementService = tokenManagementService;
            _auditService = auditService;
            _netUtilityService = netUtilityService;
        }

        [AllowAnonymous]
        public HttpResponseMessage Post()
        {
            var partnerId = HttpContext.Current.Request.Form["userId"];
            var timestamp = HttpContext.Current.Request.Form["timestamp"];
            var signature = HttpContext.Current.Request.Form["signature"];
            var linkRequestContext = new LinkRequestContext
            {
                Signature = signature,
                PartnerUserId = partnerId,
                Timestamp = timestamp,
                PartnerCertificateLocation = MxAppSettings.PartnerCertificateLocation,
                PartnerLogonMaximumAgeOfRequest = MxAppSettings.PartnerLogonMaximumAgeOfRequest
            };

            var partnerAuthResult = _partnerLoginAuthenticationQueryService.ProcessPartnerCredentials(linkRequestContext);

            var response = ProcessAuthenticationResult(partnerAuthResult, partnerId);

            return response;
        }

        private HttpResponseMessage ProcessAuthenticationResult(PartnerLoginAuthenticationResponse partnerAuthResult, string partnerId)
        {
            var response = Request.CreateResponse(HttpStatusCode.Redirect);
            response.Headers.Location = new Uri(GetRedirectPage(), UriKind.Relative);

            if (partnerAuthResult.IsValidPartner)
            {
                if (partnerAuthResult.IsLinkedSuccessful)
                {
                    var user = _userAuthenticationQueryService.GetByUserName(partnerAuthResult.UserName);
                    var token = _tokenManagementService.CreateToken(user.UserName, user.Id, DateTime.Now);

                    response.Headers.AddCookies(new[] { CreateAuthenticationCookie(token) });
                }
                else
                {
                    // Not have a link from partner Id to user id yet, add a cookie and redirect.
                    if (AuthenticationCookieDoesNotExist())
                    {
                        response.Headers.AddCookies(new[] { CreatePartnerLinkCookie(partnerId) });
                    }
                }
            }
            else
            {
                AuditInvalidPartnerLogon(partnerId, partnerAuthResult.ErrorMessage);
            }

            return response;
        }

        private static bool AuthenticationCookieDoesNotExist()
        {
            return HttpContext.Current.Request.Cookies[Startup.AuthenticationCookieName] == null;
        }

        private static CookieHeaderValue CreateAuthenticationCookie(string token)
        {
            return new CookieHeaderValue(Startup.AuthenticationCookieName, "\"" + token + "\"")
            {
                Expires = DateTimeOffset.Now.AddDays(1),
                Domain = null,
                Path = "/"
            };
        }

        private static CookieHeaderValue CreatePartnerLinkCookie(string partnerId)
        {
            return new CookieHeaderValue(Startup.AuthenticationCookiePartnerId, partnerId)
            {
                //Expires = DateTimeOffset.Now.AddDays(1), Session expiry
                Domain = null,
                Path = "/"
            };
        }

        private string GetRedirectPage()
        {
            var goToPage = HttpContext.Current.Request.Form["goToPage"];
            var result = "/";
            if (!string.IsNullOrEmpty(goToPage))
            {
                result = "/#/" + goToPage;
            }

            return result;
        }

        private void AuditInvalidPartnerLogon(string partnerId, string errorMsg)
        {
            var auditString = string.Format("Partner Login attempt failed for partnerId: {0}. Ex : {1}", partnerId, errorMsg);
            var user = new AuditUser { UserName = partnerId };
            _auditService.AuditEvent(user, AuditEvent.SystemAdmin_MxConnectUserLoginFailure, MobileLoginFailureAuditTitle, auditString, _netUtilityService.GetClientIpAddress(HttpContext.Current.Request));
        }
    }
}