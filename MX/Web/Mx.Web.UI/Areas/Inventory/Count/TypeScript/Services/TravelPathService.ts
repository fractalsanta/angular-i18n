module Inventory.Count {

    interface ITravelPathCallback {
        TravelPathDataUpdated(items: Api.Models.ITravelPath[]): void;
    }

    export interface ITravelPathService {
        GetModel(): ITravelPathModel;
        GetModelPromise(): ng.IHttpPromise<Api.Models.ITravelPathEntity>;
        FlattenTravelPathItems(): Inventory.Count.Api.Models.ITravelPathItem[];
        GetTravelPathData(currentEntityId: number): ng.IHttpPromise<Inventory.Count.Api.Models.ITravelPathEntity>;
        PostUpdateTravelPath(update: Inventory.Count.Api.Models.IUpdateTravelPath, currentEntityId: number): ng.IHttpPromise<{}>;

        GetCurrentLocationIndex(): number;
        GetCurrentLocation(): Api.Models.ITravelPath;
        SetCurrentLocationIndex(idx: number): void;
        SetCurrentLocation(location: Api.Models.ITravelPath): void;

        AddNewLocation(travelPathData: Api.Models.ITravelPath, currentEntityId: number);
        RenameLocation(locationId: number, newLocationName: string, currentEntityId: number);
        DeActivateLocation(locationId: number, currentEntityId: number);
        ActivateLocation(travelPathData: Api.Models.ITravelPath, currentEntityId: number);
        ResortLocations(locationIds: number[], currentEntityId: number);
        GetLocations(currentEntityId: number);

        GetSignalRconnectionId(): string;
                
        UpdateTravelPathItem(update: Api.Models.ITravelPathItemUpdate): ng.IHttpPromise<{}>;
        ResetOtherCounts(input: Inventory.Count.Api.Models.ITravelPathItem): void;

        SetLocationModalListMultiSelect(allowMultiSelect: boolean);
        GetLocationModalListMultiSelect(): boolean;

        ModelReceived: Core.Events.IEvent<void>;
}

    export interface ITravelPathModel {
        TravelPathEntity: Api.Models.ITravelPathEntity;
    }

    class TravelPathService implements ITravelPathService {
        private _model: ITravelPathModel;
        private _currentLocationIdx: number;
        private _currentLocation: Api.Models.ITravelPath;
        private _entityId: number;
        private _locationListAllowMultiSelect: boolean;

        public ModelReceived: Core.Events.IEvent<void>;

        InitializeModel() {
            this._model = <ITravelPathModel>{
                TravelPathEntity: <Api.Models.ITravelPathEntity>{
                    TravelPath: []
                }
            };

            var user = this.authService.GetUser();
            this._entityId = user.BusinessUser.MobileSettings.EntityId;
            this._locationListAllowMultiSelect = false;

            this.ModelReceived = new Core.Events.Event<void>();
        }

        constructor(
            private travelPathService: Api.ITravelPathService,
            private authService: Core.Auth.IAuthService,
            private signalR: Core.ISignalRService,
            private travelPathItemService: Api.ITravelPathItemService,
            private rootScope: ng.IRootScopeService
            ) {

            this.InitializeModel();
            this.RegisterSignaRListeners();
            
            rootScope.$on(Core.ApplicationEvent.ChangeStore, (): void => {
                this.InitializeModel();
            });
        }

        SetLocationModalListMultiSelect(allowMultiSelect: boolean) {
            this._locationListAllowMultiSelect = allowMultiSelect;
        }

        GetLocationModalListMultiSelect() {
            return this._locationListAllowMultiSelect;
        }

        RegisterSignaRListeners() {

            /* ------------------   TravelPathDataUpdatedPartial ----------------------*/
            this.signalR.SetSignalREventListener(
                <any>Core.SignalRServerMethods.TravelPathDataUpdatedPartial
                , (travelPathLocationId: number, currentEntityId: number) => this.TravelPathHasBeenUpdatedPartially(travelPathLocationId, currentEntityId));  
            /* ------------------------------------------------------------------------*/

            /* ------------------   NewLocationReceived   -----------------------------*/
            this.signalR.SetSignalREventListener(
                <any>Core.SignalRServerMethods.NewLocationReceived
                , (travelPathData: Api.Models.ITravelPath, currentEntityId: number) => this.AddNewLocation(travelPathData, currentEntityId));  
            /* ------------------------------------------------------------------------*/

            /* ------------------   GetLocations        -----------------------------*/
            this.signalR.SetSignalREventListener(
                <any>Core.SignalRServerMethods.GetLocations
                , (currentEntityId: number) => this.GetLocations(currentEntityId));  
            /* ------------------------------------------------------------------------*/

            /* ------------------   RenameLocation        -----------------------------*/
            this.signalR.SetSignalREventListener(
                <any>Core.SignalRServerMethods.RenameLocation
                , (travelPathData: Api.Models.ITravelPath, currentEntityId: number) => this.RenameLocation(travelPathData.Id, travelPathData.Location, currentEntityId));  
            /* ------------------------------------------------------------------------*/

            /* ------------------   DeActivateLocation    -----------------------------*/
            this.signalR.SetSignalREventListener(
                <any>Core.SignalRServerMethods.DeActivateLocation
                , (travelPathData: Api.Models.ITravelPath, currentEntityId: number) => this.DeActivateLocation(travelPathData.Id, currentEntityId));  
            /* ------------------------------------------------------------------------*/

            /* ------------------   ActivateLocation      -----------------------------*/
            this.signalR.SetSignalREventListener(
                <any>Core.SignalRServerMethods.ActivateLocation
                , (travelPathData: Api.Models.ITravelPath, currentEntityId: number) => this.ActivateLocation(travelPathData, currentEntityId));  
            /* ------------------------------------------------------------------------*/

            /* ------------------   ResortLocation        -----------------------------*/
            this.signalR.SetSignalREventListener(
                <any>Core.SignalRServerMethods.ResortLocation
                , (locationIds: number[], currentEntityId: number) => this.ResortLocations(locationIds, currentEntityId));  
            /* ------------------------------------------------------------------------*/
        }

        TravelPathHasBeenUpdatedPartially(travelPathLocationId: number, currentEntityId: number) {
            if (this._entityId === currentEntityId) {
                this.travelPathService.GetTravelPathDataForLocation(currentEntityId, travelPathLocationId).then((result) => {
                    if (this._entityId === currentEntityId && this._model !== null && this._model.TravelPathEntity !== null) {
                        for (var i = 0; i < this._model.TravelPathEntity.TravelPath.length; i++) {
                            var location = this._model.TravelPathEntity.TravelPath[i];
                            if (location.Id == travelPathLocationId) {
                                this._model.TravelPathEntity.TravelPath[i] = result.data;
                                this.ModelReceived.Fire(null);
                                break;
                            }
                        }
                    }
                });
            }
        }

        AddNewLocation(travelPathData: Api.Models.ITravelPath, currentEntityId: number) {
            if (this._entityId === currentEntityId) {
                this._model.TravelPathEntity.TravelPath.push(travelPathData);
                this.ModelReceived.Fire(null);
            }
        }

        GetLocations(currentEntityId: number) {
            if (this._entityId === currentEntityId) {
                return this._model.TravelPathEntity.TravelPath;
            }
        }

        RenameLocation(locationId: number, newLocationName: string, currentEntityId: number) {
            if (this._entityId === currentEntityId) {
                var existingLocation = _.find(this._model.TravelPathEntity.TravelPath, { "Id": locationId });
                existingLocation.Location = newLocationName;
                this.ModelReceived.Fire(null);
            }
        }

        DeActivateLocation(locationId: number, currentEntityId: number) {
            if (this._entityId === currentEntityId) {
                var existingLocation = _.find(this._model.TravelPathEntity.TravelPath, { "Id": locationId });
                this._model.TravelPathEntity.TravelPath = _.without(this._model.TravelPathEntity.TravelPath, existingLocation);
                this.ModelReceived.Fire(null);
            }
        }

        ActivateLocation(travelPathData: Api.Models.ITravelPath, currentEntityId: number) {
            if (this._entityId === currentEntityId) {
                this._model.TravelPathEntity.TravelPath.push(travelPathData);
                this.ModelReceived.Fire(null);
            }
        }

        ResortLocations(locationIds: number[], currentEntityId: number) {
            if (this._entityId === currentEntityId) {
                locationIds = _.remove(locationIds, (id) => {
                    return _.find(this._model.TravelPathEntity.TravelPath, { "Id": id }) != null;
                });
                this._model.TravelPathEntity.TravelPath = _.map(locationIds, (id) => {
                    return _.find(this._model.TravelPathEntity.TravelPath, { "Id": id });
                });
            }
        }
   
        GetModelCallback(result: ng.IHttpPromiseCallbackArg<Api.Models.ITravelPathEntity>) {            
            _.assign(<any>this._model.TravelPathEntity, result.data);
            this.ModelReceived.Fire(null);  
        }


        GetModelPerformServerCall(entityId: number): void {
            this.travelPathService.GetTravelPathData(entityId).then((result) => this.GetModelCallback(result));
        }

        GetModel(): ITravelPathModel {
            var user = this.authService.GetUser();
            var entityId = user.BusinessUser.MobileSettings.EntityId;
  
            if (this._model.TravelPathEntity.TravelPath.length == 0) {
                this.GetModelPerformServerCall(entityId);
            } else {
            if (this._model.TravelPathEntity.EntityId != entityId) {
                    this.GetModelPerformServerCall(entityId);
                }
            }
            return this._model;
        }

        FlattenTravelPathItems(): Inventory.Count.Api.Models.ITravelPathItem[] {
            if (this._model != null && this._model.TravelPathEntity != null) {
                return _.flatten(this._model.TravelPathEntity.TravelPath, item => item.Items);
            }
            return [];
        }

        GetModelPromise(): ng.IHttpPromise<Api.Models.ITravelPathEntity> {
            var user = this.authService.GetUser();
            var entityId = user.BusinessUser.MobileSettings.EntityId;
            return this.travelPathService.GetTravelPathData(entityId);
        }

        
        GetTravelPathData(currentEntityId: number) {
            return this.travelPathService.GetTravelPathData(currentEntityId);
        }

        PostUpdateTravelPath(update: Count.Api.Models.IUpdateTravelPath, currentEntityId: number) {
            var currentSignalRConnectionId = this.GetSignalRconnectionId();
            var promise = this.travelPathService.PostUpdateTravelPath(update, currentSignalRConnectionId, currentEntityId);

            promise.then((result) => {
                _.forEach(result.data, (travelPathPartialUpdate) => {
                    this.TravelPathHasBeenUpdatedPartially(travelPathPartialUpdate.Id, travelPathPartialUpdate.EntityId);                                    
                });                
            });

            return promise;
        }

        GetCurrentLocationIndex() {
            return this._currentLocationIdx;
        }

        SetCurrentLocation(location: Api.Models.ITravelPath) {
            this._currentLocation = location;
        }

        GetCurrentLocation() {
            return this._currentLocation;
        }

        SetCurrentLocationIndex(idx: number) {
            this._currentLocationIdx = idx;
        }


        UpdateTravelPathItem(update: Api.Models.ITravelPathItemUpdate) {
            return this.travelPathItemService.PostUpdateCount(update);
        }

        GetSignalRconnectionId() {
            return this.signalR.GetConnectionId();
        }

        ResetOtherCounts(input: Inventory.Count.Api.Models.ITravelPathItem) {
            _.each(this.FlattenTravelPathItems(), item => {
                if (item.Id != input.Id && item.Code.toLowerCase() === input.Code.toLowerCase()) {
                    item.IsDailyCounted = input.IsDailyCounted;
                    item.IsMonthlyCounted = input.IsMonthlyCounted;
                    item.IsPeriodicCounted = input.IsPeriodicCounted;
                    item.IsSpotCounted = input.IsSpotCounted;
                    item.IsWeeklyCounted = input.IsWeeklyCounted;
                }
            });
        }

    }

    export var $travelPathService: Core.NG.INamedService<ITravelPathService> = Core.NG.InventoryCountModule.RegisterService("travelPath", TravelPathService,
        Api.$travelPathService
        , Core.Auth.$authService
        , Core.$signalR
        , Api.$travelPathItemService
        , Core.NG.$rootScope
        );
} 