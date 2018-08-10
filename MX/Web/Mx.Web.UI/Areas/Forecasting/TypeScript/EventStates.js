var Forecasting;
(function (Forecasting) {
    Core.NG.ForecastingModule.RegisterMasterDetailPage("Events", "Events", { controller: Forecasting.eventsController, templateUrl: "Templates/EventView.html" }, { controller: Forecasting.eventWeekController, templateUrl: "Templates/EventWeek.html" }, { controller: Forecasting.eventDetailsController, templateUrl: "Templates/EventDetails.html" });
})(Forecasting || (Forecasting = {}));
