using System.Collections.Generic;
using System.Configuration;
using System.Diagnostics;
using System.Linq;
using System.Reflection;
using AutoMapper;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Configuration;
using Mx.Foundation.Services.Contracts.QueryServices;
using Mx.Web.UI.Areas.Core.Api.Models;
using StructureMap;

namespace Mx.Web.UI.Config.Environment
{
    public class EnvironmentHelper
    {
        public static string GetEnvironmentData()
        {
            var systemSettingsQueryService = ObjectFactory.Container.GetInstance<ISystemSettingsQueryService>();
            var entityQueryService = ObjectFactory.Container.GetInstance<IEntityQueryService>();
            var mappingEngine = ObjectFactory.Container.GetInstance<IMappingEngine>();

            var systemSettings = systemSettingsQueryService.GetSystemSettings();
            var entitiesWithDifferentCurrency = mappingEngine
                .Map<List<EntityIdWithCurrencySymbol>>(entityQueryService.GetEntitiesWithCurrencyDifferentToSystem((int)systemSettings.CurrencyId).ToList());
            

            var productFileVersionInfo = GetProductFileVersionInfo();
            var environmentData = new Constants
            {
                NumericalInputBoxPattern = @"^[+]?\d*([.]\d+)?$",
                InternalDateFormat = "YYYY-MM-DD",
                InternalDateTimeFormat = "YYYY-MM-DDTHH:mm:ss",
                // Moment format for front end system.
                DateCompactFormat = "DD MMM",
                GoogleAnalyticsAccounts = new
                {
                    client = MxAppSettings.ClientGoogleAnalyticsID,
                    macromatix = MxAppSettings.MacromatixGoogleAnalyticsID
                },
                SystemCulture = ObjectFactory.Container.GetInstance<ILocalisationQueryService>().GetSystemCulture(),
                VersionInfo = new VersionInformation()
                {
                    ProductVersion = productFileVersionInfo.ProductVersion,
                    FileVersion = productFileVersionInfo.FileVersion
                },

                TouchKeyboardEnabled = (ConfigurationManager.AppSettings["touch-keyboard"] ?? "").ToLower() == "true",
                SystemCurrencyId = systemSettings.CurrencyId,
                SystemCurrencySymbol = systemSettings.Currency.Symbol,
                EntitiesWithDifferentCurrencySymbol = entitiesWithDifferentCurrency,
                LoginPageColorScheme = systemSettings.LoginColorScheme.GetValueOrDefault(),

                SignaRReconnectionTimeout = MxAppSettings.SignalR_ReconnectionTimeOutSeconds * 1000,
                NotificationRefreshInterval = MxAppSettings.NotificationRefreshIntervalSeconds * 1000,
                CheckBackplaneInterval = 30*1000,  // half minute
                IsBackplane = SignalRHubConfig.IsBackplane
            };
            return Newtonsoft.Json.JsonConvert.SerializeObject(environmentData);
        }

        private static FileVersionInfo GetProductFileVersionInfo()
        {
            return FileVersionInfo.GetVersionInfo(Assembly.GetExecutingAssembly().Location);
        }
    }
}