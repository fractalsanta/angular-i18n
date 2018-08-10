using System;
using System.Web.Http;
using System.Collections.Generic;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Config.Translations;

namespace Mx.Web.UI.Areas.Core.Api
{
    [AllowAnonymous]
    public class TranslationsController : ApiController
    {
        private static Int32 localisationVersion = Int32.MinValue;
        private static readonly Object translationsCacheSync = new Object();
        private static readonly Dictionary<String, Translations> translationsCache = 
            new Dictionary<String, Translations>();

        private readonly ITranslationService _translationService;

        public TranslationsController(ITranslationService translationService)
        {
            _translationService = translationService;
        }

        public Translations Get([FromUri] String culture)
        {
            var locVersionAtRequest = 0;
            var locVersionInDatabase = _translationService.GetLocalisationVersion();

            // Determine whether the localization version has changed since we last cached
            // our translation values. If so, we need to clear the cache and pull them all out again.
            var translations = default(Translations);
            lock (translationsCacheSync)
            {
                if (locVersionInDatabase > localisationVersion)
                {
                    localisationVersion = locVersionInDatabase;
                    translationsCache.Clear();
                }
                locVersionAtRequest = localisationVersion;
                translationsCache.TryGetValue(culture, out translations);
            }

            // If translations already exist in our cache for the current culture, then we don't need to
            // pull them out again.  Otherwise, we need to pull values from the database and update the cache.
            if (translations == null)
            {
                translations = new Translations
                {
                    Core = _translationService.Translate<L10N>(culture),
                    ChangeStore = _translationService.Translate<Administration.ChangeStore.Api.Models.L10N>(culture),
                    MyAccount = _translationService.Translate<Administration.MyAccount.Api.Models.L10N>(culture),
                    Settings = _translationService.Translate<Administration.Settings.Api.Models.L10N>(culture),
                    Authentication = _translationService.Translate<Core.Auth.Api.Models.L10N>(culture),
                    InventoryCount = _translationService.Translate<Inventory.Count.Api.Models.L10N>(culture),
                    InventoryOrder = _translationService.Translate<Inventory.Order.Api.Models.L10N>(culture),
                    InventoryTransfer = _translationService.Translate<Inventory.Transfer.Api.Models.L10N>(culture),
                    InventoryWaste = _translationService.Translate<Inventory.Waste.Api.Models.L10N>(culture),
                    Dashboard = _translationService.Translate<Reporting.Dashboard.Api.Models.L10N>(culture),
                    Forecasting = _translationService.Translate<Forecasting.Api.Models.Translations>(culture),
                    ForecastingPromotions = _translationService.Translate<Forecasting.Api.Models.PromotionTranslations>(culture),
                    DataLoad = _translationService.Translate<Administration.DataLoad.Api.Models.L10N>(culture),
                    Hierarchy = _translationService.Translate<Administration.Hierarchy.Api.Models.Translations>(culture),
                    Notifications = _translationService.Translate<Core.Api.Models.Notifications.L10N>(culture),
                    User = _translationService.Translate<Administration.User.Api.Models.Translations>(culture),
                    WorkforceMySchedule = _translationService.Translate<Workforce.MySchedule.Api.Models.L10N>(culture),
                    WorkforceMyAvailability = _translationService.Translate<Workforce.MyAvailability.Api.Models.L10N>(culture),
                    WorkforceMyTimeCard = _translationService.Translate<Workforce.MyTimeCard.Api.Models.L10N>(culture),
                    WorkforceMyTimeOff = _translationService.Translate<Workforce.MyTimeOff.Api.Models.L10N>(culture),
                    WorkforceMyDetails = _translationService.Translate<Workforce.MyDetails.Api.Models.L10N>(culture),
                    WorkforceDeliveries = _translationService.Translate<Workforce.Deliveries.Api.Models.L10N>(culture),
                    PartnerRedirect = _translationService.Translate<PartnerRedirect.Api.Models.L10N>(culture),
                    WorkforceDriverDistance = _translationService.Translate<Workforce.DriverDistance.Api.Models.L10N>(culture),
                    OperationsReporting = _translationService.Translate<Operations.Reporting.Api.Models.L10N>(culture),
                    OperationsReportingStoreSummary = _translationService.Translate<Operations.Reporting.StoreSummary.Api.Models.L10N>(culture),
                    OperationsReportingAreaSummary = _translationService.Translate<Operations.Reporting.AreaSummary.Api.Models.L10N>(culture),
                    OperationsReportingInventoryMovement = _translationService.Translate<Operations.Reporting.InventoryMovement.Api.Models.L10N>(culture),
                    OperationsReportingProductMix = _translationService.Translate<Operations.Reporting.ProductMix.Api.Models.L10N>(culture),
                    InventoryProduction = _translationService.Translate<Inventory.Production.Api.Models.L10N>(culture)
                };

                // If the cache was invalidated by another thread in the middle of retrieving values from
                // the database, then we don't want to add what we just retrieved to the cache; doing
                // otherwise could lead to concurrency issues.
                lock (translationsCacheSync)
                {
                    if (locVersionAtRequest == localisationVersion)
                    {
                        translationsCache[culture] = translations;
                    }
                }
            }
            return translations;
        }
    }
}