module Inventory.Count {
    "use strict";

    import ICApi = Administration.Settings.Api;

    export enum CountField {
        Outer = 0,
        Inner = 1,
        Inventory = 2,
        Weight = 3
    }

    export enum InventoryCountView {
        NotSet = <any>"",
        Items = <any>"InventoryCount.Items",
        Locations = <any>"InventoryCount.Locations",
        Groups = <any>"InventoryCount.Groups"
    }

    export interface IPersistedCountUpdate {
        UserId: number;
        DataDate: string;
        PersistedCountUpdates: Api.Models.ICountUpdate[];
    }

    export interface ICountItemWithOriginalCounts extends Api.Models.ICountItem {
        OriginalOuterCount?: number;
        OriginalInnerCount?: number;
        OriginalInventoryCount?: number;
        OriginalWeightCount?: number;
    }

    export interface ICountModel {
        Inventory: Api.Models.IInventoryCount;
        CountUpdatesQueue: Api.Models.ICountUpdate[];
        PersistedCountUpdate: IPersistedCountUpdate;
    }

    export interface ICountItemGroup {
        GroupName: string;
        CountItems: Api.Models.ICountItem[];
    }

    export interface ICountService extends IUpdateNoCostItemService {
        GetModel(entityId: number, countType: Api.Models.CountType): ICountModel;
        GetCurrentModel(): ICountModel;
        GetModelPromise(entityId: number, countType: Api.Models.CountType): ng.IHttpPromise<Count.Api.Models.IInventoryCount>;
        PushUpdate(item: Api.Models.ICountItem, type: CountField);
        GetItemsToCount(): number;
        HasCountedItems(): boolean;
        GetNoCostValues(): Api.Models.ICountItem[];
        Delete(countType: Api.Models.CountType, countId: number): ng.IHttpPromise<{}>;
        UpdateItemCostInAllLocations(itemId: number, cost: number);
        SearchAllEntityItemsAndVendorEntityItems(entityId: number, countId: number, locationId: number, itemTypeId: number, search: string);

        InitializeModel();
        ResetCurrentCount();

        CountSignalRHubDisconnected(): any;
        IsOfflineMode(): boolean;
        IsBusy(): boolean;
        IsApplyDateReadOnly(): boolean;
        GetLocalStoreDateTime(): string;

        SetCountDeletedCallback(callback: any): void;
        SetCountModelHasBeenReloadedCallback(callback: any): void;
        SetCountSubmittedCallback(callback: (submitterName: string) => void): void;
        GetSameItems(itemId: number, vendorItemId: number): Api.Models.ICountItem[];
        GetUniqueProducts(): Api.Models.ICountItem[];
        GetItemGroups(): ICountItemGroup[];

        SetLoadingFlag(value: boolean): void;
        UpdateDefaultCountView(view: InventoryCountView): void;

        GetTranslatedCountType(countType: Count.Api.Models.CountType, l10N: Api.Models.IL10N): string;
        GetCountType(typeName: string): Count.Api.Models.CountType;

        GetTranslatedCountStatus(countStatus: Count.Api.Models.CountStatus): string;

        ModelReceived: Core.Events.IEvent<void>;

        GetCssStatusClass(item: Api.Models.ICountItem): string;
        GetCssStatusColor(item: Api.Models.ICountItem): string;
        GetCssItemStatusClass(status: Api.Models.CountStatus): string;
        GetCssItemStatusColor(status: Api.Models.CountStatus): string;
        GetCssLocationStatusColor(status: Api.Models.CountStatus): string;

        AddItemsToCurrentCount(entityId: number, countId: number, locationId: number, items: Api.Models.ICountItem[]): void;

        InvokeCountModelReloadedCallback(): void;


}

    interface ICountUpdateItem {
        CountId: number;
        CountDetailId: number;
        UnitType: string;
    }

    export class CountService implements ICountService {
        private _translations: Api.Models.IL10N;
        private _model: ICountModel;
        private _offlineDataLocalStorageName: string;
        private _isOfflineMode: boolean;
        private _currentCountType: Api.Models.CountType;
        private _countDeletedCallback: any;
        private _countModelReloadedCallback: any;
        private _countSubmittedCallback: (submitterName: string) => void;

        private _timeoutPromise: ng.IPromise<any>;
        private _emptyModelReceivedTimeoutPromise: ng.IPromise<any>;
        private _offlineMonitor: ng.IDeferred<any>;
        private _emptyCountReceivedNumberOfRepeatCalls: number = 0;

        private _modelRetrievalAttempts = 5;
        private _modelRetrievalInterval = 3000;

        
        private _updateRequestNumberOfElements = 30;
        private _updateRequestNumberOfElementsDefault = 30;
        private _updateRequestNumberOfElementsAfterFailure = 5;

        private _numberOfSequentiallyFailedUpdateRequests = 0;
        private _numberOfSequentiallyFailedUpdateRequestsBeforeIncrease = 3;
        private _defferedProcessQueueIntervalDefault = 3000;
        private _defferedProcessQueueIntervalCurrent = 3000;
        private _defferedProcessQueueIntervalMax = 60000;
        private _defferedProcessQueueScheduled = false;

        private _pendingCountColor = "";
        private _outOfToleranceCountColor = "";
        private _countedCountColor = "";
        private _currentCountView = InventoryCountView.NotSet;
        private _initialLoad = false;

        public ModelReceived: Core.Events.IEvent<void>;

