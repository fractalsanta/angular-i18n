var Core;
(function (Core) {
    var Directives;
    (function (Directives) {
        "use strict";
        var MxEntitySearchController = (function () {
            function MxEntitySearchController($scope, locationService, translation) {
                var _this = this;
                this.locationService = locationService;
                $scope.SearchText = "";
                translation.GetTranslations().then(function (result) {
                    $scope.Translations = result.Hierarchy;
                });
                $scope.FilterEntries = function () {
                    var lowestlevel = locationService.GetLowestHiearchyLevel(), searchText = $scope.SearchText.trim().toLocaleLowerCase(), length = _this._originalEntries.length, filteredEntries = [], current, i;
                    if (!searchText) {
                        $scope.Entries = [];
                        return;
                    }
                    for (i = length - 1; i >= 0; i -= 1) {
                        current = _this._originalEntries[i];
                        if (!current.IsHeader && $scope.Options.OnFilter && !$scope.Options.OnFilter(current.Location)) {
                            continue;
                        }
                        if ((current.IsHeader && (filteredEntries.length && filteredEntries[filteredEntries.length - 1].Type === current.Type)) ||
                            (current.Location.Viewable && current.Location.DisplayName.toLowerCase().indexOf(searchText) !== -1)) {
                            if (!$scope.IsOnlyLowestlevel) {
                                filteredEntries.push(current);
                                continue;
                            }
                            if (current.Location.Type === lowestlevel) {
                                filteredEntries.push(current);
                            }
                        }
                    }
                    $scope.Entries = filteredEntries.reverse();
                };
                locationService.Subscribe($scope, function (hierarchy, levels) {
                    locationService.GetLocationById(1).then(function (location) {
                        var flattenedLocations = _this.FlattenHierarchy(location);
                        _this._originalEntries = _this.BuildList(flattenedLocations, levels);
                        $scope.SearchText = "";
                        $scope.FilterEntries();
                    });
                }, this);
                locationService.LoadData();
            }
            MxEntitySearchController.prototype.FlattenHierarchy = function (location) {
                var locations = [], length = location.Children.length, i;
                locations.push(location);
                for (i = 0; i < length; i += 1) {
                    locations.push.apply(locations, this.FlattenHierarchy(location.Children[i]));
                }
                return locations;
            };
            MxEntitySearchController.prototype.BuildList = function (locations, hierarchy) {
                var locationList = [], groupings = [], length = locations.length, currentLocation, currentGrouping, type, i, r;
                for (i = 0; i < length; i += 1) {
                    currentLocation = locations[i];
                    type = currentLocation.Type - 1;
                    if (!groupings[type]) {
                        groupings[type] = [];
                    }
                    groupings[type].push(currentLocation);
                }
                length = groupings.length;
                for (i = 0; i < length; i += 1) {
                    currentGrouping = groupings[i];
                    if (!currentGrouping) {
                        continue;
                    }
                    length = currentGrouping.length;
                    currentGrouping = _.sortBy(currentGrouping, function (location) {
                        return location.Name.toLowerCase();
                    });
                    locationList.push({
                        Location: { DisplayName: hierarchy[i] },
                        IsHeader: true,
                        Type: i
                    });
                    for (r = 0; r < length; r += 1) {
                        locationList.push({
                            IsHeader: false,
                            Location: currentGrouping[r],
                            Type: i
                        });
                    }
                    length = groupings.length;
                }
                return locationList;
            };
            return MxEntitySearchController;
        }());
        var MxEntitySearch = (function () {
            function MxEntitySearch($timeout) {
                return {
                    restrict: "E",
                    replace: true,
                    scope: { Options: "=options" },
                    templateUrl: "/Areas/Core/Templates/mx-entity-search.html",
                    controller: "Core.MxEntitySearchController",
                    link: function ($scope, element, attrs) {
                        var input = element.find("input"), list = element.find("div.list-group"), panel = element.find(".panel"), $window = angular.element(window), exclude = ":not(.list-group-item-info, .list-group-item-warning)", active = "active", possibleElements, currentElement, reset;
                        reset = function () {
                            if (currentElement) {
                                currentElement.removeClass(active);
                            }
                            currentElement = null;
                            possibleElements = null;
                            $scope.IsOnlyLowestlevel = !(attrs.onlylowestlevel == undefined);
                        };
                        $scope.SelectEntity = function (entry) {
                            panel.scrollTop(0);
                            $scope.SearchText = "";
                            if ($scope.Options.OnSelect) {
                                $scope.Options.OnSelect(entry.Location);
                            }
                            reset();
                        };
                        $scope.$watch("SearchText", function () {
                            panel.scrollTop(0);
                            panel.css({ maxHeight: $window.height() - panel.offset().top - 50 });
                            reset();
                        });
                        input.on("keydown", function (e) {
                            if (!$scope.Entries || !$scope.Entries.length) {
                                return;
                            }
                            if (e.shiftKey && e.which === Core.KeyCodes.Tab) {
                                e.which = Core.KeyCodes.Up;
                            }
                            switch (e.which) {
                                case Core.KeyCodes.Enter: {
                                    e.target.blur();
                                    if (currentElement) {
                                        panel.scrollTop(0);
                                        currentElement.click();
                                        return;
                                    }
                                    if ($scope.Entries.length === 2) {
                                        $timeout(function () { $scope.SelectEntity($scope.Entries[1]); }, 0, true);
                                        return;
                                    }
                                    break;
                                }
                                case Core.KeyCodes.Tab:
                                case Core.KeyCodes.Down: {
                                    if (!currentElement) {
                                        currentElement = list.children(exclude).first();
                                        break;
                                    }
                                    possibleElements = currentElement.nextAll(exclude);
                                    if (possibleElements.length) {
                                        currentElement.removeClass(active);
                                        currentElement = possibleElements.first();
                                    }
                                    break;
                                }
                                case Core.KeyCodes.Up: {
                                    if (!currentElement) {
                                        return;
                                    }
                                    possibleElements = currentElement.prevAll(exclude);
                                    if (possibleElements.length) {
                                        currentElement.removeClass(active);
                                        currentElement = possibleElements.first();
                                    }
                                    break;
                                }
                                default: return;
                            }
                            if (currentElement) {
                                e.preventDefault();
                                currentElement.addClass(active);
                                panel.scrollTop(panel.scrollTop() + currentElement.position().top - (panel.height() / 2) + currentElement.outerHeight());
                            }
                        });
                        input.on("focus", function () {
                            $timeout(function () {
                                $scope.HasFocus = true;
                            }, 0, true);
                        });
                        input.on("blur", function () {
                            $timeout(function () {
                                $scope.HasFocus = false;
                                reset();
                            }, 0, true);
                        });
                        $window.on("resize.mx-entity-search", function () {
                            panel.css({ maxHeight: $window.height() - panel.offset().top - 50 });
                        });
                        $scope.$on("$destroy", function () {
                            $window.off("resize.mx-entity-search");
                        });
                    }
                };
            }
            return MxEntitySearch;
        }());
        Core.NG.CoreModule.RegisterNamedController("MxEntitySearchController", MxEntitySearchController, Core.NG.$typedScope(), Administration.Hierarchy.Services.$locationService, Core.$translation);
        Core.NG.CoreModule.RegisterDirective("mxEntitySearch", MxEntitySearch, Core.NG.$timeout);
    })(Directives = Core.Directives || (Core.Directives = {}));
})(Core || (Core = {}));
