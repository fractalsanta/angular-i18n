var Administration;
(function (Administration) {
    var Hierarchy;
    (function (Hierarchy) {
        var Services;
        (function (Services) {
            "use strict";
            var LocationService = (function () {
                function LocationService($q, hierarchy, auth, formatter) {
                    this.$q = $q;
                    this.hierarchy = hierarchy;
                    this.formatter = formatter;
                    this.LocationMap = [];
                    this.Subscribers = [];
                    this.CurrentLocationRequests = [];
                    this.User = auth.GetUser();
                    this.LoadData();
                }
                LocationService.prototype.LoadData = function () {
                    var _this = this;
                    if (!this.IsProcessing) {
                        this.GetHierarchy().then(function (location) {
                            _this.GetHierarchyLevels().then(function (levels) {
                                _this.CurrentLocationHierarchy = location;
                                _this.CurrentLocationLevels = levels;
                                _this.Notify();
                                _this.IsProcessing = false;
                                while (_this.CurrentLocationRequests.length) {
                                    _this.CurrentLocationRequests.shift().resolve();
                                }
                            });
                        });
                        this.IsProcessing = true;
                    }
                };
                LocationService.prototype.Subscribe = function (subscribingScope, handler, context) {
                    var _this = this;
                    var subscription = { Handler: handler, Context: context };
                    this.Subscribers.push(subscription);
                    subscribingScope.$on("$destroy", function () {
                        _this.Subscribers.splice(_this.Subscribers.indexOf(subscription), 1);
                    });
                    if (this.CurrentLocationHierarchy && this.CurrentLocationLevels) {
                        subscription.Handler.apply(subscription.Context, [this.CurrentLocationHierarchy, this.CurrentLocationLevels]);
                    }
                };
                LocationService.prototype.GetLocationById = function (id) {
                    var _this = this;
                    var deferred = this.$q.defer(), returnedDeferred = this.$q.defer();
                    deferred.promise.then(function () {
                        returnedDeferred.resolve(_this.LocationMap[id]);
                    });
                    if (!this.IsProcessing && this.CurrentLocationHierarchy && this.CurrentLocationLevels) {
                        deferred.resolve();
                    }
                    else {
                        this.CurrentLocationRequests.push(deferred);
                    }
                    return returnedDeferred.promise;
                };
                LocationService.prototype.SortLocationChildren = function (location) {
                    location.Children.sort(function (a, b) {
                        if (a.Name < b.Name) {
                            return -1;
                        }
                        if (a.Name > b.Name) {
                            return 1;
                        }
                        return 0;
                    });
                };
                LocationService.prototype.CreateNewLocationForParent = function (parentId, locationName, locationNumber) {
                    var _this = this;
                    var parent = this.LocationMap[parentId];
                    var locationType = parent.Type + 1;
                    return this.hierarchy.PostCreateEntity(locationNumber, locationName, parentId, locationType).success(function (result) {
                        var newLocation = {
                            Id: result,
                            Name: locationName,
                            Number: locationNumber,
                            Type: locationType,
                            Children: [],
                            Parent: parent,
                            Status: "Active",
                            Viewable: true,
                            DisplayName: null
                        };
                        _this.SetDisplayName(newLocation);
                        parent.Children.push(newLocation);
                        _this.LocationMap[result] = newLocation;
                        _this.SortLocationChildren(parent);
                    });
                };
                LocationService.prototype.UpdateLocation = function (id, locationNumber, locationName) {
                    var _this = this;
                    return this.hierarchy.PutUpdateBarebonesEntity(id, locationNumber, locationName).success(function () {
                        var location = _this.LocationMap[id];
                        location.Name = locationName;
                        location.Number = locationNumber;
                        _this.SetDisplayName(location);
                        if (location.Parent) {
                            _this.SortLocationChildren(location.Parent);
                        }
                    });
                };
                LocationService.prototype.MoveLocation = function (locationId, newParentId) {
                    var _this = this;
                    return this.hierarchy.PutMoveHierarchy(locationId, newParentId).success(function () {
                        var location = _this.LocationMap[locationId], newParent = _this.LocationMap[newParentId], oldParent = location.Parent, length = oldParent.Children.length, i;
                        for (i = 0; i < length; i += 1) {
                            if (oldParent.Children[i] === location) {
                                oldParent.Children.splice(i, 1);
                                newParent.Children.push(location);
                                location.Parent = newParent;
                                break;
                            }
                        }
                        _this.SortLocationChildren(oldParent);
                        _this.SortLocationChildren(newParent);
                    });
                };
                LocationService.prototype.SetDisplayName = function (location) {
                    var entityModel = {
                        Id: location.Id,
                        Name: location.Name,
                        Number: location.Number
                    };
                    location.DisplayName = this.formatter.CreateLocationDisplayName(entityModel);
                };
                LocationService.prototype.GetLowestHiearchyLevel = function () {
                    return this.CurrentLocationLevels.length;
                };
                LocationService.prototype.GetHierarchy = function () {
                    var _this = this;
                    if (this.CurrentHierarchy) {
                        return this.CurrentHierarchy.promise;
                    }
                    this.CurrentHierarchy = this.$q.defer();
                    this.hierarchy.GetHierarchy(1).success(function (result) {
                        _this.ProcessData(result);
                        _this.CurrentHierarchy.resolve(_this.LocationMap[_this.User.BusinessUser.EntityIdBase]);
                        _this.CurrentHierarchy = null;
                    });
                    return this.CurrentHierarchy.promise;
                };
                LocationService.prototype.GetHierarchyLevels = function () {
                    var _this = this;
                    if (this.CurrentLevels) {
                        return this.CurrentLevels.promise;
                    }
                    this.CurrentLevels = this.$q.defer();
                    this.hierarchy.GetHierarchyLevels().success(function (result) {
                        _this.CurrentLevels.resolve(result);
                        _this.CurrentLevels = null;
                    });
                    return this.CurrentLevels.promise;
                };
                LocationService.prototype.ProcessData = function (location, parentLocation) {
                    var children = location.Children, length = (children) ? children.length : 0, i;
                    if (parentLocation) {
                        location.Parent = parentLocation;
                    }
                    if (location.Id === this.User.BusinessUser.EntityIdBase) {
                        location.Viewable = true;
                    }
                    if (!location.Viewable) {
                        location.Viewable = (parentLocation && parentLocation.Viewable) ?
                            parentLocation.Viewable :
                            this.User.BusinessUser.AssignedLocations.indexOf(location.Id) > -1;
                    }
                    this.SetDisplayName(location);
                    for (i = 0; i < length; i += 1) {
                        this.ProcessData(children[i], location);
                    }
                    this.LocationMap[location.Id] = location;
                    return location;
                };
                LocationService.prototype.Notify = function () {
                    var length = this.Subscribers.length, subscription, i;
                    for (i = 0; i < length; i += 1) {
                        subscription = this.Subscribers[i];
                        subscription.Handler.apply(subscription.Context, [this.CurrentLocationHierarchy, this.CurrentLocationLevels]);
                    }
                };
                return LocationService;
            }());
            Services.LocationService = LocationService;
            Services.$locationService = Core.NG.AdministrationHierarchyModule.RegisterService("LocationService", LocationService, Core.NG.$q, Hierarchy.Api.$hierarchyService, Core.Auth.$authService, Core.$formatterService);
        })(Services = Hierarchy.Services || (Hierarchy.Services = {}));
    })(Hierarchy = Administration.Hierarchy || (Administration.Hierarchy = {}));
})(Administration || (Administration = {}));