        constructor(
            private translationService: Core.ITranslationService,
            private authService: Core.Auth.IAuthService,
            private countService: Api.ICountService,
            private signalR: Core.ISignalRService,
            private localstorage: Core.LocalStorage.ILocalStorageService,
            private rootScope: ng.IRootScopeService,
            private countTypeService: Api.ICountTypeService,
            private $http: ng.IHttpService,
            private timeoutService: ng.ITimeoutService,
            private popupMessageService: Core.IPopupMessageService,
            private $q: ng.IQService,
            private updateCostApiService: Count.Api.IUpdateCostService,
            private inventoryCountSettingsService: ICApi.IInventoryCountSettingsService,
            private userSettingService: Administration.User.Services.IUserSettingsService
            ) {
            
            rootScope.$on(Core.ApplicationEvent.ChangeStore, (): void => {
                this.InitializeModel();
            });

            this.ModelReceived = new Core.Events.Event<void>();

            this._offlineMonitor = null;
            this.SetOfflineFlag(false);
            this._offlineDataLocalStorageName = "countOfflineItems";
            this.InitializeModel();
            this.RegisterSignaRListeners();

            /* --------------- Check if there are Local Storage Items and process them ---------------- */
            this.CheckPersistedCountUpdates();
        }

        UpdateNoCostItems(items: Count.Api.Models.IUpdateCostViewModel[]) {
            var promise = <ng.IHttpPromise<{}>> {};

            if (items != null && items.length > 0) {
                _.forEach(items, item => this.UpdateItemCostInAllLocations(item.ItemId, item.InventoryUnitCost));
            }
            var user = this.authService.GetUser();
            if (user != null && user.BusinessUser != null && user.BusinessUser.MobileSettings != null) {
                var entityId = user.BusinessUser.MobileSettings.EntityId;
                promise = this.updateCostApiService.PostUpdateCost(items, entityId);
            }
            return promise;
        }

        SetOfflineFlag(offline: boolean): void {
            this._isOfflineMode = offline;
            this.popupMessageService.SetOfflineFlag(this._isOfflineMode);
        }

        InitializeModel() {

            var user = this.authService.GetUser();
            this.ResetDefferedProcessQueueInterval();
            this._updateRequestNumberOfElements = this._updateRequestNumberOfElementsDefault;
            this._defferedProcessQueueScheduled = false;

            this._model = {
                Inventory: <Api.Models.IInventoryCount>{ Locations: [] },

                CountUpdatesQueue: [],
                PersistedCountUpdate: {
                    UserId: user != null ? user.BusinessUser.Id : 0,
                    DataDate: moment().format("DD.MM.YYYY").toString(),
                    PersistedCountUpdates: []
                }
            };

            this._currentCountType = null;

            this.translationService.GetTranslations().then(result => {
                this._translations = result.InventoryCount;
            });

            this.inventoryCountSettingsService.GetInventoryCountSettings().success((results: Administration.Settings.Api.Models.IInventoryCountSettingsViewModel): void => {

                this._pendingCountColor = results.PendingColor;
                this._outOfToleranceCountColor = results.OutOfToleranceColor;
                this._countedCountColor = results.CountedColor;
            });
        }

        ResetCurrentCount() {
            this._model.Inventory.Locations = [];
            this.ResetDefferedProcessQueueInterval();
            this._defferedProcessQueueScheduled = false;
        }

        IsOfflineMode() {
            return this._isOfflineMode;
        }

        PushUpdate(item: Api.Models.ICountItem, countFieldType: CountField) {

            if (this.ItemCountHasChanged(item, countFieldType)) {
                var countUpdateRequest = this.PrepareUpdateRequest(item, countFieldType);
                this._model.CountUpdatesQueue.push(countUpdateRequest);
                this.PersistUpdatesQueue();
                this.popupMessageService.SetPendingTasks(this._model.CountUpdatesQueue.length);
                item.Status = Api.Models.CountStatus.Pending;
                this.CreateDefferedProcessQueueFunctionCall(true);
                this.UpdateOriginalCount(<ICountItemWithOriginalCounts>item, countFieldType);
            }
        }

        /*-----------------------------    Prepare ICountUpdate request    --------------------------------------------------------*/

        private PrepareUpdateRequest(item: Api.Models.ICountItem, countFieldType: CountField): Api.Models.ICountUpdate {

            var countUpdateRequest = this.CreateICountUpdateRequest(item, countFieldType);

            if (countUpdateRequest != null && !countUpdateRequest.Amount && countUpdateRequest.Amount !== 0) {
                // indicates the field has been cleared (has either null, undefined or empty string)
                countUpdateRequest.Amount = 0;
                countUpdateRequest.ToClear = true;

                if (!item.OuterCount && !item.InnerCount && !item.InventoryCount && !item.WeightCount) {
                    countUpdateRequest.ReadyToApply = false;
                    countUpdateRequest.CheckVariance = false;
                }
            }
            return countUpdateRequest;
        }

        private CreateICountUpdateRequest(item: Api.Models.ICountItem, countFieldType: CountField) {
            var countId = this._model.Inventory.Id;

            switch (countFieldType) {
                case CountField.Outer:
                    return this.CreateICountUpdateRequestObject(item, item.OuterCount, "OuterCount", countId);
                case CountField.Inner:
                    return this.CreateICountUpdateRequestObject(item, item.InnerCount, "InnerCount", countId);
                case CountField.Inventory:
                    return this.CreateICountUpdateRequestObject(item, item.InventoryCount, "InventoryCount", countId);
                case CountField.Weight:
                    return this.CreateICountUpdateRequestObject(item, item.WeightCount, "WeightCount", countId);
            }
            return null;
        }

        private CreateICountUpdateRequestObject(item: Api.Models.ICountItem, amount: number, unitType: string, countId: number) {
            var updaterequest: Api.Models.ICountUpdate = {
                Amount: amount,
                ItemId: item.ItemId,
                CountDetailId: item.Id,
                LocationId: item.LocationId,
                ReadyToApply: true,
                ToClear: false,
                CountId: countId,
                UnitType: unitType,
                CheckVariance: this.SeekVariance(item.Id, item.ItemId),
                VariancePercent: item.VariancePercent,
                IsProcessed: false
            };
            return updaterequest;
        }

