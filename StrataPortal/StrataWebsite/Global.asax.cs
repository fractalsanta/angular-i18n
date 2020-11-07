using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Linq;
using System.Reactive.Linq;
using System.Reflection;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using Agile.Diagnostics.AzureDb;
using Agile.Diagnostics.Loggers;
using Agile.Diagnostics.Logging;
using Autofac;
using Autofac.Integration.Mvc;
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
using Rockend.Common;
using Rockend.Common.Helpers;
using Module = Autofac.Module;

namespace Rockend.iStrata.StrataWebsite
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class MvcApplication : HttpApplication
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new ElmahHandleErrorAttribute());
            //filters.Add(new HandleErrorAttribute());
        }

        public static void RegisterRoutes(RouteCollection routes)
        {
            Logger.Debug("RegisterRoutes");
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            //routes.IgnoreRoute("Error/{*pathInfo}");
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
                new
                {
                    controller = "Login",
                    action = "Login"
                });

            routes.MapRoute(
               "LoginRoute", // Route name
               "{applicationKey}/Login/{action}",
               new
               {
                   controller = "Login",
                   action = "Login"
               }
            );

          //  routes.MapRoute(
          //     "ExecutiveMemberRoute", // Route name
          //     "{applicationKey}/ExecutiveMember/{action}",
          //     new
          //     {
          //         controller = "ExecutiveMember",
          //         action = "Main"
          //     }
          //  );

          //  routes.MapRoute(
          //     "AgencyRoute", // Route name
          //     "{applicationKey}/Agency/{action}",
          //     new
          //     {
          //         controller = "Agency",
          //         action = "Contact"
          //     }
          //  );

          //  routes.MapRoute(
          //    "DocumentsRoute", // Route name
          //    "{applicationKey}/Documents/{action}",
          //    new
          //    {
          //        controller = "Documents",
          //        action = "Index"
          //    }
          // );

          //  routes.MapRoute(
          //    "LotOwnerRoute", // Route name
          //    "{applicationKey}/LotOwner/{action}",
          //    new
          //    {
          //        controller = "LotOwner",
          //        action = "Contacts"
          //    }
          // );

          //  routes.MapRoute(
          //    "MaintenanceRoute", // Route name
          //    "{applicationKey}/Maintenance/{action}",
          //    new
          //    {
          //        controller = "Maintenance",
          //        action = "Index"
          //    }
          // );

          //  routes.MapRoute(
          //   "MeetingRoute", // Route name
          //   "{applicationKey}/Meeting/{action}",
          //   new
          //   {
          //       controller = "Meeting",
          //       action = "Index"
          //   }
          //);

          //  routes.MapRoute(
          //   "ReportsRoute", // Route name
          //   "{applicationKey}/Reports/{action}",
          //   new
          //   {
          //       controller = "Reports",
          //       action = "Index"
          //   }
          //);


          //  routes.MapRoute(
          //   "OwnersCorpRoute", // Route name
          //   "{applicationKey}/OwnersCorp/{action}",
          //   new
          //   {
          //       controller = "OwnersCorp",
          //       action = "General"
          //   }
          //);         

            routes.MapRoute(
                "LoggedInRoute", // Route name
                "{applicationKey}/{controller}/{action}"
                //,
                // new
                // {
                //     controller = "Login",
                //     action = "Login"
                // }
            );

            routes.MapRoute(
                "Default",                                       // Route name
                "{controller}/{action}",                         // URL with parameters
                new { controller = "Login", action = "Login" }  // Parameter defaults
            );


        }

        protected void Application_Start()
        {
            var host = Environment.MachineName;

            Logger.InitializeLogging(new List<ILogger> 
            {
                new AzureDatabaseLogger("strataPortal", host)
#if DEBUG
                , new DebugLogger()
#endif
            },
                    LogLevel.All);

            new Bootstrapper().Start();

            Logger.Info("******* Version: {0}", GetVersion());


            RegisterGlobalFilters(GlobalFilters.Filters);
            RegisterRoutes(RouteTable.Routes);

            ViewEngines.Engines.Add(new MobileViewEngine());

            var builder = GetContainerBuilder(new CommunicatorModule());
            var container = builder.Build();
            DependencyResolver.SetResolver(new AutofacDependencyResolver(container));


            SetConfigValues();
            
        }


        public static string GetVersion()
        {
            try
            {
                var assembly = Assembly.GetExecutingAssembly();

                return assembly.GetName().Version.ToString();
            }
            catch (Exception ex)
            {
                Logger.Error(ex, "GetVersion");
                return String.Format("GetVersion: [{0}]", ex.Message);
            }
        }
        

        private static void SetConfigValues()
        {
            if (AzureHelper.IsInFabric)
            {
                // adding this in code (rather than config) so can choose to only add it when we are running in a Fabric
                //Trace.Listeners.Add(new Microsoft.WindowsAzure.Diagnostics.DiagnosticMonitorTraceListener());
            }

            RestCentral.ConnectionString = AzureHelper.IsInFabric
                ? RoleEnvironment.GetConfigurationSettingValue("RestCentralConnString")
                : ConfigurationManager.AppSettings["RestCentralConnString"];


            Logger.Debug("ConnectionString: {0}", RestCentral.ConnectionString);
        }

        protected void Application_BeginRequest()
        {
            // copy of this in RestPortal
            if (Safe.Bool(CloudConfigManager.Instance.GetString("IsAppOffline")))
            {
                if (!Request.Url.AbsolutePath.Contains("offline"))
                {
                    Logger.Info("Redirecting to offline");
                    Response.Redirect("~/offline.htm");
                }
                else
                    Logger.Info("already redirected to offline");
            }

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
            try
            {
                Logger.Warning("Application_Error");
                var exception = Server.GetLastError();

                if (exception != null)
                {
                    

                    var httpException = exception as HttpException;
                    Logger.Error(httpException ?? exception);
                }
            }
            catch (Exception ex)
            {
                Trace.WriteLine(ex.Message);
                // do nothing, maybe the error was a result of logging
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
            try
            {
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
            catch (Exception ex)
            {
                Logger.Error(ex);
                throw;
            }

        }
    }
}
