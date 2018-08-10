var Core;
(function (Core) {
    var NG;
    (function (NG) {
        "use strict";
        NG.AppModule = new NG.Registry("App", [
            "Core",
            "Inventory",
            "Reporting.Dashboard",
            "Administration",
            "Forecasting",
            "Workforce",
            "Operations",
            "ngTouch",
            "html5.placeholder",
            "ui.sortable",
            "angulartics",
            "gm.datepickerMultiSelect",
            "color.picker",
            "ngJsTree"
        ]);
        NG.CoreModule = new NG.Registry("Core", [
            "ngCookies",
            "ui.bootstrap",
            "ui.validate",
            "ui.router",
            "Core.PartnerRedirect",
            "ngSanitize"
        ]);
        NG.Configs = {
            DatepickerConfig: {
                showWeeks: false
            }
        };
        NG.CoreModule.Module().config(["datepickerConfig", function (config) {
                NG.Configs.DatepickerConfig = config;
            }]);
        NG.InventoryModule = new NG.Registry("Inventory", [
            "Core",
            "Inventory.Count",
            "Inventory.Transfer",
            "Inventory.Order",
            "Inventory.Waste",
            "Inventory.Production"
        ]);
        NG.ReportingDashboardModule = new NG.Registry("Reporting.Dashboard", ["Core"]);
        NG.InventoryCountModule = new NG.Registry("Inventory.Count", ["Core", "LocalStorageModule"]);
        NG.InventoryTransferModule = new NG.Registry("Inventory.Transfer", ["Core"]);
        NG.InventoryWasteModule = new NG.Registry("Inventory.Waste", ["Core"]);
        NG.InventoryOrderModule = new NG.Registry("Inventory.Order", ["Core"]);
        NG.InventoryProductionModule = new NG.Registry("Inventory.Production", ["Core"]);
        NG.AdministrationModule = new NG.Registry("Administration", [
            "Core",
            "Administration.ChangeStore",
            "Administration.DataLoad",
            "Administration.MyAccount",
            "Administration.Settings",
            "Administration.Hierarchy",
            "Administration.User"
        ]);
        NG.AdministrationChangeStoreModule = new NG.Registry("Administration.ChangeStore", ["Core"]);
        NG.AdministrationDataLoadModule = new NG.Registry("Administration.DataLoad", ["Core", "angularFileUpload"]);
        NG.AdministrationMyAccountModule = new NG.Registry("Administration.MyAccount", ["Core"]);
        NG.AdministrationSettingsModule = new NG.Registry("Administration.Settings", ["Core"]);
        NG.AdministrationHierarchyModule = new NG.Registry("Administration.Hierarchy", ["Core"]);
        NG.AdministrationUserModule = new NG.Registry("Administration.User", ["Core"]);
        NG.ForecastingModule = new NG.Registry("Forecasting", ["Core", "kendo.directives"]);
        NG.WorkforceModule = new NG.Registry("Workforce", [
            "Workforce.MySchedule",
            "Workforce.MyAvailability",
            "Workforce.MyTimeCard",
            "Workforce.MyTimeOff",
            "Workforce.MyDetails",
            "Workforce.Deliveries",
            "Workforce.DriverDistance",
            "Workforce.PeriodClose"
        ]);
        NG.WorkforceMyScheduleModule = new NG.Registry("Workforce.MySchedule", ["Core"]);
        NG.WorkforceMyAvailabilityModule = new NG.Registry("Workforce.MyAvailability", ["Core"]);
        NG.WorkforceMyTimeCardModule = new NG.Registry("Workforce.MyTimeCard", ["Core"]);
        NG.WorkforceMyTimeOffModule = new NG.Registry("Workforce.MyTimeOff", ["Core"]);
        NG.WorkforceMyDetailsModule = new NG.Registry("Workforce.MyDetails", ["Core"]);
        NG.WorkforceDeliveriesModule = new NG.Registry("Workforce.Deliveries", ["Core"]);
        NG.WorkforceDriverDistanceModule = new NG.Registry("Workforce.DriverDistance", ["Core"]);
        NG.WorkforcePeriodCloseModule = new NG.Registry("Workforce.PeriodClose", ["Core"]);
        NG.CorePartnerRedirectModule = new NG.Registry("Core.PartnerRedirect", ["Core"]);
        NG.OperationsModule = new NG.Registry("Operations", [
            "Operations.Reporting"
        ]);
        NG.OperationsReportingModule = new NG.Registry("Operations.Reporting", [
            "Operations.Reporting.StoreSummary",
            "Operations.Reporting.AreaSummary",
            "Operations.Reporting.InventoryMovement",
            "Operations.Reporting.ProductMix"
        ]);
        NG.OperationsReportingStoreSummaryModule = new NG.Registry("Operations.Reporting.StoreSummary", ["Core"]);
        NG.OperationsReportingAreaSummaryModule = new NG.Registry("Operations.Reporting.AreaSummary", ["Core"]);
        NG.OperationsReportingInventoryMovementModule = new NG.Registry("Operations.Reporting.InventoryMovement", ["Core"]);
        NG.OperationsReportingProductMixModule = new NG.Registry("Operations.Reporting.ProductMix", ["Core"]);
    })(NG = Core.NG || (Core.NG = {}));
})(Core || (Core = {}));
