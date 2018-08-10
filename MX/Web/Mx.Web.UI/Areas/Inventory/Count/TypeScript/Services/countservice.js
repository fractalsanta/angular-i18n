var Inventory;
(function (Inventory) {
    var Count;
    (function (Count) {
        "use strict";
        var ICApi = Administration.Settings.Api;
        (function (CountField) {
            CountField[CountField["Outer"] = 0] = "Outer";
            CountField[CountField["Inner"] = 1] = "Inner";
            CountField[CountField["Inventory"] = 2] = "Inventory";
            CountField[CountField["Weight"] = 3] = "Weight";
        })(Count.CountField || (Count.CountField = {}));
        var CountField = Count.CountField;
        (function (InventoryCountView) {
            InventoryCountView[InventoryCountView["NotSet"] = ""] = "NotSet";
            InventoryCountView[InventoryCountView["Items"] = "InventoryCount.Items"] = "Items";
            InventoryCountView[InventoryCountView["Locations"] = "InventoryCount.Locations"] = "Locations";
            InventoryCountView[InventoryCountView["Groups"] = "InventoryCount.Groups"] = "Groups";
        })(Count.InventoryCountView || (Count.InventoryCountView = {}));
        var InventoryCountView = Count.InventoryCountView;
        var CountService = (function () {
            function CountService(translationService, authService, countService, signalR, localstorage, rootScope, countTypeService, $http, timeoutService, popupMessageService, $q, updateCostApiService, inventoryCountSettingsService, userSettingService) {
                var _this = this;
                this.translationService = translationService;
                this.authService = authService;
                this.countService = countService;
                this.signalR = signalR;
                this.localstorage = localstorage;
                this.rootScope = rootScope;
                this.countTypeService = countTypeService;
                this.$http = $http;
                this.timeoutService = timeoutService;
                this.popupMessageService = popupMessageService;
                this.$q = $q;
                this.updateCostApiService = updateCostApiService;
                this.inventoryCountSettingsService = inventoryCountSettingsService;
                this.userSettingService = userSettingService;
                this._emptyCountReceivedNumberOfRepeatCalls = 0;
                this._modelRetrievalAttempts = 5;
                this._modelRetrievalInterval = 3000;
                this._updateRequestNumberOfElements = 30;
                this._updateRequestNumberOfElementsDefault = 30;
                this._updateRequestNumberOfElementsAfterFailure = 5;
                this._numberOfSequentiallyFailedUpdateRequests = 0;
                this._numberOfSequentiallyFailedUpdateRequestsBeforeIncrease = 3;
                this._defferedProcessQueueIntervalDefault = 3000;
                this._defferedProcessQueueIntervalCurrent = 3000;
                this._defferedProcessQueueIntervalMax = 60000;
                this._defferedProcessQueueScheduled = false;
                this._pendingCountColor = "";
                this._outOfToleranceCountColor = "";
                this._countedCountColor = "";
                this._currentCountView = InventoryCountView.NotSet;
                this._initialLoad = false;
                this.CountSignalRHubConnected = function () {
                    if (_this.authService.GetUser() != null && _this.authService.GetUser().BusinessUser != null) {
                        _this.countTypeService.Get(_this.authService.GetUser().BusinessUser.MobileSettings.EntityId)
                            .success(function (countStates) {
                            if (_this._currentCountType != null) {
                                var status = _.find(countStates, function (status) { return status.CountOf === _this._currentCountType; });
                                if (!status || !status.IsActive) {
                                    _this.countService.GetCheckIfCountApplied(_this._model.Inventory.Id)
                                        .success(function (result) {
                                        if (result) {
                                            if (_this._countSubmittedCallback) {
                                                _this._countSubmittedCallback("");
                                            }
                                        }
                                        else {
                                            if (_this._countDeletedCallback != null) {
                                                _this._countDeletedCallback(null, "");
                                            }
                                        }
                                    });
                                    _this._model.CountUpdatesQueue = [];
                                    _this.PersistUpdatesQueue();
                                }
                                else {
                                    if (_this._isOfflineMode) {
                                        var user = _this.authService.GetUser();
                                        if (user != null && user.IsAuthenticated && user.BusinessUser != null) {
                                            _this.ProcessOfflineElements(user);
                                        }
                                    }
                                }
                            }
                            _this.SetOfflineFlag(false);
                        });
                    }
                };
                this.CountSignalRHubDisconnected = function () {
                    _this.SetOfflineFlag(true);
                    _this.popupMessageService.SetPendingTasks(_this._model.CountUpdatesQueue.length);
                };
                this.UpdateDefaultCountView = function (view) {
                    if ((!_this._initialLoad) && (_this._currentCountView !== view)) {
                        _this._currentCountView = view;
                        _this.userSettingService
                            .SetUserSetting(Administration.User.Api.Models.UserSettingEnum.InventoryCountViewPreference, view.toString());
                    }
                };
                this.SetLoadingFlag = function (value) {
                    _this._initialLoad = value;
                };
                rootScope.$on(Core.ApplicationEvent.ChangeStore, function () {
                    _this.InitializeModel();
                });
                this.ModelReceived = new Core.Events.Event();
                this._offlineMonitor = null;
                this.SetOfflineFlag(false);
                this._offlineDataLocalStorageName = "countOfflineItems";
                this.InitializeModel();
                this.RegisterSignaRListeners();
                this.CheckPersistedCountUpdates();
            }
            CountService.prototype.UpdateNoCostItems = function (items) {
                var _this = this;
                var promise = {};
                if (items != null && items.length > 0) {
                    _.forEach(items, function (item) { return _this.UpdateItemCostInAllLocations(item.ItemId, item.InventoryUnitCost); });
                }
                var user = this.authService.GetUser();
                if (user != null && user.BusinessUser != null && user.BusinessUser.MobileSettings != null) {
                    var entityId = user.BusinessUser.MobileSettings.EntityId;
                    promise = this.updateCostApiService.PostUpdateCost(items, entityId);
                }
                return promise;
            };
            CountService.prototype.SetOfflineFlag = function (offline) {
                this._isOfflineMode = offline;
                this.popupMessageService.SetOfflineFlag(this._isOfflineMode);
            };
            CountService.prototype.InitializeModel = function () {
                var _this = this;
                var user = this.authService.GetUser();
                this.ResetDefferedProcessQueueInterval();
                this._updateRequestNumberOfElements = this._updateRequestNumberOfElementsDefault;
                this._defferedProcessQueueScheduled = false;
                this._model = {
                    Inventory: { Locations: [] },
                    CountUpdatesQueue: [],
                    PersistedCountUpdate: {
                        UserId: user != null ? user.BusinessUser.Id : 0,
                        DataDate: moment().format("DD.MM.YYYY").toString(),
                        PersistedCountUpdates: []
                    }
                };
                this._currentCountType = null;
                this.translationService.GetTranslations().then(function (result) {
                    _this._translations = result.InventoryCount;
                });
                this.inventoryCountSettingsService.GetInventoryCountSettings().success(function (results) {
                    _this._pendingCountColor = results.PendingColor;
                    _this._outOfToleranceCountColor = results.OutOfToleranceColor;
                    _this._countedCountColor = results.CountedColor;
                });
            };
            CountService.prototype.ResetCurrentCount = function () {
                this._model.Inventory.Locations = [];
                this.ResetDefferedProcessQueueInterval();
                this._defferedProcessQueueScheduled = false;
            };
            CountService.prototype.IsOfflineMode = function () {
                return this._isOfflineMode;
            };
            CountService.prototype.PushUpdate = function (item, countFieldType) {
                if (this.ItemCountHasChanged(item, countFieldType)) {
                    var countUpdateRequest = this.PrepareUpdateRequest(item, countFieldType);
                    this._model.CountUpdatesQueue.push(countUpdateRequest);
                    this.PersistUpdatesQueue();
                    this.popupMessageService.SetPendingTasks(this._model.CountUpdatesQueue.length);
                    item.Status = Count.Api.Models.CountStatus.Pending;
                    this.CreateDefferedProcessQueueFunctionCall(true);
                    this.UpdateOriginalCount(item, countFieldType);
                }
            };
            CountService.prototype.PrepareUpdateRequest = function (item, countFieldType) {
                var countUpdateRequest = this.CreateICountUpdateRequest(item, countFieldType);
                if (countUpdateRequest != null && !countUpdateRequest.Amount && countUpdateRequest.Amount !== 0) {
                    countUpdateRequest.Amount = 0;
                    countUpdateRequest.ToClear = true;
                    if (!item.OuterCount && !item.InnerCount && !item.InventoryCount && !item.WeightCount) {
                        countUpdateRequest.ReadyToApply = false;
                        countUpdateRequest.CheckVariance = false;
                    }
                }
                return countUpdateRequest;
            };
            CountService.prototype.CreateICountUpdateRequest = function (item, countFieldType) {
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
            };
            CountService.prototype.CreateICountUpdateRequestObject = function (item, amount, unitType, countId) {
                var updaterequest = {
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
            };
            CountService.prototype.SeekVariance = function (detailId, itemId) {
                var check = function (item) { return item.ItemId == itemId && item.Id != detailId
                    && !item.ReadyToApply
                    && item.Status !== Count.Api.Models.CountStatus.Pending; };
                var allItems = this.Flatten();
                return !_.some(allItems, check);
            };
            CountService.prototype.PersistUpdatesQueue = function () {
                this._model.PersistedCountUpdate.PersistedCountUpdates = this._model.CountUpdatesQueue;
                this.localstorage.Add(this._offlineDataLocalStorageName, this._model.PersistedCountUpdate);
            };
            CountService.prototype.CheckPersistedCountUpdates = function () {
                if (this.localstorage.Get(this._offlineDataLocalStorageName) != null) {
                    var user = this.authService.GetUser();
                    var offline = this.localstorage.Get(this._offlineDataLocalStorageName);
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
            };
            CountService.prototype.ProcessQueue = function () {
                var _this = this;
                var user = this.authService.GetUser();
                var hubConnection = this.signalR.GetConnectionId() == null ? "" : this.signalR.GetConnectionId();
                var resolveMonitor = function () {
                    if (_this._offlineMonitor != null && _this._model.CountUpdatesQueue.length == 0) {
                        _this._offlineMonitor.resolve();
                    }
                };
                resolveMonitor();
                if (this.IsOfflineMode() || this.$http.pendingRequests.length > 0) {
                    this.CreateDefferedProcessQueueFunctionCall();
                }
                else {
                    if (this._model.CountUpdatesQueue.length > 0) {
                        var countItemsToBeUpdated = this._model.CountUpdatesQueue.slice(0, this._updateRequestNumberOfElements);
                        var countId = countItemsToBeUpdated[0].CountId;
                        this.SendUpdateRequest(countId, countItemsToBeUpdated, user.BusinessUser.MobileSettings.EntityId, hubConnection, resolveMonitor);
                    }
                }
            };
            CountService.prototype.SendUpdateRequest = function (countId, countItemsToBeUpdated, entityId, hubConnection, resolveMonitor) {
                var _this = this;
                var promise = this.countService.PutCount(countItemsToBeUpdated, entityId, hubConnection);
                promise.then(function (result) {
                    _this.UpdateItemsStatuses(result.data);
                    var countUpdatedItems = _.map(result.data, function (item) {
                        return {
                            CountId: item.CountUpdate.CountId,
                            CountDetailId: item.CountUpdate.CountDetailId,
                            UnitType: item.CountUpdate.UnitType
                        };
                    });
                    _this._updateRequestNumberOfElements = _this._updateRequestNumberOfElementsDefault;
                    _this.ResetDefferedProcessQueueInterval();
                    _this.HandleQueueProcessedItems(countUpdatedItems);
                    resolveMonitor();
                }, function (result) {
                    if (result.status != Core.HttpStatus.InternalServerError) {
                        _this.popupMessageService.ClearMessages();
                    }
                    if (result.status == Core.HttpStatus.Conflict) {
                        var countFailedItems = _.map(countItemsToBeUpdated, function (item) {
                            return {
                                CountId: item.CountId,
                                CountDetailId: item.CountDetailId,
                                UnitType: item.UnitType
                            };
                        });
                        _this.HandleQueueProcessedItems(countFailedItems);
                        _this.SignalRCountDeleted(countId, "");
                    }
                    if (result.status != Core.HttpStatus.Conflict) {
                        _this._numberOfSequentiallyFailedUpdateRequests++;
                        _this._updateRequestNumberOfElements = _this._updateRequestNumberOfElementsAfterFailure;
                        _this.IncreaseDefferedProcessQueueInterval();
                        _this.CreateDefferedProcessQueueFunctionCall();
                    }
                });
            };
            CountService.prototype.HandleQueueProcessedItems = function (countUpdatedItems) {
                var _this = this;
                _.forEach(countUpdatedItems, function (updateItem) {
                    var queueItem = _.find(_this._model.CountUpdatesQueue, function (item) { return item.CountDetailId == updateItem.CountDetailId && item.UnitType == updateItem.UnitType; });
                    if (queueItem != null) {
                        queueItem.IsProcessed = true;
                    }
                });
                _.remove(this._model.CountUpdatesQueue, function (item) { return item.IsProcessed; });
                this.PersistUpdatesQueue();
                this.popupMessageService.SetPendingTasks(this._model.CountUpdatesQueue.length);
                if (this._model.CountUpdatesQueue.length > 0) {
                    this.CreateDefferedProcessQueueFunctionCall(true);
                }
            };
            CountService.prototype.UpdateItemsStatuses = function (updatedItemsStatuses) {
                var _this = this;
                _.forEach(updatedItemsStatuses, function (item) {
                    var update = item.CountUpdate;
                    _this.UpdateItemStatus(update.CountId, update.LocationId, update.ItemId, update.UnitType, update.Amount, item.CountStatus, update.ReadyToApply, update.CountDetailId, update.VariancePercent);
                });
            };
            CountService.prototype.UpdateItemStatus = function (countId, locationId, itemId, unitType, amount, status, readyToApply, itemDetailId, variancePercent) {
                if (countId != this._model.Inventory.Id) {
                    return null;
                }
                var location = _.find(this._model.Inventory.Locations, function (l) { return l.Id == locationId; });
                if (location != null) {
                    var item = _.find(location.Items, function (i) { return i.Id == itemDetailId; });
                    if (item != null) {
                        if (status == Count.Api.Models.CountStatus.NotCounted) {
                            amount = null;
                        }
                        var countType = CountField.Inner;
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
                        var hasVariance = (status == Count.Api.Models.CountStatus.Variance);
                        if (status != Count.Api.Models.CountStatus.Pending) {
                            this.CheckAndUpdateItemsStatuses(item, hasVariance);
                        }
                        this.UpdateOriginalCount(item, countType);
                        return item;
                    }
                }
                return null;
            };
            CountService.prototype.CheckAndUpdateItemsStatuses = function (item, hasVariance) {
                var allItems = _.where(this.Flatten(), function (x) { return x.ItemId == item.ItemId; });
                var matchingItemIdItems = _.where(allItems, function (i) { return i.Id != item.Id; });
                var uncountedItems = _.some(allItems, function (i) { return !i.ReadyToApply; });
                var countedItems = _.some(allItems, function (i) { return i.ReadyToApply; });
                if (matchingItemIdItems.length) {
                    if (uncountedItems) {
                        item.Status = countedItems ? Count.Api.Models.CountStatus.Partial : Count.Api.Models.CountStatus.NotCounted;
                        item.HasVariance = hasVariance;
                        _.forEach(matchingItemIdItems, function (otherItem) {
                            if (otherItem.Status != Count.Api.Models.CountStatus.Pending) {
                                otherItem.Status = item.Status;
                            }
                            otherItem.HasVariance = false;
                        });
                    }
                    else {
                        item.Status = hasVariance ? Count.Api.Models.CountStatus.Variance : Count.Api.Models.CountStatus.Counted;
                        item.HasVariance = hasVariance;
                        _.forEach(matchingItemIdItems, function (otherItem) {
                            otherItem.Status = item.Status;
                            otherItem.HasVariance = hasVariance;
                        });
                    }
                }
                else {
                    item.HasVariance = hasVariance;
                    if (item.ReadyToApply) {
                        item.Status = hasVariance ? Count.Api.Models.CountStatus.Variance : Count.Api.Models.CountStatus.Counted;
                    }
                    else {
                        item.Status = Count.Api.Models.CountStatus.NotCounted;
                    }
                }
            };
            CountService.prototype.ExamineAndSetItemStatusesOnLoad = function () {
                var _this = this;
                var allCountedItems = _.where(this.Flatten(), function (item) { return item.ReadyToApply; });
                _.forEach(allCountedItems, function (item) { return _this.CheckAndUpdateItemsStatuses(item, item.HasVariance); });
            };
            CountService.prototype.UpdateOriginalCounts = function () {
                var _this = this;
                var allItems = this.Flatten();
                _.forEach(allItems, function (item) { return _this.UpdateOriginalCount(item, null); });
            };
            CountService.prototype.UpdateOriginalCount = function (item, countType) {
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
            };
            CountService.prototype.ItemCountHasChanged = function (item, countType) {
                var itemWithOriginalCount = item;
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
            };
            CountService.prototype.ProcessOfflineElements = function (user) {
                var _this = this;
                this._offlineMonitor = this.$q.defer();
                this.CreateDefferedProcessQueueFunctionCall(true);
                this._offlineMonitor.promise.then(function () {
                    _this.GetModelPromiseOnConnect(user).then(function () {
                    });
                });
            };
            CountService.prototype.ResetDefferedProcessQueueInterval = function () {
                this._numberOfSequentiallyFailedUpdateRequests = 0;
                this._defferedProcessQueueIntervalCurrent = this._defferedProcessQueueIntervalDefault;
            };
            CountService.prototype.IncreaseDefferedProcessQueueInterval = function () {
                if (this._numberOfSequentiallyFailedUpdateRequests >= this._numberOfSequentiallyFailedUpdateRequestsBeforeIncrease) {
                    this._defferedProcessQueueIntervalCurrent = this._defferedProcessQueueIntervalDefault + (this._numberOfSequentiallyFailedUpdateRequests) * 1000;
                    if (this._defferedProcessQueueIntervalCurrent > this._defferedProcessQueueIntervalMax) {
                        this._defferedProcessQueueIntervalCurrent = this._defferedProcessQueueIntervalMax;
                    }
                }
            };
            CountService.prototype.CreateDefferedProcessQueueFunctionCall = function (immediateExec) {
                var _this = this;
                if (!this._defferedProcessQueueScheduled) {
                    this._defferedProcessQueueScheduled = true;
                    this._timeoutPromise = this.timeoutService(function () {
                        _this._defferedProcessQueueScheduled = false;
                        _this.ProcessQueue();
                    }, immediateExec ? 100 : this._defferedProcessQueueIntervalCurrent);
                }
            };
            CountService.prototype.SetCountDeletedCallback = function (callback) {
                this._countDeletedCallback = callback;
            };
            CountService.prototype.SetCountModelHasBeenReloadedCallback = function (callback) {
                this._countModelReloadedCallback = callback;
            };
            CountService.prototype.SetCountSubmittedCallback = function (callback) {
                this._countSubmittedCallback = callback;
            };
            CountService.prototype.InvokeCountModelReloadedCallback = function () {
                if (this._countModelReloadedCallback != null) {
                    this._countModelReloadedCallback();
                }
            };
            CountService.prototype.RegisterSignaRListeners = function () {
                var _this = this;
                this.signalR.SetSignalREventListener(Core.SignalRServerMethods.ItemsOfflineUpdated, function (updatedItemsStatuses) { return _this.SignalROfflineItemsUpdated(updatedItemsStatuses); });
                this.signalR.SetSignalREventListener(Core.SignalRServerMethods.CountDeleted, function (countId, userName) { return _this.SignalRCountDeleted(countId, userName); });
                this.signalR.SetSignalREventListener(Core.SignalRServerMethods.CountSubmitted, function (countId, submitterName) {
                    _this.SignalRCountSubmitted(countId, submitterName);
                });
                this.signalR.SetConnectedListener(this.CountSignalRHubConnected);
                this.signalR.SetDisconnectedListener(this.CountSignalRHubDisconnected);
                this.signalR.SetSignalREventListener(Core.SignalRServerMethods.TravelPathDataUpdatedPartial, function (travelPathLocationId, currentEntityId) { return _this.SignalRTravelPathDataUpdatedPartial(travelPathLocationId, currentEntityId); });
                this.signalR.SetSignalREventListener(Core.SignalRServerMethods.NewLocationReceived, function (travelPathData, currentEntityId) { return _this.SignalRTravelPathNewLocationReceived(travelPathData, currentEntityId); });
                this.signalR.SetSignalREventListener(Core.SignalRServerMethods.RenameLocation, function (travelPathData, currentEntityId) { return _this.SignalRTravelPathRenameLocation(travelPathData, currentEntityId); });
                this.signalR.SetSignalREventListener(Core.SignalRServerMethods.DeActivateLocation, function (travelPathData, currentEntityId) { return _this.SignalRTravelPathDeActivateLocation(travelPathData, currentEntityId); });
                this.signalR.SetSignalREventListener(Core.SignalRServerMethods.ActivateLocation, function (travelPathData, currentEntityId) { return _this.SignalRTravelPathActivateLocation(travelPathData, currentEntityId); });
                this.signalR.SetSignalREventListener(Core.SignalRServerMethods.ResortLocation, function (locationIds, currentEntityId) { return _this.SignalRTravelPathResortLocation(locationIds, currentEntityId); });
            };
            CountService.prototype.SignalRCountDeleted = function (countId, userName) {
                if (this._model != null && this._model.Inventory != null) {
                    if (this._model.Inventory.Id == countId) {
                        if (this._countDeletedCallback != null) {
                            this._countDeletedCallback(countId, userName);
                        }
                        this.InitializeModel();
                    }
                }
            };
            CountService.prototype.SignalRCountSubmitted = function (countId, submitterName) {
                if (this._model != null && this._model.Inventory != null) {
                    if (this._model.Inventory.Id == countId) {
                        if (this._countSubmittedCallback) {
                            this._countSubmittedCallback(submitterName);
                        }
                        this.InitializeModel();
                    }
                }
            };
            CountService.prototype.SignalRTravelPathRenameLocation = function (travelPathData, currentEntityId) {
                if (this._model != null && this._model.Inventory != null && this._model.Inventory.EntityId == currentEntityId) {
                    var location = _.find(this._model.Inventory.Locations, function (loc) { return loc.Id == travelPathData.Id; });
                    if (location != null) {
                        location.Name = travelPathData.Location;
                    }
                }
            };
            CountService.prototype.SignalRTravelPathDeActivateLocation = function (travelPathData, currentEntityId) {
                if (this._model != null && this._model.Inventory != null && this._model.Inventory.EntityId == currentEntityId) {
                }
            };
            CountService.prototype.SignalRTravelPathActivateLocation = function (travelPathData, currentEntityId) {
                if (this._model != null && this._model.Inventory != null && this._model.Inventory.EntityId == currentEntityId) {
                    var user = this.authService.GetUser();
                    this.GetModelPromiseOnConnect(user);
                }
            };
            CountService.prototype.SignalRTravelPathDataUpdated = function (travelPathEntityData) {
                if (this._model != null && this._model.Inventory != null && this._model.Inventory.EntityId == travelPathEntityData.EntityId) {
                    var user = this.authService.GetUser();
                    this.GetModelPromiseOnConnect(user);
                }
            };
            CountService.prototype.SignalRTravelPathDataUpdatedPartial = function (travelPathLocationId, currentEntityId) {
                if (this._model != null && this._model.Inventory != null && this._model.Inventory.EntityId == currentEntityId) {
                    var user = this.authService.GetUser();
                    this.GetModelPromiseOnConnect(user);
                }
            };
            CountService.prototype.SignalRTravelPathResortLocation = function (locationIds, currentEntityId) {
                if (this._model != null && this._model.Inventory != null && this._model.Inventory.EntityId == currentEntityId) {
                    var user = this.authService.GetUser();
                    this.GetModelPromiseOnConnect(user);
                }
            };
            CountService.prototype.SignalRTravelPathNewLocationReceived = function (travelPathData, currentEntityId) {
                if (this._model != null && this._model.Inventory != null && this._model.Inventory.EntityId == currentEntityId) {
                    if (this._model.Inventory.Locations != null) {
                        var sortOrder = (_.max(this._model.Inventory.Locations, function (loc) { return loc.SortOrder; })).SortOrder;
                        var newLocation = {
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
            };
            CountService.prototype.SignalROfflineItemsUpdated = function (updatedItemsStatuses) {
                this.UpdateItemsStatuses(updatedItemsStatuses);
            };
            CountService.prototype.GetModelPromiseOnConnect = function (user) {
                var _this = this;
                var modelPromise = this.GetModelPromise(user.BusinessUser.MobileSettings.EntityId, this._currentCountType);
                modelPromise.then(function (modelresult) {
                    if (_this._countModelReloadedCallback != null) {
                        _this._countModelReloadedCallback();
                    }
                });
                return modelPromise;
            };
            CountService.prototype.GetUniqueProducts = function () {
                if (this._currentCountView === InventoryCountView.Locations) {
                    return _.uniq(_.sortBy(this.Flatten(), function (item) { return item.SortOrder; }), function (item) { return "" + item.ItemId + ',' + item.VendorItemId; });
                }
                else if (this._currentCountView === InventoryCountView.Groups) {
                    return _.uniq(_.sortBy(this.Flatten(), function (item) { return item.ProductCode.toUpperCase(); }), function (item) { return "" + item.ItemId + ',' + item.VendorItemId; });
                }
                else {
                    return _.uniq(_.sortBy(this.Flatten(), function (item) { return item.Description.toUpperCase() + item.ProductCode.toUpperCase(); }), function (item) { return "" + item.ItemId + ',' + item.VendorItemId; });
                }
            };
            CountService.prototype.GetItemGroups = function () {
                var result = [];
                var items = this.Flatten();
                var groups = _.uniq(_.flatten(items, "StocktakeGroup"));
                _.forEach(groups, function (group) {
                    result.push({
                        GroupName: group,
                        CountItems: _.sortBy(_.filter(items, function (item) { return item.StocktakeGroup === group; }), function (item) { return item.ProductCode; })
                    });
                });
                return result;
            };
            CountService.prototype.GetSameItems = function (itemId, vendorItemId) {
                return _.filter(this.Flatten(), function (item) { return item.ItemId === itemId && item.VendorItemId === vendorItemId; });
            };
            CountService.prototype.Flatten = function () {
                return _.flatten(this._model.Inventory.Locations, "Items");
            };
            CountService.prototype.HasCountedItems = function () {
                return _.any(this.Flatten(), function (i) { return i.ReadyToApply; });
            };
            CountService.prototype.GetItemsToCount = function () {
                var allItems = this.Flatten();
                return _.where(allItems, function (i) { return !i.ReadyToApply; }).length;
            };
            CountService.prototype.HasNoCostItems = function () {
                var _this = this;
                var allItems = this.Flatten();
                var anyZeroCostItems = _.some(allItems, function (item) { return _this.HasNoCost(item) && _this.HasCount(item); });
                return anyZeroCostItems;
            };
            CountService.prototype.HasNoCost = function (item) {
                return !item.ZeroCostItem && (item.ItemCost === 0 || item.ItemCost === null);
            };
            CountService.prototype.HasCount = function (item) {
                var hasCount = ((item.InnerCount != null && item.InnerCount >= 0) ||
                    (item.OuterCount != null && item.OuterCount >= 0) ||
                    (item.InventoryCount != null && item.InventoryCount >= 0) ||
                    (item.WeightCount != null && item.WeightCount >= 0));
                return hasCount;
            };
            CountService.prototype.GetNoCostValues = function () {
                var _this = this;
                var allItems = this.Flatten();
                var zeroCostCountedItems = _.filter(allItems, function (item) { return _this.HasNoCost(item) && _this.HasCount(item); });
                var uniqZeroCostItems = _.uniq(zeroCostCountedItems, function (item) { return item.ItemId; });
                var sortedUniqZeroCostItems = _.sortBy(uniqZeroCostItems, function (item) { return item.Description; });
                angular.forEach(sortedUniqZeroCostItems, function (item) { item.ItemCost = null; });
                return sortedUniqZeroCostItems;
            };
            CountService.prototype.GetModelCallback = function (result, modelLoadedCallback) {
                _.assign(this._model.Inventory, result.data);
                this.UpdateOriginalCounts();
                this.ExamineAndSetItemStatusesOnLoad();
                this.ModelReceived.Fire(null);
                if (modelLoadedCallback != null) {
                    modelLoadedCallback();
                }
            };
            CountService.prototype.GetModel = function (entityId, countType, modelLoadedCallback) {
                var _this = this;
                this._currentCountType = countType;
                this.countService.Get(countType, entityId, -1).then(function (result) { return _this.GetModelCallback(result, modelLoadedCallback); });
                return this._model;
            };
            CountService.prototype.GetCurrentModel = function () {
                return this._model;
            };
            CountService.prototype.GetModelPromise = function (entityId, countType) {
                var _this = this;
                if (this._emptyModelReceivedTimeoutPromise != null) {
                    this.timeoutService.cancel(this._emptyModelReceivedTimeoutPromise);
                }
                if (this._currentCountType != countType) {
                    this._emptyCountReceivedNumberOfRepeatCalls = 0;
                }
                this._currentCountType = countType;
                var promise = this.countService.Get(countType, entityId, -1);
                promise.then(function (result) {
                    if (result.data == null || result.data.Locations == null || result.data.Locations.length == 0) {
                        if (_this._emptyCountReceivedNumberOfRepeatCalls < _this._modelRetrievalAttempts) {
                            _this._emptyModelReceivedTimeoutPromise = _this.timeoutService(function () { _this.GetModelPromise(entityId, countType); }, _this._modelRetrievalInterval);
                        }
                        _this._emptyCountReceivedNumberOfRepeatCalls++;
                    }
                    else {
                        _this._emptyCountReceivedNumberOfRepeatCalls = 0;
                        _this.GetModelCallback(result);
                    }
                });
                if (this._emptyCountReceivedNumberOfRepeatCalls > this._modelRetrievalAttempts) {
                    this._emptyCountReceivedNumberOfRepeatCalls = 0;
                }
                return promise;
            };
            CountService.prototype.Delete = function (countType, countId) {
                var hubConnection = this.signalR.GetConnectionId();
                return this.countService.Delete(countType, countId, this._model.Inventory.EntityId, hubConnection);
            };
            CountService.prototype.UpdateItemCostInAllLocations = function (itemId, cost) {
                var noCostItems = _.filter(this.Flatten(), function (item) { return item.ItemId == itemId; });
                _.forEach(noCostItems, function (item) { item.ItemCost = cost; });
            };
            CountService.prototype.SearchAllEntityItemsAndVendorEntityItems = function (entityId, countId, locationId, itemTypeId, search) {
                return this.countService.GetEntityItemsAndVendorEntityItemsNotInCurrentCount(entityId, countId, locationId, itemTypeId, search);
            };
            CountService.prototype.GetTranslatedCountType = function (countType, l10N) {
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
            };
            CountService.prototype.GetTranslatedCountStatus = function (countStatus) {
                var key = Count.Api.Models.CountStatus[countStatus];
                return this._translations ? this._translations[key] : key;
            };
            CountService.prototype.GetCountType = function (typeName) {
                var name = typeName.toLowerCase();
                var countType;
                for (var e in Count.Api.Models.CountType) {
                    if (!isNaN(e) && Count.Api.Models.CountType[e].toLowerCase() === name) {
                        countType = Number(e);
                        break;
                    }
                }
                return countType;
            };
            CountService.prototype.GetCssStatusClass = function (item) {
                if (item.Status == Count.Api.Models.CountStatus.Variance) {
                    return "fa fa-check-square-o mx-col-warning";
                }
                if (item.Status == Count.Api.Models.CountStatus.Pending) {
                    return "fa fa-spinner mx-col-warning";
                }
                if (item.Status == Count.Api.Models.CountStatus.Counted) {
                    return "fa fa-check-square-o mx-col-success";
                }
                if (item.Status == Count.Api.Models.CountStatus.Partial) {
                    return "fa fa-ellipsis-h mx-col-primary";
                }
                return "fa fa-square-o mx-color-graymiddark";
            };
            CountService.prototype.GetCssStatusColor = function (item) {
                if (item.Status == Count.Api.Models.CountStatus.Variance) {
                    return this._outOfToleranceCountColor;
                }
                if (item.Status == Count.Api.Models.CountStatus.Pending) {
                    return this._pendingCountColor;
                }
                if (item.Status == Count.Api.Models.CountStatus.Counted) {
                    return this._countedCountColor;
                }
                if (item.Status == Count.Api.Models.CountStatus.Partial) {
                    return this._pendingCountColor;
                }
                return this._pendingCountColor;
            };
            CountService.prototype.GetCssItemStatusClass = function (status) {
                if (status == Count.Api.Models.CountStatus.Variance) {
                    return "badge-warning";
                }
                if (status == Count.Api.Models.CountStatus.Counted) {
                    return "badge-success";
                }
                return "";
            };
            CountService.prototype.GetCssItemStatusColor = function (status) {
                if (status == Count.Api.Models.CountStatus.Variance) {
                    return "badge-warning";
                }
                if (status == Count.Api.Models.CountStatus.Counted) {
                    return "badge-success";
                }
                return "";
            };
            CountService.prototype.GetCssLocationStatusColor = function (status) {
                if (status == Count.Api.Models.CountStatus.Variance) {
                    return this._outOfToleranceCountColor;
                }
                if (status == Count.Api.Models.CountStatus.Counted) {
                    return this._countedCountColor;
                }
                if (status == Count.Api.Models.CountStatus.Partial) {
                    return this._pendingCountColor;
                }
                return this._pendingCountColor;
            };
            CountService.prototype.IsBusy = function () {
                return (this._model.CountUpdatesQueue.length != 0);
            };
            CountService.prototype.IsApplyDateReadOnly = function () {
                return (this._model.Inventory.IsApplyDateReadOnly);
            };
            CountService.prototype.GetLocalStoreDateTime = function () {
                return (this._model.Inventory.LocalStoreDateTime);
            };
            CountService.prototype.AddItemsToCurrentCount = function (entityId, countId, locationId, items) {
                var _this = this;
                this.countService.PostUpdateCountWithCountItems(this.authService.GetUser().BusinessUser.MobileSettings.EntityId, countId, locationId, items, this._currentCountType)
                    .success(function (result) {
                    _this.GetModel(entityId, _this._currentCountType, function () {
                        _this.InvokeCountModelReloadedCallback();
                    });
                });
            };
            return CountService;
        }());
        Count.CountService = CountService;
        Count.$countService = Core.NG.InventoryCountModule.RegisterService("Count", CountService, Core.$translation, Core.Auth.$authService, Count.Api.$countService, Core.$signalR, Core.LocalStorage.$localStorageSvc, Core.NG.$rootScope, Count.Api.$countTypeService, Core.NG.$http, Core.NG.$timeout, Core.$popupMessageService, Core.NG.$q, Inventory.Count.Api.$updateCostService, ICApi.$inventoryCountSettingsService, Administration.User.Services.$userSettingService);
    })(Count = Inventory.Count || (Inventory.Count = {}));
})(Inventory || (Inventory = {}));
