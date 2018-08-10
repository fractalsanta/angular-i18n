using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Linq;
using System.Reactive.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using Agile.Diagnostics.Loggers;
using Agile.Diagnostics.Logging;
using Autofac;
using Autofac.Integration.Mvc;
using Common.Web.Server;
using Communicator.DAL;
using Microsoft.WindowsAzure.ServiceRuntime;
using Rockend.Azure;
using Rockend.Cms;
using Rockend.Cms.Providers;
using Rockend.Web.Security;
using System.Configuration;
using System.IO;
using Rockend.iStrata.StrataWebsite.Controllers;
using System.Web.Security;
using System.Security.Principal;

namespace Rockend.iStrata.StrataWebsite
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class MvcApplication : HttpApplication
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
//            filters.Add(new HandleErrorAttribute());
        }

        public static void RegisterRoutes(RouteCollection routes)
        {
            Logger.Debug("RegisterRoutes");
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            routes.IgnoreRoute("Error/{*pathInfo}");
            routes.IgnoreRoute("{*favicon}", new { favicon = @"(.*/)?favicon.ico(/.*)?" });


            routes.MapRoute("demo", // Route name
                "demo", // URL with parameters
                new
                {
                    controller = "sales",
                    action = "demo"
                } // Parameter defaults
                );

            routes.MapRoute("Login", 
                "Login", 
                new { 
                    controller = "Login", 
                    action = "Login" 
                });

            routes.MapRoute(
                "LoggedInRoute", // Route name
                "{applicationKey}/{controller}/{action}"
            );

            routes.MapRoute(
                "Default",                                       // Route name
                "{controller}/{action}",                         // URL with parameters
                new { controller = "Login", action = "Login" }  // Parameter defaults
            );



        }

        protected void Application_Start()
        {
            Logger.Debug("Application_Start");
#if DEBUG
            var logFilePath = ConfigurationManager.AppSettings["LogFilePath"];
            Debug.WriteLine(string.Format("LogFilePath: {0}", logFilePath));
            Logger.InitializeLogging(new List<ILogger>
            {
                new DebugLogger()
                , new DayOfWeekFileLogger(logFilePath, "strataWeb")
            }, LogLevel.All); 
#endif  // otherwise use the default Trace logger....


            RegisterRoutes(RouteTable.Routes);

            ViewEngines.Engines.Add(new MobileViewEngine());

            var builder = GetContainerBuilder(new CommunicatorModule());
            var container = builder.Build();
            DependencyResolver.SetResolver(new AutofacDependencyResolver(container));

            


            
            SetConfigValues();

            // This hacky line of code will accept authentication from any server certificate (including test ones)
            System.Net.ServicePointManager.ServerCertificateValidationCallback = (se, cert, chain, sslError) => { return true; };

            StartSessionCleanupAsync();
        }

        private void StartSessionCleanupAsync()
        {
            Observable.Interval(TimeSpan.FromMinutes(2))
                .Subscribe(next =>
                {
                    try
                    {
                        StartSessionCleanup();
                    }
                    catch (Exception ex)
                    {
                        Logger.Error(ex); // make sure do not re-throw
                    }
                }
                           , Logger.Error, // cannot restart if error occurs, must catch in the sub!
                StartSessionCleanupAsync); // shouldn't complete but restart if it does
        }

        private void StartSessionCleanup()
        {
            Logger.Debug("StartSessionCleanup");
            using (SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["ASPState"].ConnectionString))
            {
                try
                {
                    // Open the connection
                    sqlConnection.Open();

                    var sqlCommand = new SqlCommand("DeleteExpiredSessions", sqlConnection);

                    sqlCommand.CommandType = System.Data.CommandType.StoredProcedure;
                    sqlCommand.ExecuteNonQuery();
                }
                catch (Exception ex)
                {
                    Logger.Error(ex);
                    // Don't Fail On Exceptions, 
                    // Just Try Again After the Sleep
                }
            }
        }

        private static void SetConfigValues()
        {
            if (AzureHelper.IsInFabric)
            {
                // adding this in code (rather than config) so can choose to only add it when we are running in a Fabric
                Trace.Listeners.Add(new Microsoft.WindowsAzure.Diagnostics.DiagnosticMonitorTraceListener());
            }

            RestCentral.ConnectionString = AzureHelper.IsInFabric
                ? RoleEnvironment.GetConfigurationSettingValue("RestCentralConnString")
                : ConfigurationManager.AppSettings["RestCentralConnString"];


            Logger.Debug("ConnectionString: {0}", RestCentral.ConnectionString);
        }

        protected void Application_BeginRequest()
        {
            // TODO uncomment when setup https
            #if !(DEBUG)
            // Force client to https
            if (!Request.IsSecureConnection)
            {
                string secureUri = Request.Url.AbsoluteUri.Replace(Uri.UriSchemeHttp, Uri.UriSchemeHttps);
                Response.Redirect(secureUri, true);
                return;
            }
            #endif
        }

        protected void Application_Error(object sender, EventArgs e)
        {
            Logger.Warning("Application_Error");
            Exception exception = Server.GetLastError();

            if (exception != null)
            {
                Logger.Error(exception);

                var httpException = exception as HttpException;
                if(httpException != null)
                    Logger.Error(httpException);
            }

//            var routeData = new RouteData();
//            routeData.Values.Add("controller", "ErrorController");
//            routeData.Values.Add("action", "Http500");
//            routeData.Values.Add("exception", exception);
//
//            if (httpException != null)
//            {
//                Logger.Error(httpException);
//                if (httpException.GetHttpCode() == 404)
//                {
//                    routeData.Values["action"] = "Http404";
//                }
//            }
//
//            Server.ClearError();
//            Response.Clear();
//
//            IController errorController = new ErrorController();
//            errorController.Execute(new RequestContext(new HttpContextWrapper(Context), routeData));
        }



        protected void Session_Start()
        {
            Logger.Debug("Session_Start");
            if (Request.IsAuthenticated)
            {
                // User still has a valid cookie. Since we are forcing a login on each new session, clear the current user context.
                FormsAuthentication.SignOut();
                Context.User = new GenericPrincipal(new GenericIdentity(""), null);
            }

        }

        protected void Session_End()
        {
            Logger.Debug("Session_End");
        }

        /// <summary>
        /// Creates and Builds the Autofac IoC container,
        /// initialized with all required dependencies
        /// </summary>
        public static ContainerBuilder GetContainerBuilder(params Module[] modules)
        {
            Logger.Debug(@"Global.asax GetContainerBuilder");
            var builder = new ContainerBuilder();
            builder.RegisterControllers(typeof(MvcApplication).Assembly);

            if (modules != null && modules.Count() > 0)
                modules.ToList().ForEach(builder.RegisterModule);

            return builder;
        }
    }


    /// <summary>
    /// Account module
    /// </summary>
    public class CommunicatorModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            Logger.Debug(@"CommunicatorModule Load");
            base.Load(builder);
            builder.Register(c => new LinqToSqlDataProvider(RestCentral.ConnectionString))
                .As<IConfigurationDataProvider>()
                .SingleInstance();
            builder.Register(c => new FormsAuthenticationService())
                .As<IFormsAuthenticationService>();


            builder.Register(c => new RockendConfigurationManager(c.Resolve<IConfigurationDataProvider>()))
                .As<RockendConfigurationManager>()
                .SingleInstance();

        }
    }
}
