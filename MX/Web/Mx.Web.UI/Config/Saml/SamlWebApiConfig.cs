using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Routing;

namespace Mx.Web.UI.Config.Saml
{
    public static class SamlWebApiConfig
    {
        public static void Map(RouteCollection routes)
        {
            routes.MapHttpRoute("SSO", "Core/Sso/", new { controller = "Sso", action = "PostSsoLogon" });
            routes.MapHttpRoute("SsoLogout", "Core/Auth/Api/SsoLogoutLanding/", new { controller = "Sso", action = "SsoLogoutLanding" });
        }
    }
}