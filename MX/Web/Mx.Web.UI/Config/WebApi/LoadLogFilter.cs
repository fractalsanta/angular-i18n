using System;
using System.Diagnostics;
using System.Text;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using StackExchange.Profiling;

namespace Mx.Web.UI.Config.WebApi
{
    public class LoadLogFilter : ActionFilterAttribute
    {

        private const string MiniProfilerKey = "LoadLogFilter.MiniProfiler.Value";

        public override void OnActionExecuting(HttpActionContext actionContext)
        {
            base.OnActionExecuting(actionContext);

#if DEBUG
            var logMessage =
                new StringBuilder("Controller: " + actionContext.ActionDescriptor.ControllerDescriptor.ControllerName + ". ");
            logMessage.Append("ActionName: " + actionContext.ActionDescriptor.ActionName + ". ");
            logMessage.Append("Method: " + actionContext.Request.Method + ". ");


            actionContext.Request.Properties[MiniProfilerKey] = MiniProfiler.Current.Step(logMessage.ToString()); 
#endif

        }

        public override void OnActionExecuted(HttpActionExecutedContext actionExecutedContext)
        {
            base.OnActionExecuted(actionExecutedContext);

#if DEBUG
            var profiler = actionExecutedContext.Request.Properties[MiniProfilerKey] as IDisposable;
            if (profiler != null)
            {
                profiler.Dispose();
            }
#endif



        }
    }
}