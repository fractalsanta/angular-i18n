using System.Data.SqlClient;
using System.Threading.Tasks;
using Elmah;
using Microsoft.AspNet.SignalR;
using Mx.Configuration;
using Mx.Web.UI.Config.SignalR;
using Owin;

namespace Mx.Web.UI.Config
{
    public static class SignalRHubConfig
    {
        private static RedisTracker _tracker;

        public static bool IsBackplane
        {
            get { return (_tracker != null); }
        }

        public static bool IsBackplaneActive
        {
            get { return (_tracker == null || _tracker.IsActive); }
        }

        public static void Configure()
        {
            GlobalHost.Configuration.DefaultMessageBufferSize = MxAppSettings.SignalR_DefaultMessageBufferSize;

            if (!MxAppSettings.RedisServer_KeyExists)
            {
                return;
            }

            //ErrorLog.GetDefault(null).Log(new Error(new Exception("Connecting to " + MxAppSettings.RedisServer)));

            // use database name as the signalR pub/sub topic. It's critical to make this unique per environment as Redis is shared infrastructure
            var builder = new SqlConnectionStringBuilder(MxAppSettings.ConnectionString);

            GlobalHost.DependencyResolver.UseRedis( new RedisScaleoutConfiguration(MxAppSettings.RedisServer, builder.InitialCatalog.ToUpper() ) );

           _tracker = new RedisTracker(MxAppSettings.RedisServer);
        }

        public static void SuppressTaskFailures()
        {
            TaskScheduler.UnobservedTaskException += (s, arg) =>
            {
                arg.SetObserved();
                arg.Exception.Handle(ex =>
                {
                    // Cannot use HTTP context in background threads
                    ErrorLog.GetDefault(null).Log(new Error(ex));
                    return true;
                });
            };
        }

        public static void RegisterRoutes(IAppBuilder app)
        {
            app.MapSignalR(new HubConfiguration { EnableDetailedErrors = true, EnableJavaScriptProxies = false });
        }
    }
}