        private SeekVariance(detailId: number, itemId: number): boolean {
            var check = (item: Api.Models.ICountItem) => item.ItemId == itemId && item.Id != detailId
                && !item.ReadyToApply
                && item.Status !== Count.Api.Models.CountStatus.Pending
            ;
            var allItems = this.Flatten();
            return !_.some(allItems, check);
        }

        /*-----------------------------    Prepare ICountUpdate request    --------------------------------------------------------*/


        /*-----------------------------    Local Storage Management    --------------------------------------------------------*/

        private PersistUpdatesQueue() {
            this._model.PersistedCountUpdate.PersistedCountUpdates = this._model.CountUpdatesQueue;
            this.localstorage.Add(this._offlineDataLocalStorageName, this._model.PersistedCountUpdate);
        }

        private CheckPersistedCountUpdates() {
            if (this.localstorage.Get(this._offlineDataLocalStorageName) != null) {
                var user = this.authService.GetUser();
                var offline = <IPersistedCountUpdate>this.localstorage.Get(this._offlineDataLocalStorageName);
                if (offline != null && user != null && user.BusinessUser != null && offline.UserId === user.BusinessUser.Id) {

                    if (offline.DataDate === moment().format("DD.MM.YYYY").toString()) {

                        if (offline.PersistedCountUpdates != null && offline.PersistedCountUpdates.length > 0) {
                            this._model.CountUpdatesQueue = offline.PersistedCountUpdates;
                            this.PersistUpdatesQueue();
                            this.ProcessOfflineElements(user);
                        }
                    }
                }
            }
        }

        /*-----------------------------    Local Storage Management    --------------------------------------------------------*/

        /*-----------------------------    Process Updates    --------------------------------------------------------*/

        private ProcessQueue() {
            var user = this.authService.GetUser();
            var hubConnection = this.signalR.GetConnectionId() == null ? "" : this.signalR.GetConnectionId();

            var resolveMonitor = () => {
                if (this._offlineMonitor != null && this._model.CountUpdatesQueue.length == 0) {
                    this._offlineMonitor.resolve();
                }
            };

            resolveMonitor();

            if (this.IsOfflineMode() || this.$http.pendingRequests.length > 0) {
                this.CreateDefferedProcessQueueFunctionCall();
            } else {
                if (this._model.CountUpdatesQueue.length > 0) {

                    var countItemsToBeUpdated: Api.Models.ICountUpdate[] = this._model.CountUpdatesQueue.slice(0, this._updateRequestNumberOfElements);                    
                    var countId = countItemsToBeUpdated[0].CountId;
                    this.SendUpdateRequest(countId, countItemsToBeUpdated, user.BusinessUser.MobileSettings.EntityId, hubConnection, resolveMonitor);                                       
                }
            }
        }

        private SendUpdateRequest(countId: number, countItemsToBeUpdated: Api.Models.ICountUpdate[], entityId: number, hubConnection: string, resolveMonitor: Function) {
            var promise = this.countService.PutCount(countItemsToBeUpdated, entityId, hubConnection);

            promise.then((result) => {
                this.UpdateItemsStatuses(result.data);

                var countUpdatedItems = _.map(result.data, (item) => {
                    return <ICountUpdateItem>{
                        CountId: item.CountUpdate.CountId,
                        CountDetailId: item.CountUpdate.CountDetailId,
                        UnitType: item.CountUpdate.UnitType
                    };
                });

                this._updateRequestNumberOfElements = this._updateRequestNumberOfElementsDefault;
                this.ResetDefferedProcessQueueInterval();
                this.HandleQueueProcessedItems(countUpdatedItems);
                resolveMonitor();
            },
                (result) => {

                    if (result.status != Core.HttpStatus.InternalServerError) {
                        this.popupMessageService.ClearMessages();
                    }

                    if (result.status == Core.HttpStatus.Conflict) {
                        var countFailedItems = _.map(countItemsToBeUpdated, (item) => {
                            return <ICountUpdateItem>{
                                CountId: item.CountId,
                                CountDetailId: item.CountDetailId,
                                UnitType: item.UnitType
                            };
                        });

                        this.HandleQueueProcessedItems(countFailedItems);
                        this.SignalRCountDeleted(countId, "");
                    }

                    if (result.status != Core.HttpStatus.Conflict) {
                        this._numberOfSequentiallyFailedUpdateRequests++;
                        this._updateRequestNumberOfElements = this._updateRequestNumberOfElementsAfterFailure;
                        this.IncreaseDefferedProcessQueueInterval();
                        this.CreateDefferedProcessQueueFunctionCall();
                    }

                });            
        }

        private HandleQueueProcessedItems(countUpdatedItems: ICountUpdateItem[]) {

            _.forEach(countUpdatedItems, (updateItem: ICountUpdateItem) => {
                var queueItem = _.find(this._model.CountUpdatesQueue, (item: Api.Models.ICountUpdate) => item.CountDetailId == updateItem.CountDetailId && item.UnitType == updateItem.UnitType);
                if (queueItem != null) {
                    queueItem.IsProcessed = true;
                }
            });

            _.remove(this._model.CountUpdatesQueue, (item: Api.Models.ICountUpdate) => item.IsProcessed);

            this.PersistUpdatesQueue();
            this.popupMessageService.SetPendingTasks(this._model.CountUpdatesQueue.length);

            if (this._model.CountUpdatesQueue.length > 0) {
                this.CreateDefferedProcessQueueFunctionCall(true);
            }
        }

        private UpdateItemsStatuses(updatedItemsStatuses: Api.Models.IUpdatedItemCountStatus[]) {
            _.forEach(updatedItemsStatuses, item => {
                var update = item.CountUpdate;
                this.UpdateItemStatus(update.CountId, update.LocationId, update.ItemId, update.UnitType, update.Amount, item.CountStatus, update.ReadyToApply, update.CountDetailId, update.VariancePercent);
            });
        }

