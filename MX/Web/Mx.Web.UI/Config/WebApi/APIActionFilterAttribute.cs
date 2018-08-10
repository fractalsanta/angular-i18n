using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading;
using System.Web;
using System.Web.Http.Filters;
using System.Security;
using System.Web.Http.Controllers;
using Mx.Web.UI.Areas.Core.Api.Services;
using StructureMap;

namespace Mx.Web.UI.Config.WebApi
{
    public class APIActionFilterAttribute : ActionFilterAttribute
    {
        private IAuthenticationService authenticationService;

        public APIActionFilterAttribute()
        {
            authenticationService = ObjectFactory.Container.GetInstance<IAuthenticationService>();
        }

        public APIActionFilterAttribute(IAuthenticationService authService)
        {
            authenticationService = authService;
        }

        public override void OnActionExecuting(HttpActionContext actionContext)
        {
            var controller = actionContext.ControllerContext.Controller;
            if (controller is RESTController)
            {
                var restController = (controller as RESTController);
                if (authenticationService.User == null)
                {	
                    // CHECK IF AUTHENTICATING WITH PSK
                    if (restController.Request.Headers.Any(h => h.Key.ToUpper() == "MXAUTHTOKEN"))
                    {
                        var pskHeader = restController.Request.Headers.First(h => h.Key.ToUpper() == "MXAUTHTOKEN");
                        if (pskHeader.Value.First() != Mx.Configuration.MxAppSettings.SecurityCode)
                        {
                            throw new InvalidTokenException();
                        }
                    }

                    else if (restController.Request.Headers.Authorization == null || string.IsNullOrEmpty(restController.Request.Headers.Authorization.Parameter))
                    {
                        throw new InvalidCredentialsException();
                    }

                    else
                    {
                        var encoding = new UTF8Encoding();
                        var authorizationParam = restController.Request.Headers.Authorization.Parameter;
                        var credentials = encoding.GetString(Convert.FromBase64String(authorizationParam));

                        int separator = credentials.IndexOf(':');
                        string name = credentials.Substring(0, separator);
                        string password = credentials.Substring(separator + 1);

                        var user = restController.UserAuthenticationQueryService.ValidateUser(name, password);
                        if (!user.IsValid)
                        {
                            throw new InvalidCredentialsException();
                        }
                        var identity = new BaseIdentity(user.Id, user.UserName);
                        Thread.CurrentPrincipal = new GenericPrincipal(identity, new string[0]);
                    }
                }
            }
        }
    }
}
