using System;
using System.Net;
using System.Web.Mvc;

namespace Mx.Web.Shared.Results
{
    public class JsonStatusResult : JsonResult
    {
        public JsonStatusResult(HttpStatusCode httpStatusCode, String message, Object data)
            : this(httpStatusCode, message)
        {
            Data = data;
        }

        public JsonStatusResult(HttpStatusCode httpStatusCode, String message, Object data, JsonRequestBehavior behavior)
            : this(httpStatusCode, message)
        {
            Data = data;
            JsonRequestBehavior = behavior;
        }

        public JsonStatusResult(HttpStatusCode httpStatusCode, String message)
        {
            StatusCode = httpStatusCode;
            StatusDescription = message;
        }

        public HttpStatusCode StatusCode { get; private set; }
        public String StatusDescription { get; set; }

        public override void ExecuteResult(ControllerContext context)
        {
            context.HttpContext.Response.StatusCode = (int)StatusCode;
            context.HttpContext.Response.StatusDescription = StatusDescription;

            base.ExecuteResult(context);
        }
    }
}