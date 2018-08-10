using Mx.Configuration;
using Mx.Forecasting.Services.Forecasting;
using Mx.Forecasting.Services.Interfaces.Services;
using Mx.Services.Shared;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Config.Translations;
using System;
using System.IO;
using System.Reflection;
using System.Text;
using Mx.Web.UI.Areas.Operations.Reporting.Api.Models;

namespace Mx.Web.UI.Config
{
    public static class IocConfig
    {
        private static Boolean _appConfigured;
        private static readonly Object LockObject = new Object();

        private static String _serviceUrl = String.Empty;
        private static String ServiceUrl
        {
            get
            {
                if (String.IsNullOrWhiteSpace(_serviceUrl))
                    _serviceUrl = MxAppSettings.MMSServiceBaseUrl;

                if (!_serviceUrl.EndsWith("/"))
                    _serviceUrl += "/";

                return _serviceUrl;
            }
        }

        /// <summary>
        /// IIS Worker Process creates multiple instances of HttpApplication in order
        /// to process the requests. New instances could be created at any time in the
        /// applications life-time, so to avoid dependencies being configured
        /// multiple times, double-check lock is wrapped around the configuration.
        /// </summary>
        internal static void ConfigureIoC()
        {
            if (_appConfigured)
            {
                return;
            }

            lock (LockObject)
            {
                if (_appConfigured)
                {
                    return;
                }

                try
                {
                    var init = new SharedInitializer();
                    init.ConfigureLegacyServices(ServiceUrl);
                    init.AddPropertyInjector("Measures");
                    init.OnAssemblyScan += x =>
                    {
                        x.AddAllTypesOf<INotificationAreaService>();
                        x.AddAllTypesOf<Mx.Services.Shared.Diagnostic.IDiagnosticTest>();
                    };
                    init.OnStructureMapInit += (i) => TranslationConfig.Configure(i);

                    init.Execute();
                }
                catch (ReflectionTypeLoadException ex)
                {
                    var sb = new StringBuilder();
                    foreach (var exSub in ex.LoaderExceptions)
                    {
                        sb.AppendLine(exSub.Message);
                        if (exSub is FileNotFoundException)
                        {
                            var exFileNotFound = exSub as FileNotFoundException;
                            if (!String.IsNullOrEmpty(exFileNotFound.FusionLog))
                            {
                                sb.AppendLine("Fusion Log: ");
                                sb.AppendLine(exFileNotFound.FusionLog);
                            }
                        }
                        sb.AppendLine();
                    }
                    throw new Exception(sb.ToString(), ex);
                }

                _appConfigured = true;
            }
        }
    }
}