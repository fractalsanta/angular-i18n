module Operations.Reporting {

    Core.NG.OperationsReportingModule.RegisterMasterPublicDetailPage("Reporting", "ViewManager/:ReportTypeId", "/:ViewId"
        , { controller: viewManagerContainerController, templateUrl: "Templates/ViewManagerContainer.html" }
        , { controller: viewManagerListController, templateUrl: "Templates/ViewManagerList.html" }
        , { controller: viewManagerDetailController, templateUrl: "Templates/ViewManagerDetails.html" }
        , "ViewManager", "Details"
        );
}