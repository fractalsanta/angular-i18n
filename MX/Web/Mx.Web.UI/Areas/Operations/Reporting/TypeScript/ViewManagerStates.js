var Operations;
(function (Operations) {
    var Reporting;
    (function (Reporting) {
        Core.NG.OperationsReportingModule.RegisterMasterPublicDetailPage("Reporting", "ViewManager/:ReportTypeId", "/:ViewId", { controller: Reporting.viewManagerContainerController, templateUrl: "Templates/ViewManagerContainer.html" }, { controller: Reporting.viewManagerListController, templateUrl: "Templates/ViewManagerList.html" }, { controller: Reporting.viewManagerDetailController, templateUrl: "Templates/ViewManagerDetails.html" }, "ViewManager", "Details");
    })(Reporting = Operations.Reporting || (Operations.Reporting = {}));
})(Operations || (Operations = {}));
