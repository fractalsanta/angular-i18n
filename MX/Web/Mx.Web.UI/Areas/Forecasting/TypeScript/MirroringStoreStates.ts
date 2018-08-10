module Forecasting {
    "use strict";

    export var mirroringStoreContainer: IMirroringStatesContainer = {
        L10N: <Api.Models.ITranslations>{},
        Views: [],
        StateName: "MirroringStoreStates",
        Template: "Templates/Mirroring.html",
        Url: "Mirroring",
        GetState: (name: string): IMirroringState => {
            var mc = mirroringStoreContainer;

            if (name.indexOf(mc.StateName) !== -1) {
                var splits = name.split(".");
                    name = splits.length ? splits[1] : name;
            }

            return _.findWhere(mc.Views, { ViewName: name });
        }
    };

    var l10N = (): Api.Models.ITranslations => mirroringStoreContainer.L10N;

    var fmViews: IMirroringState[] = [
        {
            GetTitle: (): string => l10N().TitleMirroring + " - " + l10N().Stores,
            ViewName: "Stores",
            Url: "Stores",
            TemplateUrl: "Templates/MirroringStores.html",
            Controller: mirroringStoresController
        },
        {
            GetTitle: (): string => l10N().TitleMirroring + " - " + l10N().Stores,
            ViewName: "StoreDetails",
            Url: "StoreDetails",
            TemplateUrl: "Templates/MirroringStoreDetails.html",
            Controller: mirroringStoresDetailsController
        },
        {
            GetTitle: (): string => l10N().TitleMirroring + " - " + l10N().Stores,
            ViewName: "StoreAdd",
            Url: "StoreAdd",
            TemplateUrl: "Templates/MirroringStoreDetails.html",
            Controller: mirroringStoresAddController
        }
        
    ];

    mirroringStoreContainer.Views = fmViews;
    export var MirroringStoreViews: Core.NG.INamedDependency<IMirroringStatesContainer> = { name: "MirroringStoresStates" };
    angular.module("Forecasting").constant("MirroringStoreStates", mirroringStoreContainer);

    export var fmViewsStoreState = new Core.NG.StateNode(
            mirroringStoreContainer.StateName, mirroringStoreContainer.Url, mirroringStoreContainer.Template, mirroringStoreController);
    _.forEach(mirroringStoreContainer.Views, (view: IMirroringState): void => {
        var childState = new Core.NG.StateNode(view.ViewName, view.Url, view.TemplateUrl, view.Controller);
        fmViewsStoreState.AddChild(childState);
    });
    Core.NG.ForecastingModule.RegisterStateTree(fmViewsStoreState);
}
