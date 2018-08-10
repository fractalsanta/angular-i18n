var Forecasting;
(function (Forecasting) {
    "use strict";
    Forecasting.mirroringStoreContainer = {
        L10N: {},
        Views: [],
        StateName: "MirroringStoreStates",
        Template: "Templates/Mirroring.html",
        Url: "Mirroring",
        GetState: function (name) {
            var mc = Forecasting.mirroringStoreContainer;
            if (name.indexOf(mc.StateName) !== -1) {
                var splits = name.split(".");
                name = splits.length ? splits[1] : name;
            }
            return _.findWhere(mc.Views, { ViewName: name });
        }
    };
    var l10N = function () { return Forecasting.mirroringStoreContainer.L10N; };
    var fmViews = [
        {
            GetTitle: function () { return l10N().TitleMirroring + " - " + l10N().Stores; },
            ViewName: "Stores",
            Url: "Stores",
            TemplateUrl: "Templates/MirroringStores.html",
            Controller: Forecasting.mirroringStoresController
        },
        {
            GetTitle: function () { return l10N().TitleMirroring + " - " + l10N().Stores; },
            ViewName: "StoreDetails",
            Url: "StoreDetails",
            TemplateUrl: "Templates/MirroringStoreDetails.html",
            Controller: Forecasting.mirroringStoresDetailsController
        },
        {
            GetTitle: function () { return l10N().TitleMirroring + " - " + l10N().Stores; },
            ViewName: "StoreAdd",
            Url: "StoreAdd",
            TemplateUrl: "Templates/MirroringStoreDetails.html",
            Controller: Forecasting.mirroringStoresAddController
        }
    ];
    Forecasting.mirroringStoreContainer.Views = fmViews;
    Forecasting.MirroringStoreViews = { name: "MirroringStoresStates" };
    angular.module("Forecasting").constant("MirroringStoreStates", Forecasting.mirroringStoreContainer);
    Forecasting.fmViewsStoreState = new Core.NG.StateNode(Forecasting.mirroringStoreContainer.StateName, Forecasting.mirroringStoreContainer.Url, Forecasting.mirroringStoreContainer.Template, Forecasting.mirroringStoreController);
    _.forEach(Forecasting.mirroringStoreContainer.Views, function (view) {
        var childState = new Core.NG.StateNode(view.ViewName, view.Url, view.TemplateUrl, view.Controller);
        Forecasting.fmViewsStoreState.AddChild(childState);
    });
    Core.NG.ForecastingModule.RegisterStateTree(Forecasting.fmViewsStoreState);
})(Forecasting || (Forecasting = {}));
