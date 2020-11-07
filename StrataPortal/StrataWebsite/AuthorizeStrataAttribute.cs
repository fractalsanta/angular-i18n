using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using Agile.Diagnostics.Logging;
using Rockend.iStrata.StrataWebsite.Helpers;

namespace Rockend.iStrata.StrataWebsite
{
    /// <summary>
    /// AuthorizeStrataAttribute
    /// </summary>
    public class AuthorizeStrataAttribute : AuthorizeAttribute
    {
        /// <summary>
        ///  Override to ensure user is redirected to Login
        /// screen when the session has expired
        /// </summary>
        protected override bool AuthorizeCore(HttpContextBase httpContext)
        {
            // note: don't put user specific checks here, e.g. don't check if a user has access to a specific report.
            // If you do then if they do not have access then they will be redirected to the Login screen, which is totally not what you want to happen.
            if (!httpContext.Request.IsAuthenticated)
            {
                Logger.Info("Not Authorized - Session expired");
                return false;
            }

            return true;
        }

        protected override void HandleUnauthorizedRequest(AuthorizationContext filterContext)
        {
            // need to redirect to Login, otherwise we get a 401 error page
            var routeValues = new RouteValueDictionary();
            routeValues["controller"] = "Login";
            routeValues["action"] = "Login";
            //Other route values if needed.

            string appKey = AppKeyHelper.GetApplicationKeyFromUrl();

            if (!string.IsNullOrWhiteSpace(appKey) && appKey.Length > 1)
            {
                routeValues["aid"] = appKey;
            }

            filterContext.Result = new RedirectToRouteResult(routeValues);

        }

    }
}