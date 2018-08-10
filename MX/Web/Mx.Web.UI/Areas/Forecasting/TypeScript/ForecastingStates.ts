module Forecasting {
    "use strict";

    export interface IForecastingStateParams {
        metric?: string;
        part?: string;
        itemid?: string;
        filterid?: string;
        dayString?: string; // todo
        entityId?: string; // todo
        forecastId?: string; // todo
        gridview?: string;
    }

    export interface IForecastingState {
        ViewName: string;
        Url: string;
        TemplateUrl: string;
        Controller: Core.NG.INamedController;
    }

    export interface IForecastingStatesContainer {
        Views: IForecastingState[];
        StateName: string;
        Template: string;
        Url: string;
    }

    export var forecastingContainer: IForecastingStatesContainer = {
        Views: [],
        StateName: "States",
        Template: "Templates/Forecasting.html",
        Url: ""
    };

    var fcViews: IForecastingState[] = [
        {
            ViewName: "View",
            Url: "View?metric&part&itemid&filterid&dayString&forecastId&entityId",
            TemplateUrl: "Templates/ForecastingView.html",
            Controller: forecastingViewController
        },
        {
            ViewName: "Edit",
            Url: "Edit?metric&part&itemid&filterid&dayString&forecastId&entityId",
            TemplateUrl: "Templates/ForecastingEdit.html",
            Controller: forecastingEditController
        },
        {
            ViewName: "History",
            Url: "History?metric&part&itemid&filterid&dayString&forecastId&entityId&gridview",
            TemplateUrl: "Templates/ForecastingHistory.html",
            Controller: forecastingHistoryController
        }
    ];

    forecastingContainer.Views = fcViews;
    export var ForecastingViews: Core.NG.INamedDependency<IForecastingStatesContainer> = { name: "ForecastingStates" };
    angular.module("Forecasting").constant("ForecastingStates", forecastingContainer);

    export var fcViewsState = new Core.NG.StateNode(
            forecastingContainer.StateName, forecastingContainer.Url, forecastingContainer.Template, forecastingViewsController);
    _.forEach(forecastingContainer.Views, (view: IForecastingState): void => {
        var childState = new Core.NG.StateNode(view.ViewName, view.Url, view.TemplateUrl, view.Controller);
        fcViewsState.AddChild(childState);
    });
    Core.NG.ForecastingModule.RegisterStateTree(fcViewsState);
}