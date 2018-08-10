var Inventory;
(function (Inventory) {
    var Count;
    (function (Count) {
        var TravelPathService = (function () {
            function TravelPathService(travelPathService, authService, signalR, travelPathItemService, rootScope) {
                var _this = this;
                this.travelPathService = travelPathService;
                this.authService = authService;
                this.signalR = signalR;
                this.travelPathItemService = travelPathItemService;
                this.rootScope = rootScope;
                this.InitializeModel();
                this.RegisterSignaRListeners();
                rootScope.$on(Core.ApplicationEvent.ChangeStore, function () {
                    _this.InitializeModel();
                });
            }
            TravelPathService.prototype.InitializeModel = function () {
                this._model = {
                    TravelPathEntity: {
                        TravelPath: []
                    }
                };
                var user = this.authService.GetUser();
                this._entityId = user.BusinessUser.MobileSettings.EntityId;
                this._locationListAllowMultiSelect = false;
                this.ModelReceived = new Core.Events.Event();
            };
            TravelPathService.prototype.SetLocationModalListMultiSelect = function (allowMultiSelect) {
                this._locationListAllowMultiSelect = allowMultiSelect;
            };
            TravelPathService.prototype.GetLocationModalListMultiSelect = function () {
                return this._locationListAllowMultiSelect;
            };
            TravelPathService.prototype.RegisterSignaRListeners = function () {
                var _this = this;
                this.signalR.SetSignalREventListener(Core.SignalRServerMethods.TravelPathDataUpdatedPartial, function (travelPathLocationId, currentEntityId) { return _this.TravelPathHasBeenUpdatedPartially(travelPathLocationId, currentEntityId); });
                this.signalR.SetSignalREventListener(Core.SignalRServerMethods.NewLocationReceived, function (travelPathData, currentEntityId) { return _this.AddNewLocation(travelPathData, currentEntityId); });
                this.signalR.SetSignalREventListener(Core.SignalRServerMethods.GetLocations, function (currentEntityId) { return _this.GetLocations(currentEntityId); });
                this.signalR.SetSignalREventListener(Core.SignalRServerMethods.RenameLocation, function (travelPathData, currentEntityId) { return _this.RenameLocation(travelPathData.Id, travelPathData.Location, currentEntityId); });
                this.signalR.SetSignalREventListener(Core.SignalRServerMethods.DeActivateLocation, function (travelPathData, currentEntityId) { return _this.DeActivateLocation(travelPathData.Id, currentEntityId); });
                this.signalR.SetSignalREventListener(Core.SignalRServerMethods.ActivateLocation, function (travelPathData, currentEntityId) { return _this.ActivateLocation(travelPathData, currentEntityId); });
                this.signalR.SetSignalREventListener(Core.SignalRServerMethods.ResortLocation, function (locationIds, currentEntityId) { return _this.ResortLocations(locationIds, currentEntityId); });
            };
            TravelPathService.prototype.TravelPathHasBeenUpdatedPartially = function (travelPathLocationId, currentEntityId) {
                var _this = this;
                if (this._entityId === currentEntityId) {
                    this.travelPathService.GetTravelPathDataForLocation(currentEntityId, travelPathLocationId).then(function (result) {
                        if (_this._entityId === currentEntityId && _this._model !== null && _this._model.TravelPathEntity !== null) {
                            for (var i = 0; i < _this._model.TravelPathEntity.TravelPath.length; i++) {
                                var location = _this._model.TravelPathEntity.TravelPath[i];
                                if (location.Id == travelPathLocationId) {
                                    _this._model.TravelPathEntity.TravelPath[i] = result.data;
                                    _this.ModelReceived.Fire(null);
                                    break;
                                }
                            }
                        }
                    });
                }
            };
            TravelPathService.prototype.AddNewLocation = function (travelPathData, currentEntityId) {
                if (this._entityId === currentEntityId) {
                    this._model.TravelPathEntity.TravelPath.push(travelPathData);
                    this.ModelReceived.Fire(null);
                }
            };
            TravelPathService.prototype.GetLocations = function (currentEntityId) {
                if (this._entityId === currentEntityId) {
                    return this._model.TravelPathEntity.TravelPath;
                }
            };
            TravelPathService.prototype.RenameLocation = function (locationId, newLocationName, currentEntityId) {
                if (this._entityId === currentEntityId) {
                    var existingLocation = _.find(this._model.TravelPathEntity.TravelPath, { "Id": locationId });
                    existingLocation.Location = newLocationName;
                    this.ModelReceived.Fire(null);
                }
            };
            TravelPathService.prototype.DeActivateLocation = function (locationId, currentEntityId) {
                if (this._entityId === currentEntityId) {
                    var existingLocation = _.find(this._model.TravelPathEntity.TravelPath, { "Id": locationId });
                    this._model.TravelPathEntity.TravelPath = _.without(this._model.TravelPathEntity.TravelPath, existingLocation);
                    this.ModelReceived.Fire(null);
                }
            };
            TravelPathService.prototype.ActivateLocation = function (travelPathData, currentEntityId) {
                if (this._entityId === currentEntityId) {
                    this._model.TravelPathEntity.TravelPath.push(travelPathData);
                    this.ModelReceived.Fire(null);
                }
            };
            TravelPathService.prototype.ResortLocations = function (locationIds, currentEntityId) {
                var _this = this;
                if (this._entityId === currentEntityId) {
                    locationIds = _.remove(locationIds, function (id) {
                        return _.find(_this._model.TravelPathEntity.TravelPath, { "Id": id }) != null;
                    });
                    this._model.TravelPathEntity.TravelPath = _.map(locationIds, function (id) {
                        return _.find(_this._model.TravelPathEntity.TravelPath, { "Id": id });
                    });
                }
            };
            TravelPathService.prototype.GetModelCallback = function (result) {
                _.assign(this._model.TravelPathEntity, result.data);
                this.ModelReceived.Fire(null);
            };
            TravelPathService.prototype.GetModelPerformServerCall = function (entityId) {
                var _this = this;
                this.travelPathService.GetTravelPathData(entityId).then(function (result) { return _this.GetModelCallback(result); });
            };
            TravelPathService.prototype.GetModel = function () {
                var user = this.authService.GetUser();
                var entityId = user.BusinessUser.MobileSettings.EntityId;
                if (this._model.TravelPathEntity.TravelPath.length == 0) {
                    this.GetModelPerformServerCall(entityId);
                }
                else {
                    if (this._model.TravelPathEntity.EntityId != entityId) {
                        this.GetModelPerformServerCall(entityId);
                    }
                }
                return this._model;
            };
            TravelPathService.prototype.FlattenTravelPathItems = function () {
                if (this._model != null && this._model.TravelPathEntity != null) {
                    return _.flatten(this._model.TravelPathEntity.TravelPath, function (item) { return item.Items; });
                }
                return [];
            };
            TravelPathService.prototype.GetModelPromise = function () {
                var user = this.authService.GetUser();
                var entityId = user.BusinessUser.MobileSettings.EntityId;
                return this.travelPathService.GetTravelPathData(entityId);
            };
            TravelPathService.prototype.GetTravelPathData = function (currentEntityId) {
                return this.travelPathService.GetTravelPathData(currentEntityId);
            };
            TravelPathService.prototype.PostUpdateTravelPath = function (update, currentEntityId) {
                var _this = this;
                var currentSignalRConnectionId = this.GetSignalRconnectionId();
                var promise = this.travelPathService.PostUpdateTravelPath(update, currentSignalRConnectionId, currentEntityId);
                promise.then(function (result) {
                    _.forEach(result.data, function (travelPathPartialUpdate) {
                        _this.TravelPathHasBeenUpdatedPartially(travelPathPartialUpdate.Id, travelPathPartialUpdate.EntityId);
                    });
                });
                return promise;
            };
            TravelPathService.prototype.GetCurrentLocationIndex = function () {
                return this._currentLocationIdx;
            };
            TravelPathService.prototype.SetCurrentLocation = function (location) {
                this._currentLocation = location;
            };
            TravelPathService.prototype.GetCurrentLocation = function () {
                return this._currentLocation;
            };
            TravelPathService.prototype.SetCurrentLocationIndex = function (idx) {
                this._currentLocationIdx = idx;
            };
            TravelPathService.prototype.UpdateTravelPathItem = function (update) {
                return this.travelPathItemService.PostUpdateCount(update);
            };
            TravelPathService.prototype.GetSignalRconnectionId = function () {
                return this.signalR.GetConnectionId();
            };
            TravelPathService.prototype.ResetOtherCounts = function (input) {
                _.each(this.FlattenTravelPathItems(), function (item) {
                    if (item.Id != input.Id && item.Code.toLowerCase() === input.Code.toLowerCase()) {
                        item.IsDailyCounted = input.IsDailyCounted;
                        item.IsMonthlyCounted = input.IsMonthlyCounted;
                        item.IsPeriodicCounted = input.IsPeriodicCounted;
                        item.IsSpotCounted = input.IsSpotCounted;
                        item.IsWeeklyCounted = input.IsWeeklyCounted;
                    }
                });
            };
            return TravelPathService;
        }());
        Count.$travelPathService = Core.NG.InventoryCountModule.RegisterService("travelPath", TravelPathService, Count.Api.$travelPathService, Core.Auth.$authService, Core.$signalR, Count.Api.$travelPathItemService, Core.NG.$rootScope);
    })(Count = Inventory.Count || (Inventory.Count = {}));
})(Inventory || (Inventory = {}));
