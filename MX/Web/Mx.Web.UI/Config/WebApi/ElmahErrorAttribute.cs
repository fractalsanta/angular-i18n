using System.Web.Http.Filters;

namespace Mx.Web.UI.Config.WebApi
{
    public class ElmahErrorAttribute : ExceptionFilterAttribute
    {
        public override void OnException(HttpActionExecutedContext context)
        {
            if (context.Exception != null)
                Elmah.ErrorSignal.FromCurrentContext().Raise(context.Exception);
            base.OnException(context);
        }
    }
}