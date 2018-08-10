module Forecasting {
    "use strict";
    
    export var mirroringContainer: IMirroringStatesContainer = {
        L10N: <Api.Models.ITranslations>{},
        Views: [],
        StateName: "MirroringStates",
        Template: "Templates/Mirroring.html",
        Url: "Mirroring",
        GetState: (name: string): IMirroringState => {
            var mc = mirroringContainer;

            if (name.indexOf(mc.StateName) !== -1) {
                var splits = name.split(".");
                    name = splits.length ? splits[1] : name;
            }

            return _.findWhere(mc.Views, { ViewName: name });
        }
    };

    var l10N = (): Api.Models.ITranslations => mirroringContainer.L10N;

    var fmViews: IMirroringState[] = [
        {
            GetTitle: (): string => l10N().TitleMirroring + " - " + l10N().SalesItems,
            ViewName: "SalesItems",
            Url: "SalesItems",
            TemplateUrl: "Templates/MirroringSalesItems.html",
            Controller: mirroringSalesItemsController
        },
        {
            GetTitle: (): string => l10N().TitleMirroring + " - " + l10N().SalesItems,
            ViewName: "SalesItemDetails",
            Url: "SalesItemDetails",
            TemplateUrl: "Templates/MirroringSalesItemDetails.html",
            Controller: mirroringSalesItemDetailsController
        },
        {
            GetTitle: (): string => l10N().TitleMirroring + " - " + l10N().SalesItems,
            ViewName: "SalesItemAdd",
            Url: "SalesItemAdd",
            TemplateUrl: "Templates/MirroringSalesItemDetails.html",
            Controller: mirroringSalesItemAddController
        }
    ];

    mirroringContainer.Views = fmViews;
    export var MirroringViews: Core.NG.INamedDependency<IMirroringStatesContainer> = { name: "MirroringStates" };
    angular.module("Forecasting").constant("MirroringStates", mirroringContainer);

    export var fmViewsState = new Core.NG.StateNode(
            mirroringContainer.StateName, mirroringContainer.Url, mirroringContainer.Template, mirroringController);
    _.forEach(mirroringContainer.Views, (view: IMirroringState): void => {
        var childState = new Core.NG.StateNode(view.ViewName, view.Url, view.TemplateUrl, view.Controller);
        fmViewsState.AddChild(childState);
    });
    Core.NG.ForecastingModule.RegisterStateTree(fmViewsState);
}
