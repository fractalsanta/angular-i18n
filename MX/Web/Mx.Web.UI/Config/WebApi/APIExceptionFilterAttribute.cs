using System;
using System.Collections.Generic;
using System.Web.Http.Filters;
using Mx.Services.Shared.Exceptions;
using Mx.Services.Shared.Contracts.Exceptions;
using System.Net;
using System.Web.Http;
using System.Net.Http;
using System.Web;
using System.Linq;
using MMS.Utilities;

namespace Mx.Web.UI.Config.WebApi
{
    public class ApiExceptionFilterAttribute : ExceptionFilterAttribute
    {        
        public override void OnException(HttpActionExecutedContext context)
        {
            base.OnException(context);

            var exception = context.Exception;
            var url = context.Request.RequestUri.AbsoluteUri;
            var controller = context.ActionContext.ControllerContext.Controller.ToString();
                        
            Elmah.ErrorSignal.FromCurrentContext().Raise(exception);

            MxLogger.LogError(MxLogger.LogCategory.Mobile, MxLogger.EventId.BusinessLogic
                , (int)MxLogger.LogPriority.High, "MxConnect"
                , new Dictionary<string, object>
                {
                    { "Controller", controller},
                    { "Url", url }
                }
                , exception.ToString(), null);
                     
			if (exception is MissingResourceException)
			{
                HandleError(context.Request, HttpStatusCode.NotFound, Wrap(exception));
			}
			else if (exception is InvalidTokenException)
			{
                HandleError(context.Request, HttpStatusCode.Unauthorized, Wrap(exception));
			}
			else if (exception is InvalidCredentialsException)
			{
                HandleError(context.Request, HttpStatusCode.Unauthorized, Wrap(exception));
			}
            else if (exception is InvalidQueryParameterException)
            {
                HandleError(context.Request, HttpStatusCode.BadRequest, Wrap(exception));
            }
            else if (exception is NullReferenceException)
            {
                HandleError(context.Request, HttpStatusCode.BadRequest, Wrap(exception));
            }
            else if (exception is System.Data.DBConcurrencyException)
            {
                HandleError(context.Request, HttpStatusCode.Conflict, Wrap(exception));
            }
            else if (exception is ICustomException)
            {
                HandleError(context.Request, HttpStatusCode.InternalServerError, Wrap(exception));
            }
            else if (exception is CustomErrorMessageException)
            {
                var customException = exception as CustomErrorMessageException;
                HandleError(context.Request, customException.StatusCode, customException.CustomMessage);
            }
            else
            {
                HandleError(context.Request, HttpStatusCode.InternalServerError, Wrap(exception));
            }
		}

	    private ErrorMessage Wrap(Exception exception)
	    {
            return Wrap(exception != null ? string.Format("{0}: {1}", exception.GetType().Name, exception.Message) : "");
	    }

        private ErrorMessage Wrap(string message)
        {
            return new ErrorMessage(message.Replace("\r\n", " "));
        }

		protected void HandleError(HttpRequestMessage request, HttpStatusCode statusCode, ErrorMessage messageObject)
		{
            var msg = request.CreateResponse(statusCode, messageObject);
		    msg.ReasonPhrase = messageObject.Message;
            
			if (statusCode == HttpStatusCode.Unauthorized)
			{
				if (!HttpContext.Current.Request.Headers.AllKeys.Any(h => h.ToUpper() == "AUTHTOKEN"))
				{ 
					msg.Headers.Add("WWW-Authenticate", "Basic");
				}
			}
			
			throw new HttpResponseException(msg);
		}
	}
}