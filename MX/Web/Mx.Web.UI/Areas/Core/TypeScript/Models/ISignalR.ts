module Core {

    export class SignalRServerMethods {
        public static Subscribe = "Subscribe";
        public static Unsubscribe = "Unsubscribe";

        public static ItemUpdated = "ItemUpdated";
        public static ItemsOfflineUpdated = "ItemsOfflineUpdated";
        public static CountDeleted = "CountDeleted";
        public static CountStateChanged = "CountStateChanged";
        public static CountSubmitted = "CountSubmitted";

        public static TravelPathDataUpdatedPartial = "TravelPathDataUpdatedPartial";
        public static NewLocationReceived = "NewLocationReceived";
        public static RenameLocation = "RenameLocation";
        public static DeActivateLocation = "DeActivateLocation";
        public static ActivateLocation = "ActivateLocation";
        public static ResortLocation = "ResortLocation";
        public static GetLocations = "GetLocations";

        public static ForecastHasBeenRegenerated = "ForecastHasBeenRegenerated";
        public static ForecastGenerationFailed = "ForecastGenerationFailed";

        public static RefreshNotifications = "RefreshNotifications";
    }

    export class SignalRHubs {
        public static ApplicationHub = "applicationHub";
        //, counthub = <any>"applicationHub"
        //, travelpathhub = <any>"applicationHub"
        //, navigationhub = <any>"applicationHub"
    }
}  