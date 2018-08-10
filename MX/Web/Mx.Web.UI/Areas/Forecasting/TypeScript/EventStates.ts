module Forecasting {

    Core.NG.ForecastingModule.RegisterMasterDetailPage("Events", "Events",
        { controller: eventsController, templateUrl: "Templates/EventView.html" },
        { controller: eventWeekController, templateUrl: "Templates/EventWeek.html" },
        { controller: eventDetailsController, templateUrl: "Templates/EventDetails.html" });
}  