namespace Mx.Web.UI.Areas.Core.Api.Models
{
    public class Translations
    {
        public L10N Core { get; set; }
        public Administration.ChangeStore.Api.Models.L10N ChangeStore { get; set; }
        public Administration.MyAccount.Api.Models.L10N MyAccount { get; set; }
        public Administration.Settings.Api.Models.L10N Settings { get; set; }
        public Auth.Api.Models.L10N Authentication { get; set; }
        public Inventory.Count.Api.Models.L10N InventoryCount { get; set; }
        public Inventory.Order.Api.Models.L10N InventoryOrder { get; set; }
        public Inventory.Transfer.Api.Models.L10N InventoryTransfer { get; set; }
        public Inventory.Waste.Api.Models.L10N InventoryWaste { get; set; }
        public Reporting.Dashboard.Api.Models.L10N Dashboard { get; set; }
        public Forecasting.Api.Models.Translations Forecasting { get; set; }
        public Forecasting.Api.Models.PromotionTranslations ForecastingPromotions { get; set; }
        public Administration.DataLoad.Api.Models.L10N DataLoad { get; set; }
        public Administration.Hierarchy.Api.Models.Translations Hierarchy { get; set; }
        public Administration.User.Api.Models.Translations User { get; set; }
        public Notifications.L10N Notifications { get; set; }
        public Workforce.MySchedule.Api.Models.L10N WorkforceMySchedule { get; set; }
        public Workforce.MyAvailability.Api.Models.L10N WorkforceMyAvailability { get; set; }
        public Workforce.MyTimeCard.Api.Models.L10N WorkforceMyTimeCard { get; set; }
        public Workforce.MyTimeOff.Api.Models.L10N WorkforceMyTimeOff { get; set; }
        public Workforce.MyDetails.Api.Models.L10N WorkforceMyDetails { get; set; }
        public PartnerRedirect.Api.Models.L10N PartnerRedirect { get; set; }
        public Workforce.Deliveries.Api.Models.L10N WorkforceDeliveries { get; set; }
        public Workforce.DriverDistance.Api.Models.L10N WorkforceDriverDistance { get; set; }
        public Operations.Reporting.Api.Models.L10N OperationsReporting { get; set; }
        public Operations.Reporting.StoreSummary.Api.Models.L10N OperationsReportingStoreSummary { get; set; }
        public Operations.Reporting.AreaSummary.Api.Models.L10N OperationsReportingAreaSummary { get; set; }
        public Operations.Reporting.InventoryMovement.Api.Models.L10N OperationsReportingInventoryMovement { get; set; }
        public Operations.Reporting.ProductMix.Api.Models.L10N OperationsReportingProductMix { get; set; }
        public Inventory.Production.Api.Models.L10N InventoryProduction { get; set; }
    }
}