        private UpdateItemStatus(countId: number, locationId: number, itemId: number, unitType: string, amount: number, status: Api.Models.CountStatus, readyToApply: boolean, itemDetailId: number, variancePercent: number) {

            if (countId != this._model.Inventory.Id) { return null; }

            var location = _.find(this._model.Inventory.Locations, (l: Api.Models.ICountLocation) => l.Id == locationId);
            if (location != null) {
                //current item - updated / being updated item --------------------------------------
                var item = _.find(location.Items, (i: Api.Models.ICountItem) => i.Id == itemDetailId);
                if (item != null) {

                    if (status == Api.Models.CountStatus.NotCounted) {
                        amount = null;
                    }

                    var countType: CountField = CountField.Inner;

                    switch (unitType) {
                        case "OuterCount":
                            item.OuterCount = amount;
                            countType = CountField.Outer;
                            break;
                        case "InnerCount":
                            item.InnerCount = amount;
                            countType = CountField.Inner;
                            break;
                        case "InventoryCount":
                            item.InventoryCount = amount;
                            countType = CountField.Inventory;
                            break;
                        case "WeightCount":
                            item.WeightCount = amount;
                            countType = CountField.Weight;
                            break;
                    }

                    item.Status = status;
                    item.ReadyToApply = readyToApply;
                    item.VariancePercent = variancePercent;

                    var hasVariance = (status == Api.Models.CountStatus.Variance);

                    //Check for the same item in other locations - and update it's Status -----------------------------------------------------------------------------
                    if (status != Api.Models.CountStatus.Pending) {
                        this.CheckAndUpdateItemsStatuses(item, hasVariance);
                    }
                    //-------------------------------------------------------------------------------------------------------------------------------------------------

                    this.UpdateOriginalCount(item, countType);

                    return item;
                }
            }
            return null;
        }

        private CheckAndUpdateItemsStatuses(item: Api.Models.ICountItem, hasVariance: boolean) {
            var allItems = _.where(this.Flatten(), x=> x.ItemId == item.ItemId);
            var matchingItemIdItems = _.where(allItems, (i) => { return i.Id != item.Id; });
            var uncountedItems: boolean = _.some(allItems, (i) => { return !i.ReadyToApply; });
            var countedItems: boolean = _.some(allItems, (i) => { return i.ReadyToApply; });

            if (matchingItemIdItems.length) {
                if (uncountedItems) {
                    item.Status = countedItems ? Api.Models.CountStatus.Partial : Api.Models.CountStatus.NotCounted;
                    item.HasVariance = hasVariance;
                    _.forEach(matchingItemIdItems, otherItem => {
                        if (otherItem.Status != Api.Models.CountStatus.Pending) {
                            otherItem.Status = item.Status;
                        }
                        otherItem.HasVariance = false;
                    });
                } else {
                    item.Status = hasVariance ? Api.Models.CountStatus.Variance : Api.Models.CountStatus.Counted;
                    item.HasVariance = hasVariance;
                    _.forEach(matchingItemIdItems, otherItem => {
                        otherItem.Status = item.Status;
                        otherItem.HasVariance = hasVariance;
                    });
                }
            } else {
                item.HasVariance = hasVariance;
                if (item.ReadyToApply) {
                    item.Status = hasVariance ? Api.Models.CountStatus.Variance : Api.Models.CountStatus.Counted;
                } else {
                    item.Status = Api.Models.CountStatus.NotCounted;
                }
            }
        }

        private ExamineAndSetItemStatusesOnLoad() {
            var allCountedItems = _.where(this.Flatten(), (item) => { return item.ReadyToApply; });
            _.forEach(allCountedItems, item => this.CheckAndUpdateItemsStatuses(item, item.HasVariance));
        }

        private UpdateOriginalCounts(): void {
            var allItems = this.Flatten();
            _.forEach(allItems, item => this.UpdateOriginalCount(<ICountItemWithOriginalCounts>item, null));
        }

        private UpdateOriginalCount(item: ICountItemWithOriginalCounts, countType: CountField): void {
            switch (countType) {
                case CountField.Inner:
                    item.OriginalInnerCount = item.InnerCount;
                    break;
                case CountField.Inventory:
                    item.OriginalInventoryCount = item.InventoryCount;
                    break;
                case CountField.Outer:
                    item.OriginalOuterCount = item.OuterCount;
                    break;
                case CountField.Weight:
                    item.OriginalWeightCount = item.WeightCount;
                    break;
                default:
                    item.OriginalInnerCount = item.InnerCount;
                    item.OriginalInventoryCount = item.InventoryCount;
                    item.OriginalOuterCount = item.OuterCount;
                    item.OriginalWeightCount = item.WeightCount;
                    break;
            }
        }

        private ItemCountHasChanged(item: Api.Models.ICountItem, countType: CountField): boolean {
            var itemWithOriginalCount = <ICountItemWithOriginalCounts>item;
            var itemCountHasChanged = false;

            switch (countType) {
                case CountField.Inner:
                    itemCountHasChanged = itemWithOriginalCount.InnerCount !== itemWithOriginalCount.OriginalInnerCount;
                    break;

                case CountField.Outer:
                    itemCountHasChanged = itemWithOriginalCount.OuterCount !== itemWithOriginalCount.OriginalOuterCount;
                    break;

                case CountField.Inventory:
                    itemCountHasChanged = itemWithOriginalCount.InventoryCount !== itemWithOriginalCount.OriginalInventoryCount;
                    break;

                case CountField.Weight:
                    itemCountHasChanged = itemWithOriginalCount.WeightCount !== itemWithOriginalCount.OriginalWeightCount;
                    break;

                default:
                    itemCountHasChanged = itemWithOriginalCount.InnerCount !== itemWithOriginalCount.OriginalInnerCount ||
                    itemWithOriginalCount.OuterCount !== itemWithOriginalCount.OriginalOuterCount ||
                    itemWithOriginalCount.InventoryCount !== itemWithOriginalCount.OriginalInventoryCount ||
                    itemWithOriginalCount.WeightCount !== itemWithOriginalCount.OriginalWeightCount;
                    break;
            }

            return itemCountHasChanged;
        }

