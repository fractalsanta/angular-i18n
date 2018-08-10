using System.Collections.Generic;
using System.Web;
using System.Web.Http;
using System.Web.Security;
using Mx.Web.UI.Config;
using Mx.Web.UI.Config.Saml;
using Mx.Web.UI.Config.Sso;

namespace Mx.Web.UI.Areas.Core.Auth.Api
{
    [AllowAnonymous]
    public class SsoLogoutController : ApiController
    {
        public const string SpX509Certificate = "spX509Certificate";

        public SsoLogoutResponce PostSsoLogout()
        {
            if (SamlHelper.IsSamlEnabled)
            {
                var username = HttpContext.Current.User.Identity.Name;
                // handles scenario where session timeout reached and there is no http context to get username
                if (string.IsNullOrEmpty(username))
                {
                    var token = HttpContext.Current.Request.Headers[Startup.AuthenticationTokenName];
                    var ticket = FormsAuthentication.Decrypt(token);
                    if ((ticket != null))
                    {
                        username = ticket.Name;
                    }
                }

                var url = SamlHelper.LogoutSaml(username);
                return new SsoLogoutResponce
                {
                    RedirectUrl = url
                };
            }
            SsoCookieHelper.ClearSsoCookie(FormsAuthentication.FormsCookieName,true);
            return new SsoLogoutResponce();
        }

        public class SsoLogoutResponce 
        {
            public string RedirectUrl { get; set; }
        }
    }
}