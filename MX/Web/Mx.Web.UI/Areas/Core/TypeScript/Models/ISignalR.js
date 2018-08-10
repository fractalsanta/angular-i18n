var Core;
(function (Core) {
    var SignalRServerMethods = (function () {
        function SignalRServerMethods() {
        }
        SignalRServerMethods.Subscribe = "Subscribe";
        SignalRServerMethods.Unsubscribe = "Unsubscribe";
        SignalRServerMethods.ItemUpdated = "ItemUpdated";
        SignalRServerMethods.ItemsOfflineUpdated = "ItemsOfflineUpdated";
        SignalRServerMethods.CountDeleted = "CountDeleted";
        SignalRServerMethods.CountStateChanged = "CountStateChanged";
        SignalRServerMethods.CountSubmitted = "CountSubmitted";
        SignalRServerMethods.TravelPathDataUpdatedPartial = "TravelPathDataUpdatedPartial";
        SignalRServerMethods.NewLocationReceived = "NewLocationReceived";
        SignalRServerMethods.RenameLocation = "RenameLocation";
        SignalRServerMethods.DeActivateLocation = "DeActivateLocation";
        SignalRServerMethods.ActivateLocation = "ActivateLocation";
        SignalRServerMethods.ResortLocation = "ResortLocation";
        SignalRServerMethods.GetLocations = "GetLocations";
        SignalRServerMethods.ForecastHasBeenRegenerated = "ForecastHasBeenRegenerated";
        SignalRServerMethods.ForecastGenerationFailed = "ForecastGenerationFailed";
        SignalRServerMethods.RefreshNotifications = "RefreshNotifications";
        return SignalRServerMethods;
    }());
    Core.SignalRServerMethods = SignalRServerMethods;
    var SignalRHubs = (function () {
        function SignalRHubs() {
        }
        SignalRHubs.ApplicationHub = "applicationHub";
        return SignalRHubs;
    }());
    Core.SignalRHubs = SignalRHubs;
})(Core || (Core = {}));
