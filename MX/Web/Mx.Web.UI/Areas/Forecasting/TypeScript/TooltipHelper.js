var Forecasting;
(function (Forecasting) {
    Core.NG.CoreModule.Module().run([
        Core.NG.$sanitize.name, function ($sanitize) {
            Forecasting.GetTooltipEvents = function (events) { return events.map(function (event) { return "<tr><td colspan='2'><b>" + $sanitize(event) + "</b></td></tr>"; }).join(""); };
        }
    ]);
})(Forecasting || (Forecasting = {}));
