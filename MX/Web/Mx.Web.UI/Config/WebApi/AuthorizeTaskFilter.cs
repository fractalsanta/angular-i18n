
using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using Mx.Web.UI.Areas.Core.Api.Services;

namespace Mx.Web.UI.Config.WebApi
{
    public class AuthorizeTaskFilter : AuthorizationFilterAttribute
    {
        private readonly Func<IAuthorizationService> _authorizationServiceFactory;

        public AuthorizeTaskFilter(Func<IAuthorizationService> authorizationServiceFactory)
        {
            _authorizationServiceFactory = authorizationServiceFactory;
        }

        public override void OnAuthorization(HttpActionContext actionContext)
        {
            base.OnAuthorization(actionContext);

            var controllerAttributes =
                actionContext.ActionDescriptor.ControllerDescriptor.ControllerType.GetCustomAttributes(true);
            var actionAttributes = actionContext.ActionDescriptor.GetFilters();

            var permissions =
                controllerAttributes.Union(actionAttributes)
                    .OfType<PermissionAttribute>()
                    .SelectMany(p => p.Tasks)
                    .ToList();

            var authorised = _authorizationServiceFactory().HasAuthorization(permissions.ToArray());

            if (!authorised)
            {
                actionContext.Response = new HttpResponseMessage(HttpStatusCode.Forbidden);
            }
        }
    }

}