        private ProcessOfflineElements(user: Core.Auth.IUser) {
            this._offlineMonitor = this.$q.defer<any>();
            this.CreateDefferedProcessQueueFunctionCall(true);
            this._offlineMonitor.promise.then(() => {
                this.GetModelPromiseOnConnect(user).then(() => {
                });
            });
        }

        /*-----------------------------    Process Updates    --------------------------------------------------------*/


        /*-----------------------------    Deferred Function - ProcessQueue Call    --------------------------------------------------------*/
        private ResetDefferedProcessQueueInterval() {
            this._numberOfSequentiallyFailedUpdateRequests = 0;
            this._defferedProcessQueueIntervalCurrent = this._defferedProcessQueueIntervalDefault;
        }

        private IncreaseDefferedProcessQueueInterval() {
            if (this._numberOfSequentiallyFailedUpdateRequests >= this._numberOfSequentiallyFailedUpdateRequestsBeforeIncrease) {
                this._defferedProcessQueueIntervalCurrent = this._defferedProcessQueueIntervalDefault + (this._numberOfSequentiallyFailedUpdateRequests) * 1000;
                if (this._defferedProcessQueueIntervalCurrent > this._defferedProcessQueueIntervalMax) {
                    this._defferedProcessQueueIntervalCurrent = this._defferedProcessQueueIntervalMax;
                }
            }
        }

        CreateDefferedProcessQueueFunctionCall(immediateExec?: boolean) {
                    
            if (!this._defferedProcessQueueScheduled) {                                
                this._defferedProcessQueueScheduled = true;
                this._timeoutPromise = this.timeoutService(() => {
                    this._defferedProcessQueueScheduled = false;
                    this.ProcessQueue();
                }, immediateExec ? 100 : this._defferedProcessQueueIntervalCurrent);                
            }
        }

        /*-----------------------------    Deferred Function - ProcessQueue Call    --------------------------------------------------------*/


        /*-----------------------------    SignalR Events    --------------------------------------------------------*/
        CountSignalRHubConnected = () => {
            /* -------------- Get Count Status and check if current count is deleted -----------------------*/
            if (this.authService.GetUser() != null && this.authService.GetUser().BusinessUser != null) {
                this.countTypeService.Get(this.authService.GetUser().BusinessUser.MobileSettings.EntityId)
                    .success((countStates) => {
                        if (this._currentCountType != null) {
                            var status = _.find(countStates, (status) => { return status.CountOf === this._currentCountType; });
                            if (!status || !status.IsActive) {
                                this.countService.GetCheckIfCountApplied(this._model.Inventory.Id)
                                    .success((result: boolean): void => {
                                        if (result) {
                                            if (this._countSubmittedCallback) {
                                                this._countSubmittedCallback("");
                                            }
                                        } else {
                                            if (this._countDeletedCallback != null) {
                                                this._countDeletedCallback(null, "");
                                            }
                                        }
                                    });

                                /* -------- Count does not exist --------------------- */
                                this._model.CountUpdatesQueue = [];
                                this.PersistUpdatesQueue();
                            } else {
                                /* ------------- If application switch from disconnected - to connected ---------*/
                                /* ------------- and there are offline items ------------------------------------*/
                                if (this._isOfflineMode) {
                                    var user = this.authService.GetUser();
                                    if (user != null && user.IsAuthenticated && user.BusinessUser != null) {
                                        this.ProcessOfflineElements(user);
                                    }
                                }

                            }
                        }
                        this.SetOfflineFlag(false);
                    });
            }
        }

        CountSignalRHubDisconnected = () => {
            this.SetOfflineFlag(true);
            this.popupMessageService.SetPendingTasks(this._model.CountUpdatesQueue.length);
        }

        SetCountDeletedCallback(callback: any) {
            this._countDeletedCallback = callback;
        }

        SetCountModelHasBeenReloadedCallback(callback: any) {
            this._countModelReloadedCallback = callback;
        }

        public SetCountSubmittedCallback(callback: (submitterName: string) => void): void {
            this._countSubmittedCallback = callback;
        }


        InvokeCountModelReloadedCallback() {
            if (this._countModelReloadedCallback != null) {
                this._countModelReloadedCallback();
            }
        }

        RegisterSignaRListeners() {

            this.signalR.SetSignalREventListener(
                Core.SignalRServerMethods.ItemsOfflineUpdated
                , (updatedItemsStatuses: Api.Models.IUpdatedItemCountStatus[]) => this.SignalROfflineItemsUpdated(updatedItemsStatuses));

            this.signalR.SetSignalREventListener(
                Core.SignalRServerMethods.CountDeleted
                , (countId: number, userName: string) => this.SignalRCountDeleted(countId, userName));

            this.signalR.SetSignalREventListener(
                Core.SignalRServerMethods.CountSubmitted,
                (countId: number, submitterName: string): void => {
                    this.SignalRCountSubmitted(countId, submitterName);
                }
                );

            this.signalR.SetConnectedListener(this.CountSignalRHubConnected);
            this.signalR.SetDisconnectedListener(this.CountSignalRHubDisconnected);

            ///* ------------------   TravelPathDataUpdatedPartial ----------------------*/
            this.signalR.SetSignalREventListener(
                Core.SignalRServerMethods.TravelPathDataUpdatedPartial
                , (travelPathLocationId: number, currentEntityId: number) => this.SignalRTravelPathDataUpdatedPartial(travelPathLocationId, currentEntityId));
            ///* ------------------------------------------------------------------------*/

            /* ------------------   NewLocationReceived   -----------------------------*/
            this.signalR.SetSignalREventListener(
                Core.SignalRServerMethods.NewLocationReceived, (travelPathData: Api.Models.ITravelPath, currentEntityId: number) => this.SignalRTravelPathNewLocationReceived(travelPathData, currentEntityId));
            ///* ------------------------------------------------------------------------*/

            ///* ------------------   RenameLocation        -----------------------------*/
            this.signalR.SetSignalREventListener(
                Core.SignalRServerMethods.RenameLocation
                , (travelPathData: Api.Models.ITravelPath, currentEntityId: number) => this.SignalRTravelPathRenameLocation(travelPathData, currentEntityId));
            ///* ------------------------------------------------------------------------*/

            ///* ------------------   DeActivateLocation    -----------------------------*/
            this.signalR.SetSignalREventListener(
                Core.SignalRServerMethods.DeActivateLocation
                , (travelPathData: Api.Models.ITravelPath, currentEntityId: number) => this.SignalRTravelPathDeActivateLocation(travelPathData, currentEntityId));
            ///* ------------------------------------------------------------------------*/

            ///* ------------------   ActivateLocation      -----------------------------*/
            this.signalR.SetSignalREventListener(
                Core.SignalRServerMethods.ActivateLocation
                , (travelPathData: Api.Models.ITravelPath, currentEntityId: number) => this.SignalRTravelPathActivateLocation(travelPathData, currentEntityId));
            ///* ------------------------------------------------------------------------*/

            ///* ------------------   ResortLocation        -----------------------------*/
            this.signalR.SetSignalREventListener(
                Core.SignalRServerMethods.ResortLocation
                , (locationIds: number[], currentEntityId: number) => this.SignalRTravelPathResortLocation(locationIds, currentEntityId));
            ///* ------------------------------------------------------------------------*/
        }

