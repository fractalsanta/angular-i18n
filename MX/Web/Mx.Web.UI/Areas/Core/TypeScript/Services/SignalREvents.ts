module Core {
    export interface ISignalREvents {
        ItemUpdated(item: Inventory.Count.Api.Models.ICountUpdate, status: Inventory.Count.Api.Models.CountStatus);
        ItemsOfflineUpdated(itemUpdated: Inventory.Count.Api.Models.ICountUpdate);
        CountStateChanged();
        CountDeleted(countId: number, userName: string);
        CountSubmitted(countId: number, submitterName: string);

        TravelPathDataUpdated: Function[];
        TravelPathDataUpdatedPartial: Function[];
        NewLocationReceived: Function[];
        RenameLocation: Function[];
        DeActivateLocation: Function[];
        ActivateLocation: Function[];
        ResortLocation: Function[];

        ForecastHasBeenRegenerated: Function[];
        ForecastGenerationFailed: Function[];

        RefreshNotifications: Function[];
    }
} 