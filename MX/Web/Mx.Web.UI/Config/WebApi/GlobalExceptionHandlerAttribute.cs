using System.Net;
using System.Net.Http;
using System.Web.Http.Filters;

namespace Mx.Web.UI.Config.WebApi
{
    public class GlobalExceptionHandlerAttribute : ExceptionFilterAttribute
    {
        public override void OnException(HttpActionExecutedContext actionExecutedContext)
        {
            actionExecutedContext.Response = actionExecutedContext.Request.CreateErrorResponse(HttpStatusCode.BadRequest, actionExecutedContext.Exception.Message);
        }
    }
}