        SignalRCountDeleted(countId: number, userName: string) {
            if (this._model != null && this._model.Inventory != null) {
                if (this._model.Inventory.Id == countId) {
                    if (this._countDeletedCallback != null) {
                        this._countDeletedCallback(countId, userName);
                    }
                    this.InitializeModel();
                }
            }
        }

        SignalRCountSubmitted(countId: number, submitterName: string) {
            if (this._model != null && this._model.Inventory != null) {
                if (this._model.Inventory.Id == countId) {
                    if (this._countSubmittedCallback) {
                        this._countSubmittedCallback(submitterName);
                    }
                    this.InitializeModel();
                }
            }
        }

        SignalRTravelPathRenameLocation(travelPathData, currentEntityId) {
            if (this._model != null && this._model.Inventory != null && this._model.Inventory.EntityId == currentEntityId) {
                var location = _.find(this._model.Inventory.Locations, loc => loc.Id == travelPathData.Id);
                if (location != null) {
                    location.Name = travelPathData.Location;
                }
            }
        }

        SignalRTravelPathDeActivateLocation(travelPathData, currentEntityId) {
            if (this._model != null && this._model.Inventory != null && this._model.Inventory.EntityId == currentEntityId) {

                //Only empty location can be deleted 
                //var user = this.authService.GetUser();
                //this.GetModelPromiseOnConnect(user);

            }
        }

        SignalRTravelPathActivateLocation(travelPathData, currentEntityId) {
            if (this._model != null && this._model.Inventory != null && this._model.Inventory.EntityId == currentEntityId) {
                var user = this.authService.GetUser();
                this.GetModelPromiseOnConnect(user);
            }
        }

        SignalRTravelPathDataUpdated(travelPathEntityData: Api.Models.ITravelPathEntity) {
            if (this._model != null && this._model.Inventory != null && this._model.Inventory.EntityId == travelPathEntityData.EntityId) {
                var user = this.authService.GetUser();
                this.GetModelPromiseOnConnect(user);
            }
        }

        SignalRTravelPathDataUpdatedPartial(travelPathLocationId: number, currentEntityId: number) {
            if (this._model != null && this._model.Inventory != null && this._model.Inventory.EntityId == currentEntityId) {
                var user = this.authService.GetUser();
                this.GetModelPromiseOnConnect(user);
            }
        }

        SignalRTravelPathResortLocation(locationIds: number[], currentEntityId: number) {
            if (this._model != null && this._model.Inventory != null && this._model.Inventory.EntityId == currentEntityId) {
                var user = this.authService.GetUser();
                this.GetModelPromiseOnConnect(user);
            }
        }

        SignalRTravelPathNewLocationReceived(travelPathData: Api.Models.ITravelPath, currentEntityId: number) {
            if (this._model != null && this._model.Inventory != null && this._model.Inventory.EntityId == currentEntityId) {
                if (this._model.Inventory.Locations != null) {

                    var sortOrder = (_.max(this._model.Inventory.Locations, loc => <number>loc.SortOrder)).SortOrder;

                    var newLocation: Api.Models.ICountLocation = {
                        Id: travelPathData.Id,
                        Name: travelPathData.Location,
                        SortOrder: sortOrder,
                        CountedTotal: 0,
                        UncountedTotal: 0,
                        SystemLocation: false,
                        Items: []
                    };
                    this._model.Inventory.Locations.push(newLocation);
                }
            }
        }

        SignalROfflineItemsUpdated(updatedItemsStatuses: Api.Models.IUpdatedItemCountStatus[]) {
            this.UpdateItemsStatuses(updatedItemsStatuses);
        }

        /*-----------------------------    SignalR Events    --------------------------------------------------------*/

        private GetModelPromiseOnConnect(user: Core.Auth.IUser) {
            var modelPromise = this.GetModelPromise(user.BusinessUser.MobileSettings.EntityId, this._currentCountType);
            modelPromise.then(modelresult => {
                if (this._countModelReloadedCallback != null) {
                    this._countModelReloadedCallback();
                }
            });
            return modelPromise;
        }

