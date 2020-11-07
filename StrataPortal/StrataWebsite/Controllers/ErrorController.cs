using System;
using System.Web;
using System.Web.Mvc;
using Agile.Diagnostics.Logging;
using Rockend.WebAccess.Common.Helpers;
using Rockend.iStrata.StrataWebsite.Helpers;
using Rockend.iStrata.StrataWebsite.Model;

namespace Rockend.iStrata.StrataWebsite.Controllers
{
    /// <summary>
    /// Handles the display of all website errors
    /// </summary>
    public class ErrorController : Controller
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="ErrorController"/> class.
        /// </summary>
        public ErrorController()
        {
            TempDataProvider = new NullTempDataProvider();
        }

        /// <summary>
        /// Displays the Message view with the specified exception details.
        /// </summary>
        /// <param name="exception">The exception that occurred.</param>
        /// <returns>View ActionResult.</returns>
        public ActionResult Http500(Exception exception)
        {
            Logger.Error(exception, "ErrorController Http500");

            string errorMessage = exception is WebAccessException 
                ? exception.Message 
                : "An internal error has occurred in the application. Please try your request again.";

            string returnUrl = null;
            if (HttpContext.Request.UrlReferrer != null)
            {
                returnUrl = HttpContext.Request.UrlReferrer.AbsoluteUri;
            }
            var message = new MessageModel(
                "An error has occurred",
                errorMessage,
                returnUrl);
            HttpContext.Response.StatusCode = 500;
            return View("Message", message);
        }

        /// <summary>
        /// Displays a 404 message in the Message view.
        /// </summary>
        /// <returns>View ActionResult.</returns>
        public ActionResult Http404()
        {
            Logger.Error("ErrorController Http404");
            var message = new MessageModel(
                "Resource not found",
                "The specified resource was not found at " + HttpContext.Request.Url,
                null);
            HttpContext.Response.StatusCode = 404;
            return View("Message", message);
        }
        
        public ActionResult NotFound()
        {
            return View();
        }

        //public ActionResult Test()
        //{
        //    throw new Exception("Test Error!");
        //}
    }
}
