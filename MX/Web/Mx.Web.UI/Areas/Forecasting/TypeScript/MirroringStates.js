var Forecasting;
(function (Forecasting) {
    "use strict";
    Forecasting.mirroringContainer = {
        L10N: {},
        Views: [],
        StateName: "MirroringStates",
        Template: "Templates/Mirroring.html",
        Url: "Mirroring",
        GetState: function (name) {
            var mc = Forecasting.mirroringContainer;
            if (name.indexOf(mc.StateName) !== -1) {
                var splits = name.split(".");
                name = splits.length ? splits[1] : name;
            }
            return _.findWhere(mc.Views, { ViewName: name });
        }
    };
    var l10N = function () { return Forecasting.mirroringContainer.L10N; };
    var fmViews = [
        {
            GetTitle: function () { return l10N().TitleMirroring + " - " + l10N().SalesItems; },
            ViewName: "SalesItems",
            Url: "SalesItems",
            TemplateUrl: "Templates/MirroringSalesItems.html",
            Controller: Forecasting.mirroringSalesItemsController
        },
        {
            GetTitle: function () { return l10N().TitleMirroring + " - " + l10N().SalesItems; },
            ViewName: "SalesItemDetails",
            Url: "SalesItemDetails",
            TemplateUrl: "Templates/MirroringSalesItemDetails.html",
            Controller: Forecasting.mirroringSalesItemDetailsController
        },
        {
            GetTitle: function () { return l10N().TitleMirroring + " - " + l10N().SalesItems; },
            ViewName: "SalesItemAdd",
            Url: "SalesItemAdd",
            TemplateUrl: "Templates/MirroringSalesItemDetails.html",
            Controller: Forecasting.mirroringSalesItemAddController
        }
    ];
    Forecasting.mirroringContainer.Views = fmViews;
    Forecasting.MirroringViews = { name: "MirroringStates" };
    angular.module("Forecasting").constant("MirroringStates", Forecasting.mirroringContainer);
    Forecasting.fmViewsState = new Core.NG.StateNode(Forecasting.mirroringContainer.StateName, Forecasting.mirroringContainer.Url, Forecasting.mirroringContainer.Template, Forecasting.mirroringController);
    _.forEach(Forecasting.mirroringContainer.Views, function (view) {
        var childState = new Core.NG.StateNode(view.ViewName, view.Url, view.TemplateUrl, view.Controller);
        Forecasting.fmViewsState.AddChild(childState);
    });
    Core.NG.ForecastingModule.RegisterStateTree(Forecasting.fmViewsState);
})(Forecasting || (Forecasting = {}));