        GetUniqueProducts(): Api.Models.ICountItem[]{  

            //Current version of LoDash does not support _orderBy() where we can specify sortDirect
            //We cannot upgrade LoDash until we upgrade TypeScript

            if (this._currentCountView === InventoryCountView.Locations) {
                //TODO: Needs to sort by SortOrder ASC, then by LastPurchaseDate DESC
                return _.uniq(_.sortBy(this.Flatten(), item => item.SortOrder), item=> "" + item.ItemId + ',' + item.VendorItemId);
            }
            else if (this._currentCountView === InventoryCountView.Groups) {
                //TODO: Needs to sort by ItemCode ASC, then by LastPurchaseDate DESC
                return _.uniq(_.sortBy(this.Flatten(), item => item.ProductCode.toUpperCase()), item=> "" + item.ItemId + ',' + item.VendorItemId);
            }
            else {
                return _.uniq(_.sortBy(this.Flatten(), item => item.Description.toUpperCase() + item.ProductCode.toUpperCase()), item=> "" + item.ItemId + ',' + item.VendorItemId);
            }
        }

        GetItemGroups(): ICountItemGroup[]{            
            var result = [];
            var items = this.Flatten();

            //Current version of LoDash does not support _orderBy() where we can specify sortDirect
            //We cannot upgrade LoDash until we upgrade TypeScript
            //TODO: Needs to sort by ProductCode, then by LastPurchaseDate DESC
            var groups = _.uniq(_.flatten(items, "StocktakeGroup"));
            _.forEach(groups,
                group => {
                    result.push({
                        GroupName: group,
                        CountItems: _.sortBy(_.filter(items, item => { return item.StocktakeGroup === group }), item => item.ProductCode)
                    });
                });
            return result;
        }

        UpdateDefaultCountView = (view: InventoryCountView) => {            
            if ((!this._initialLoad) && (this._currentCountView !== view)) {
                this._currentCountView = view;
                this.userSettingService
                    .SetUserSetting(Administration.User.Api.Models.UserSettingEnum.InventoryCountViewPreference, view.toString());
            }
        }
        SetLoadingFlag = (value: boolean) => {
            this._initialLoad = value;
        }

        GetSameItems(itemId: number, vendorItemId: number): Api.Models.ICountItem[] {
            return _.filter(this.Flatten(), item => { return item.ItemId === itemId && item.VendorItemId === vendorItemId; });
        }
        private Flatten(): Api.Models.ICountItem[] {
            return <Api.Models.ICountItem[]>_.flatten(this._model.Inventory.Locations, "Items");
        }

        HasCountedItems(): boolean {
            return _.any(this.Flatten(), i=> i.ReadyToApply);
        }

        GetItemsToCount(): number {
            var allItems = this.Flatten();
            return _.where(allItems, i=> !i.ReadyToApply).length;
        }

        HasNoCostItems(): boolean {
            var allItems = this.Flatten();
            var anyZeroCostItems = _.some(allItems, (item) => { return this.HasNoCost(item) && this.HasCount(item); });
            return anyZeroCostItems;
        }

        HasNoCost(item: Api.Models.ICountItem): boolean {
            return !item.ZeroCostItem && (item.ItemCost === 0 || item.ItemCost === null);
        }

        HasCount(item: Api.Models.ICountItem): boolean {
            var hasCount = (
                (item.InnerCount != null && item.InnerCount >= 0) ||
                (item.OuterCount != null && item.OuterCount >= 0) ||
                (item.InventoryCount != null && item.InventoryCount >= 0) ||
                (item.WeightCount != null && item.WeightCount >= 0));
            return hasCount;
        }

        GetNoCostValues() {
            var allItems = this.Flatten();
            var zeroCostCountedItems = _.filter(allItems, (item) => { return this.HasNoCost(item) && this.HasCount(item); });
            var uniqZeroCostItems = _.uniq(zeroCostCountedItems, (item) => item.ItemId);
            var sortedUniqZeroCostItems = _.sortBy(uniqZeroCostItems, (item) => item.Description);
            angular.forEach(sortedUniqZeroCostItems, (item) => { item.ItemCost = null; });
            return <Api.Models.ICountItem[]>sortedUniqZeroCostItems;
        }

        GetModelCallback(result: ng.IHttpPromiseCallbackArg<Api.Models.IInventoryCount>, modelLoadedCallback?: any) {
            _.assign(<any>this._model.Inventory, result.data);

            this.UpdateOriginalCounts();
            this.ExamineAndSetItemStatusesOnLoad();
            this.ModelReceived.Fire(null);

            if (modelLoadedCallback != null) {
                modelLoadedCallback();
            }
        }

        GetModel(entityId: number, countType: Api.Models.CountType, modelLoadedCallback?: any): ICountModel {
            this._currentCountType = countType;
            this.countService.Get(countType, entityId, -1).then(result=> this.GetModelCallback(result, modelLoadedCallback));
            return this._model;
        }

        GetCurrentModel(): ICountModel {            
            return this._model;
        }

        GetModelPromise(entityId: number, countType: Api.Models.CountType): ng.IHttpPromise<Count.Api.Models.IInventoryCount> {

            if (this._emptyModelReceivedTimeoutPromise != null) {
                this.timeoutService.cancel(this._emptyModelReceivedTimeoutPromise);
            }
            if (this._currentCountType != countType) {
                this._emptyCountReceivedNumberOfRepeatCalls = 0;
            }
            this._currentCountType = countType;
            var promise = this.countService.Get(countType, entityId, -1);
            promise.then((result) => {

                //DIRTY READ issue, in case if empty model received - workaround
                //TODO: Consider returning deffered promise instead
                //JIRA #MX-8876
                if (result.data == null || result.data.Locations == null || result.data.Locations.length == 0) {
                    if (this._emptyCountReceivedNumberOfRepeatCalls < this._modelRetrievalAttempts) {
                        this._emptyModelReceivedTimeoutPromise = this.timeoutService(() => { this.GetModelPromise(entityId, countType); }
                            , this._modelRetrievalInterval);
                    }
                    this._emptyCountReceivedNumberOfRepeatCalls++;
                } else {
                    this._emptyCountReceivedNumberOfRepeatCalls = 0;
                    this.GetModelCallback(result);
                }
            });

            if (this._emptyCountReceivedNumberOfRepeatCalls > this._modelRetrievalAttempts) {
                this._emptyCountReceivedNumberOfRepeatCalls = 0;
            }

            return promise;
        }

