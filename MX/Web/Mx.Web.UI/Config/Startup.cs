using System.Diagnostics;
using System.Web.Http;
using System.Web.Optimization;
using System.Web.Routing;
using Microsoft.Owin;
using MMS.Utilities;
using Mx.Web.UI.Config.Mapping;
using Mx.Web.UI.Config.Saml;
using Owin;

[assembly: OwinStartup(typeof(Mx.Web.UI.Config.Startup))]
namespace Mx.Web.UI.Config
{
    public class Startup
    {
        public const string AuthenticationCookieName = "Auth";
        public const string SsoAuthCookieName = "SsoAuth";
        public const string AuthenticationCookiePartnerId = "PartnerId";
        public const string AuthenticationTokenName = "AuthToken";
        public const string SharedEntityIdCookie = "SharedEntityIdCookie";

        public void Configuration(IAppBuilder app)
        {            
            // For more information on how to configure your application, visit http://go.microsoft.com/fwlink/?LinkID=316888                        
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            SamlWebApiConfig.Map(RouteTable.Routes);
            SignalRHubConfig.Configure();
            SignalRHubConfig.SuppressTaskFailures();
            SignalRHubConfig.RegisterRoutes(app);
            ApiRoutingConfig.Map(RouteTable.Routes);
            IocConfig.ConfigureIoC();
            WebApiConfig.Configure(GlobalConfiguration.Configuration);
            WebApiConfig.RegisterHttpFilters(GlobalConfiguration.Configuration.Filters);
            AutoMapperConfigurator.Configure();
            SamlConfig.Configure();

#if DEBUG
            HibernatingRhinos.Profiler.Appender.NHibernate.NHibernateProfiler.Initialize();
#endif

            MxLogger.LogMessage(MxLogger.LogCategory.Mobile, MxLogger.EventId.Unspecified, MxLogger.LogPriority.High, TraceEventType.Information, "MxConnect", null, "Startup", null);
        }

    }
}
