using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Rockend.iStrata.StrataWebsite
{
    public class MobileViewEngine : RazorViewEngine
    {
        public override ViewEngineResult FindView(ControllerContext controllerContext, string viewName, string masterName, bool useCache)
        {
            ViewEngineResult result = null;
            var request = controllerContext.HttpContext.Request;

            // Avoid unnecessary checks if this device isn't suspected to be a mobile device
            if (request.Browser.IsMobileDevice && !IsIPad())
            {
                result = base.FindView(controllerContext, "Mobile/" + viewName, masterName, false);
            }
        
            // Fall back to desktop view if no other view has been selected
            if (result == null || result.View == null)
            {
                result = base.FindView(controllerContext, viewName, masterName, useCache);
            }

            return result;
        }

        public static bool IsIPad()
        {
            try
            {
                var request = HttpContext.Current.Request;

                return request.UserAgent != null && request.UserAgent.ToLower().Contains("ipad");
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}