        Delete(countType: Api.Models.CountType, countId: number) {
            var hubConnection = this.signalR.GetConnectionId();
            return this.countService.Delete(countType, countId, this._model.Inventory.EntityId, hubConnection);
        }

        UpdateItemCostInAllLocations(itemId: number, cost: number) {
            var noCostItems = _.filter(this.Flatten(), (item) => { return item.ItemId == itemId; });
            _.forEach(noCostItems, item=> { item.ItemCost = cost; });
        }

        SearchAllEntityItemsAndVendorEntityItems(entityId: number, countId: number, locationId: number, itemTypeId: number, search: string){
            return this.countService.GetEntityItemsAndVendorEntityItemsNotInCurrentCount(entityId, countId, locationId, itemTypeId, search);
        }

        GetTranslatedCountType(countType: Count.Api.Models.CountType, l10N: Api.Models.IL10N): string {
            var type = '';

            switch (countType) {
                case Count.Api.Models.CountType.Daily:
                    type = ' ' + l10N.Daily;
                    break;
                case Count.Api.Models.CountType.Weekly:
                    type = ' ' + l10N.Weekly;
                    break;
                case Count.Api.Models.CountType.Monthly:
                    type = ' ' + l10N.Monthly;
                    break;
                case Count.Api.Models.CountType.Periodic:
                    type = ' ' + l10N.Periodic;
                    break;
                case Count.Api.Models.CountType.Spot:
                    type = ' ' + l10N.Spot;
                    break;
            }
            return type;
        }

        GetTranslatedCountStatus(countStatus: Count.Api.Models.CountStatus): string {
            var key = Api.Models.CountStatus[countStatus];
            return this._translations ? this._translations[key] : key;
        }

        GetCountType(typeName: string): Count.Api.Models.CountType {
            var name = typeName.toLowerCase();
            var countType: Count.Api.Models.CountType;
            for (var e in Api.Models.CountType) {
                // TODO
                // Review logic and use of isNaN
                if (!isNaN(<any>e) && Api.Models.CountType[e].toLowerCase() === name) {
                    countType = <Api.Models.CountType>Number(e);
                    break;
                }
            }
            return countType;
        }


        GetCssStatusClass(item: Api.Models.ICountItem): string {

            if (item.Status == Api.Models.CountStatus.Variance) {
                return "fa fa-check-square-o mx-col-warning";
            }
            if (item.Status == Api.Models.CountStatus.Pending) {
                return "fa fa-spinner mx-col-warning";
            }
            if (item.Status == Api.Models.CountStatus.Counted) {
                return "fa fa-check-square-o mx-col-success";
            }
            if (item.Status == Api.Models.CountStatus.Partial) {
                return "fa fa-ellipsis-h mx-col-primary";
            }
            return "fa fa-square-o mx-color-graymiddark";
        }

        GetCssStatusColor(item: Api.Models.ICountItem): string {

            if (item.Status == Api.Models.CountStatus.Variance) {
                return this._outOfToleranceCountColor;
            }
            if (item.Status == Api.Models.CountStatus.Pending) {
                return this._pendingCountColor;
            }
            if (item.Status == Api.Models.CountStatus.Counted) {
                return this._countedCountColor;
            }
            if (item.Status == Api.Models.CountStatus.Partial) {
                return this._pendingCountColor;
            }
            return this._pendingCountColor;
        }

        GetCssItemStatusClass(status: Api.Models.CountStatus): string {

            if (status == Api.Models.CountStatus.Variance) {
                return "badge-warning";
            }
            if (status == Api.Models.CountStatus.Counted) {
                return "badge-success";
            }
            return "";
        }

        GetCssItemStatusColor(status: Api.Models.CountStatus): string {

            if (status == Api.Models.CountStatus.Variance) {
                return "badge-warning";
            }
            if (status == Api.Models.CountStatus.Counted) {
                return "badge-success";
            }
            return "";
        }

        GetCssLocationStatusColor(status: Api.Models.CountStatus): string {

            if (status == Api.Models.CountStatus.Variance) {
                return this._outOfToleranceCountColor;
            }
            if (status == Api.Models.CountStatus.Counted) {
                return this._countedCountColor;
            }
            if (status == Api.Models.CountStatus.Partial) {
                return this._pendingCountColor;
            }
            return this._pendingCountColor;
        }

        IsBusy(): boolean {
            return (this._model.CountUpdatesQueue.length != 0);
        }

        IsApplyDateReadOnly(): boolean {
            return (this._model.Inventory.IsApplyDateReadOnly);
        }

        GetLocalStoreDateTime(): string {
            return (this._model.Inventory.LocalStoreDateTime);
        }

        AddItemsToCurrentCount(entityId: number, countId: number, locationId: number, items: Api.Models.ICountItem[]): void {
            this.countService.PostUpdateCountWithCountItems(this.authService.GetUser().BusinessUser.MobileSettings.EntityId, countId, locationId, items, this._currentCountType)
                .success((result: boolean): void => {

                    //Call GetModel to refresh the currently selected item group items and counts.
                    this.GetModel(entityId, this._currentCountType, () => {
                        this.InvokeCountModelReloadedCallback();
                    });

                });
        }

    }

    export var $countService: Core.NG.INamedService<ICountService> = Core.NG.InventoryCountModule.RegisterService("Count"
        , CountService
        , Core.$translation
        , Core.Auth.$authService
        , Api.$countService
        , Core.$signalR
        , Core.LocalStorage.$localStorageSvc
        , Core.NG.$rootScope
        , Api.$countTypeService
        , Core.NG.$http
        , Core.NG.$timeout
        , Core.$popupMessageService
        , Core.NG.$q
        , Inventory.Count.Api.$updateCostService
        , ICApi.$inventoryCountSettingsService
        , Administration.User.Services.$userSettingService
        );
}
