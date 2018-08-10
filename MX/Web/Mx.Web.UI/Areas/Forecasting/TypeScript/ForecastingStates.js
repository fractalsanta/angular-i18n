var Forecasting;
(function (Forecasting) {
    "use strict";
    Forecasting.forecastingContainer = {
        Views: [],
        StateName: "States",
        Template: "Templates/Forecasting.html",
        Url: ""
    };
    var fcViews = [
        {
            ViewName: "View",
            Url: "View?metric&part&itemid&filterid&dayString&forecastId&entityId",
            TemplateUrl: "Templates/ForecastingView.html",
            Controller: Forecasting.forecastingViewController
        },
        {
            ViewName: "Edit",
            Url: "Edit?metric&part&itemid&filterid&dayString&forecastId&entityId",
            TemplateUrl: "Templates/ForecastingEdit.html",
            Controller: Forecasting.forecastingEditController
        },
        {
            ViewName: "History",
            Url: "History?metric&part&itemid&filterid&dayString&forecastId&entityId&gridview",
            TemplateUrl: "Templates/ForecastingHistory.html",
            Controller: Forecasting.forecastingHistoryController
        }
    ];
    Forecasting.forecastingContainer.Views = fcViews;
    Forecasting.ForecastingViews = { name: "ForecastingStates" };
    angular.module("Forecasting").constant("ForecastingStates", Forecasting.forecastingContainer);
    Forecasting.fcViewsState = new Core.NG.StateNode(Forecasting.forecastingContainer.StateName, Forecasting.forecastingContainer.Url, Forecasting.forecastingContainer.Template, Forecasting.forecastingViewsController);
    _.forEach(Forecasting.forecastingContainer.Views, function (view) {
        var childState = new Core.NG.StateNode(view.ViewName, view.Url, view.TemplateUrl, view.Controller);
        Forecasting.fcViewsState.AddChild(childState);
    });
    Core.NG.ForecastingModule.RegisterStateTree(Forecasting.fcViewsState);
})(Forecasting || (Forecasting = {}));
