module Core.NG {
    "use strict";

    export var AppModule: IRegistry = new Registry("App", [
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

    export var CoreModule: IRegistry = new Registry("Core", [
        "ngCookies",
        "ui.bootstrap",
        "ui.validate",
        "ui.router",
        "Core.PartnerRedirect",
        "ngSanitize"
    ]);

    export var Configs: { DatepickerConfig?: ng.ui.bootstrap.IDatepickerConfig } = {
        DatepickerConfig: {
            showWeeks: false
        }
    };

    CoreModule.Module().config(["datepickerConfig", (config: ng.ui.bootstrap.IDatepickerConfig): void => {
        Configs.DatepickerConfig = config;
    }]);

    export var InventoryModule: IRegistry = new Registry("Inventory", [
        "Core",
        "Inventory.Count",
        "Inventory.Transfer",
        "Inventory.Order",
        "Inventory.Waste",
        "Inventory.Production"
    ]);

    export var ReportingDashboardModule: IRegistry = new Registry("Reporting.Dashboard", ["Core"]);

    export var InventoryCountModule: IRegistry = new Registry("Inventory.Count", ["Core", "LocalStorageModule"]);

    export var InventoryTransferModule: IRegistry = new Registry("Inventory.Transfer", ["Core"]);

    export var InventoryWasteModule: IRegistry = new Registry("Inventory.Waste", ["Core"]);

    export var InventoryOrderModule: IRegistry = new Registry("Inventory.Order", ["Core"]);

    export var InventoryProductionModule: IRegistry = new Registry("Inventory.Production", ["Core"]);

    export var AdministrationModule: IRegistry = new Registry("Administration", [
        "Core",
        "Administration.ChangeStore",
        "Administration.DataLoad",
        "Administration.MyAccount",
        "Administration.Settings",
        "Administration.Hierarchy",
        "Administration.User"
    ]);

    export var AdministrationChangeStoreModule: IRegistry = new Registry("Administration.ChangeStore", ["Core"]);

    export var AdministrationDataLoadModule: IRegistry = new Registry("Administration.DataLoad", ["Core", "angularFileUpload"]);

    export var AdministrationMyAccountModule: IRegistry = new Registry("Administration.MyAccount", ["Core"]);

    export var AdministrationSettingsModule: IRegistry = new Registry("Administration.Settings", ["Core"]);

    export var AdministrationHierarchyModule: IRegistry = new Registry("Administration.Hierarchy", ["Core"]);

    export var AdministrationUserModule: IRegistry = new Registry("Administration.User", ["Core"]);

    export var ForecastingModule: IRegistry = new Registry("Forecasting", ["Core", "kendo.directives"]);

    export var WorkforceModule: IRegistry = new Registry("Workforce", [
        "Workforce.MySchedule",
        "Workforce.MyAvailability",
        "Workforce.MyTimeCard",
        "Workforce.MyTimeOff",
        "Workforce.MyDetails",
        "Workforce.Deliveries",
        "Workforce.DriverDistance",
        "Workforce.PeriodClose"
    ]);

    export var WorkforceMyScheduleModule: IRegistry = new Registry("Workforce.MySchedule", ["Core"]);
    export var WorkforceMyAvailabilityModule: IRegistry = new Registry("Workforce.MyAvailability", ["Core"]);
    export var WorkforceMyTimeCardModule: IRegistry = new Registry("Workforce.MyTimeCard", ["Core"]);
    export var WorkforceMyTimeOffModule: IRegistry = new Registry("Workforce.MyTimeOff", ["Core"]);
    export var WorkforceMyDetailsModule: IRegistry = new Registry("Workforce.MyDetails", ["Core"]);
    export var WorkforceDeliveriesModule: IRegistry = new Registry("Workforce.Deliveries", ["Core"]);
    export var WorkforceDriverDistanceModule: IRegistry = new Registry("Workforce.DriverDistance", ["Core"]);
    export var WorkforcePeriodCloseModule: IRegistry = new Registry("Workforce.PeriodClose", ["Core"]);

    export var CorePartnerRedirectModule: IRegistry = new Registry("Core.PartnerRedirect", ["Core"]);

    export var OperationsModule: IRegistry = new Registry("Operations", [
        "Operations.Reporting"
    ]);
    
    export var OperationsReportingModule: IRegistry = new Registry("Operations.Reporting", [
        "Operations.Reporting.StoreSummary",
        "Operations.Reporting.AreaSummary",
        "Operations.Reporting.InventoryMovement",
        "Operations.Reporting.ProductMix"
    ]);
    
    export var OperationsReportingStoreSummaryModule: IRegistry = new Registry("Operations.Reporting.StoreSummary", ["Core"]);
    export var OperationsReportingAreaSummaryModule: IRegistry = new Registry("Operations.Reporting.AreaSummary", ["Core"]);
    export var OperationsReportingInventoryMovementModule: IRegistry = new Registry("Operations.Reporting.InventoryMovement", ["Core"]);
    export var OperationsReportingProductMixModule: IRegistry = new Registry("Operations.Reporting.ProductMix", ["Core"]);
}