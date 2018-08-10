using System.Web.Optimization;

namespace Mx.Web.UI.Config
{
    public static class BundleConfig
    {
        internal static void RegisterBundles(BundleCollection bundles)
        {
            var libs = new ScriptBundle("~/bundles/js-libs")
                .IncludeDirectory("~/Scripts", "*.js", false)
                // shim to support upload progress/abort and non-HTML5 FormData browsers.
                // use html5-shim.min.js instead for progress/abort for html5 browsers only
                // Note: MUST BE PLACED BEFORE angular.js
                .Include("~/Scripts/moment/moment-with-langs.js")
                .Include("~/Scripts/angular-external-modules/file-upload/angular-file-upload-shim.min.js")
                .Include("~/Scripts/angular-external-modules/file-upload/FileAPI.min.js")
                .Include("~/Scripts/fastclick.js")
                .Include("~/Scripts/tinycolor.js")
                .Include("~/Scripts/angular/angular.js")
                .Include("~/Scripts/angular/angular-cookies.js")
                .Include("~/Scripts/angular/angular-touch.js")
                .Include("~/Scripts/angular/angular-sanitize.js")
                .Include("~/Scripts/angular-external-modules/angulartics/angulartics.js")
                .Include("~/Scripts/angular-external-modules/file-upload/angular-file-upload.min.js")
                .Include("~/Scripts/angular-external-modules/ui-router/angular-ui-router.js")
                .IncludeDirectory("~/Scripts/angular-ui", "*.js", true)
                .Include("~/Scripts/kendo/kendo.new.core.js")
                .Include("~/Scripts/kendo/kendo.dataviz.js")
                .Include("~/Scripts/kendo/angular-kendo.js")
                .Include("~/Scripts/angular-external-modules/local-storage/angular-local-storage.js")
                .Include("~/Scripts/angular-external-modules/angular-placeholder/angularjs-placeholder.js")
                .Include("~/Scripts/angular-external-modules/gm.datepickerMultiSelect/src/gm.datepickerMultiSelect.js")
                .Include("~/Scripts/angular-external-modules/sortable/sortable.js")
                .Include("~/Scripts/angular-external-modules/angular-color-picker/angularjs-color-picker.js")
                .Include("~/Scripts/angular-external-modules/ngJsTree/ngJsTree.js")                
                .IncludeDirectory("~/Scripts/crypto-js", "*.js", true);
            bundles.Add(libs);

            var app = new ScriptBundle("~/bundles/js-app")
                .Include("~/Areas/Core/TypeScript/mx-google-analytics.js")
                .Include("~/Areas/Core/TypeScript/Events.js")
                .Include("~/Areas/Core/TypeScript/NG/Constants.js")
                .IncludeDirectory("~/Areas/Core/TypeScript/Enum", "*.js", false)
                .Include("~/Areas/Core/TypeScript/NG/Registry.js")
                .Include("~/Areas/Core/TypeScript/NG/Modules.js")
                .Include("~/Areas/Core/TypeScript/NG/Filters.js")
                .Include("~/Areas/Core/TypeScript/NG/StateNode.js")
                .Include("~/Config/T4/ApiDefinitions.js")
                .Include("~/Config/T4/ApiImplementation.js")
                // To enable fake dashboard data, uncomment the next line
                //.Include("~/Areas/Reporting/Dashboard/Tests/DashboardDemo.js")
                .IncludeDirectory("~/Areas/Core/TypeScript/Models", "*.js", false)
                .Include("~/Areas/Core/TypeScript/Services/LocalStorage.js")
                .Include("~/Areas/Core/TypeScript/Services/AuthService.js")
                .Include("~/Areas/Core/TypeScript/Constants.js")
                .Include("~/Areas/Core/TypeScript/CurrencyLocalization.js")
                .Include("~/Areas/Core/TypeScript/Services/SystemSettingsService.js")
                .Include("~/Areas/Core/TypeScript/Services/SignalRHub.js")
                .Include("~/Areas/Core/TypeScript/Services/SignalRService.js")
                .Include("~/Areas/Core/TypeScript/Services/TranslationService.js")
                .Include("~/Areas/Core/TypeScript/Services/PopupMessageService.js")
                .Include("~/Areas/Core/TypeScript/Services/NavigationService.js")
                .Include("~/Areas/Core/TypeScript/Services/DateService.js")
                .Include("~/Areas/Core/TypeScript/Services/LayoutService.js")
                .Include("~/Areas/Core/TypeScript/Services/FormatterService.js")
                .Include("~/Areas/Core/TypeScript/Services/ConfirmationService.js")
                .Include("~/Areas/Core/TypeScript/Services/VirtualKeyboardService.js")
                .IncludeDirectory("~/Areas/Administration/Hierarchy/TypeScript/Services", "*.js", true)
                .IncludeDirectory("~/Areas/Administration/User/TypeScript/Services", "*.js", true)
                .IncludeDirectory("~/Areas/Core/TypeScript/Controllers", "*.js", false)
                .IncludeDirectory("~/Areas/Core/TypeScript", "*.js", false)
                .IncludeDirectory("~/Areas/Core/TypeScript/Directives", "*.js", false)
                .IncludeDirectory("~/Areas/Reporting/Dashboard/TypeScript/Services", "*.js", false)
                .IncludeDirectory("~/Areas/Reporting/Dashboard/TypeScript/Controllers", "*.js", false)                
                .IncludeDirectory("~/Areas/Inventory/Count/TypeScript/Services", "*.js", true)
                .Include("~/Areas/Inventory/Order/TypeScript/Services/AddItemsOrderVendorService.js")
                .IncludeDirectory("~/Areas/Inventory/TypeScript/Controllers", "*.js", true)
                .IncludeDirectory("~/Areas/Inventory/Transfer/TypeScript/Services", "*.js", true)
                .IncludeDirectory("~/Areas/Inventory/Count/TypeScript/Controllers", "*.js", true)
                .IncludeDirectory("~/Areas/Inventory/Count/TypeScript", "*.js", false)
                .IncludeDirectory("~/Areas/Inventory/Waste/TypeScript/Controllers", "*.js", true)
                .IncludeDirectory("~/Areas/Inventory/Waste/TypeScript", "*.js", false)
                .IncludeDirectory("~/Areas/Inventory/Transfer/TypeScript/Controllers", "*.js", true)
                .IncludeDirectory("~/Areas/Inventory/Transfer/TypeScript", "*.js", false)
                .IncludeDirectory("~/Areas/Inventory/Order/TypeScript/Services", "*.js", false)
                .IncludeDirectory("~/Areas/Inventory/Order/TypeScript/Controllers", "*.js")
                .IncludeDirectory("~/Areas/Inventory/Order/TypeScript", "*.js", false)
                .IncludeDirectory("~/Areas/Administration/ChangeStore/TypeScript/Controllers", "*.js")
                .IncludeDirectory("~/Areas/Administration/Settings/TypeScript/Controllers", "*.js", true)
                .Include("~/Areas/Administration/Settings/TypeScript/SettingsStates.js")
                .Include("~/Areas/Administration/Settings/TypeScript/SettingsController.js")
                .Include("~/Areas/Administration/Settings/TypeScript/SettingsStatesRegistration.js")                                
                .IncludeDirectory("~/Areas/Administration/DataLoad/TypeScript", "*.js", true)
                .IncludeDirectory("~/Areas/Administration/Hierarchy/TypeScript/Controllers", "*.js", true)
                .IncludeDirectory("~/Areas/Administration/User/TypeScript/Controllers", "*.js", true)
                .IncludeDirectory("~/Areas/Administration/MyAccount/TypeScript/Controllers", "*.js", false)
                .IncludeDirectory("~/Areas/Forecasting/TypeScript/Services", "*.js", true)
                .IncludeDirectory("~/Areas/Forecasting/TypeScript/Directives", "*.js", true)
                .IncludeDirectory("~/Areas/Forecasting/TypeScript/Controllers", "*.js", true)
                .IncludeDirectory("~/Areas/Forecasting/TypeScript", "*.js", false)
                .IncludeDirectory("~/Areas/Workforce/MySchedule/TypeScript/Models", "*.js", false)
                .IncludeDirectory("~/Areas/Workforce/MySchedule/TypeScript/Services", "*.js", false)
                .IncludeDirectory("~/Areas/Workforce/MySchedule/TypeScript/Controllers", "*.js", false)
                .IncludeDirectory("~/Areas/Workforce/MySchedule/TypeScript", "*.js", false)
                .IncludeDirectory("~/Areas/Workforce/MyAvailability/TypeScript/Services", "*.js", false)
                .IncludeDirectory("~/Areas/Workforce/MyAvailability/TypeScript/Controllers", "*.js", false)
                .IncludeDirectory("~/Areas/Workforce/MyTimeCard/TypeScript/Services", "*.js", false)
                .IncludeDirectory("~/Areas/Workforce/MyTimeCard/TypeScript/Controllers", "*.js", false)
                .IncludeDirectory("~/Areas/Workforce/MyTimeOff/TypeScript/Controllers", "*.js", false)
                .IncludeDirectory("~/Areas/Workforce/MyDetails/TypeScript/Controllers", "*.js", false)
                .IncludeDirectory("~/Areas/Workforce/Deliveries/TypeScript/Services", "*.js", false)
                .IncludeDirectory("~/Areas/Workforce/Deliveries/TypeScript/Controllers", "*.js", false)
                .IncludeDirectory("~/Areas/Workforce/DriverDistance/TypeScript/Controllers", "*.js", false)
                .IncludeDirectory("~/Areas/Core/PartnerRedirect/TypeScript/Controllers", "*.js", false)
                .IncludeDirectory("~/Areas/Operations/Reporting/TypeScript/Services", "ViewService.js", false)
                .IncludeDirectory("~/Areas/Operations/Reporting/TypeScript/Services", "ReportService.js", false)
                .IncludeDirectory("~/Areas/Operations/Reporting/TypeScript/Filters", "*.js", false)
                .IncludeDirectory("~/Areas/Operations/Reporting/TypeScript/Controllers", "*.js", false)
                .IncludeDirectory("~/Areas/Operations/Reporting/StoreSummary/TypeScript/Controllers", "*.js", false)
                .IncludeDirectory("~/Areas/Operations/Reporting/AreaSummary/TypeScript/Controllers", "*.js", false)
                .IncludeDirectory("~/Areas/Operations/Reporting/InventoryMovement/TypeScript/Controllers", "*.js", false)
                .IncludeDirectory("~/Areas/Operations/Reporting/ProductMix/TypeScript/Controllers", "*.js", false)
                .IncludeDirectory("~/Areas/Operations/Reporting/TypeScript", "*.js", false)
                .IncludeDirectory("~/Areas/Inventory/Production/TypeScript/Controllers", "*.js", true)
                .IncludeDirectory("~/Areas/Inventory/Production/TypeScript", "*.js", false)

                .Include("~/Areas/Core/TypeScript/mx-angulartics-ga.js");

            bundles.Add(app);

            var content = new StyleBundle("~/bundles/css")
                .IncludeDirectory("~/Content", "*.css", false)
                .Include("~/Content/Bootstrap/bootstrap.css")
                .Include("~/Content/Bootstrap/Macromatix/mx-bootstrap-custom.css")
                .Include("~/Content/angular-external-modules/angular-color-picker/angularjs-color-picker.css")
                .Include("~/Content/jstree-themes/default/style.css")
                .IncludeDirectory("~/Content/Macromatix", "*.css", false)
                .IncludeDirectory("~/Content/Areas", "*.css", true);
            bundles.Add(content);

            var unsupported = new ScriptBundle("~/bundles/js-unsupported")
                .Include("~/Areas/Core/TypeScript/Browser/BrowserDetection.js")
                .Include("~/Areas/Core/TypeScript/Browser/CheckSupported.js");
            bundles.Add(unsupported);

            //BundleTable.EnableOptimizations = true;
        }
    }
}
