using System.Web.Http;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Config.IoC;
using StructureMap;
using Mx.Web.UI.Config.WebApi;
using System.Web.Http.Filters;
using Mx.Web.UI.Areas.Forecasting.Api;

namespace Mx.Web.UI.Config
{
    public static class WebApiConfig
    {
        public static void Configure(HttpConfiguration configuration)
        {
            configuration.DependencyResolver = new StructureMapDependencyResolver(ObjectFactory.Container);           
            configuration.Filters.Add(new AuthorizeAttribute());
            var filter = new AuthorizeTaskFilter(() => ObjectFactory.Container.GetInstance<IAuthorizationService>());
            configuration.Filters.Add(filter);
            configuration.Filters.Add(new ElmahErrorAttribute());
            configuration.Filters.Add(new GlobalExceptionHandlerAttribute());
            var tokenAuthHandler = new TokenAuthenticationHandler(() => ObjectFactory.Container.GetInstance<IAuthenticationTokenManagementService>());
            configuration.MessageHandlers.Add(tokenAuthHandler);
        }

        public static void RegisterHttpFilters(HttpFilterCollection filters)
        {
            filters.Add(new ApiExceptionFilterAttribute());
            filters.Add(new APIActionFilterAttribute(ObjectFactory.Container.GetInstance<IAuthenticationService>()));
        }
    }
}