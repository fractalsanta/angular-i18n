using System;
using System.Web;
using System.Web.Security;

namespace Mx.Web.UI.Config.Sso
{
    public static class SsoCookieHelper
    {
        public static readonly string CookieName = FormsAuthentication.FormsCookieName;

        public static bool CheckCookieBasedSso()
        {
            if (!Saml.SamlHelper.IsMobileSamlEnabled)
            {
                if (HttpContext.Current.Request.Cookies[CookieName] != null)
                {
                    var authCookie = HttpContext.Current.Request.Cookies[CookieName];
                    if (authCookie != null)
                    {
                        try
                        {
                            var ticket = FormsAuthentication.Decrypt(authCookie.Value);
                            if (ticket != null)
                            {
                                return !ticket.Expired;
                            }
                        }
                        catch (Exception ex)
                        {
                            Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                        }
                    }
                }
            }
            return false;
        }

        public static void ClearSsoCookie(string ssoCookieName, bool setFormsAuthDomain = false)
        {
            var ssoCookie = HttpContext.Current.Request.Cookies[ssoCookieName];
            if (ssoCookie != null)
            {
                var cookie = new HttpCookie(ssoCookieName, "expired=true")
                {
                    HttpOnly = true,
                    Path = ssoCookie.Path,
                    Expires = new DateTime(1999, 10, 12),
                    Secure = ssoCookie.Secure
                };
                if ((FormsAuthentication.CookieDomain != null)&&(setFormsAuthDomain))
                {
                    cookie.Domain = FormsAuthentication.CookieDomain;
                }
                var response = HttpContext.Current.Response;
                response.Cookies.Remove(ssoCookieName);
                response.Cookies.Add(cookie);
            }
        }

        public static string CheckCookieSsoAndGetUser()
        {
            if (HttpContext.Current.Request.Cookies[CookieName] != null)
            {
                var authCookie = HttpContext.Current.Request.Cookies[CookieName];
                if (authCookie != null)
                {
                    try
                    {
                        var ticket = FormsAuthentication.Decrypt(authCookie.Value);
                        if (ticket != null && !ticket.Expired)
                        {
                            return ticket.Name;
                        }
                    }
                    catch (Exception ex)
                    {
                        Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                    }
                }
            }

            return null;
        }

        public static string CheckCookieAndGetPartnerId()
        {
            var partnerCookie = HttpContext.Current.Request.Cookies[Startup.AuthenticationCookiePartnerId];
            if (partnerCookie != null)
            {
                try
                {
                    return partnerCookie.Value;
                }
                catch (Exception ex)
                {
                    Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                }
            }

            return null;
        }

        public static void ClearCookiePartnerId()
        {
            var ssoCookie = HttpContext.Current.Request.Cookies[Startup.AuthenticationCookiePartnerId];
            if (ssoCookie != null)
            {
                var cookie = new HttpCookie(Startup.AuthenticationCookiePartnerId, "")
                {
                    HttpOnly = true,
                    Path = ssoCookie.Path,
                    Expires = new DateTime(1999, 10, 12),
                    Secure = ssoCookie.Secure
                };

                var response = HttpContext.Current.Response;
                response.Cookies.Add(cookie);
            }
        }
    }
}