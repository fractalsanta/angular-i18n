var Administration;
(function (Administration) {
    var Hierarchy;
    (function (Hierarchy) {
        "use strict";
        var HierarchyController = (function () {
            function HierarchyController($scope, translation, popup, locationService, $modalService, $window) {
                translation.GetTranslations().then(function (results) {
                    $scope.Translations = results.Hierarchy;
                    popup.SetPageTitle(results.Hierarchy.Hierarchy);
                });
                $scope.Breadcrumbs = [];
                $scope.SelectLocation = function (location) {
                    var crumbs = [], current = location, parent = current.Parent;
                    if (current.Type === $scope.HierarchyLevels.length) {
                        if (parent !== $scope.SelectedLocation) {
                            current = parent;
                            parent = current.Parent;
                        }
                        else {
                            return;
                        }
                    }
                    $scope.SelectedLocation = current;
                    $scope.SearchedLocation = null;
                    $scope.SelectedLocationChildren = current.Children;
                    crumbs.unshift(current);
                    while (parent) {
                        current = parent;
                        crumbs.unshift(current);
                        parent = current.Parent;
                    }
                    $scope.Breadcrumbs = crumbs;
                };
                $scope.SearchOptions = {
                    OnSelect: function (selectedLocation) {
                        locationService.GetLocationById(selectedLocation.Id).then(function (location) {
                            var isLowest = (location.Type === $scope.HierarchyLevels.length);
                            if (location) {
                                $scope.SelectLocation(location);
                                $scope.SearchedLocation = location;
                                if (isLowest) {
                                    $scope.SelectedLocationChildren = [location].concat($scope.SelectedLocation.Children);
                                }
                            }
                        });
                    }
                };
                $scope.AddLocation = function () {
                    var modal = $modalService.open({
                        templateUrl: "/Areas/Administration/Hierarchy/Templates/NewLocation.html",
                        controller: "Administration.Hierarchy.NewLocation",
                        resolve: {
                            selectedLocation: function () {
                                return $scope.SelectedLocation;
                            }
                        }
                    });
                    modal.result.then(function (result) {
                        if (result) {
                            var selectedStoreFormattedInfo = $scope.SelectedLocation.DisplayName, resLength = result.length, buildSuccessMsg;
                            if (resLength === 0) {
                                return;
                            }
                            if (resLength === 1) {
                                buildSuccessMsg = result[0].DisplayName + $scope.Translations.AddedSingleLocation + selectedStoreFormattedInfo;
                            }
                            else {
                                buildSuccessMsg = resLength + $scope.Translations.AddedMultipleLocations + selectedStoreFormattedInfo;
                            }
                            popup.ShowSuccess(buildSuccessMsg);
                            $window.scrollTo(0, 0);
                        }
                    });
                };
                $scope.EditLocation = function (currentLocation) {
                    var modal = $modalService.open({
                        templateUrl: "/Areas/Administration/Hierarchy/Templates/EditLocation.html",
                        controller: "Administration.Hierarchy.EditLocation",
                        resolve: {
                            selectedLocation: function () {
                                return currentLocation;
                            }
                        }
                    });
                    modal.result.then(function (result) {
                        popup.ShowSuccess($scope.Translations.ChangesMadeTo + result.DisplayName + $scope.Translations.SuccessfullySaved);
                        $window.scrollTo(0, 0);
                    });
                };
                locationService.Subscribe($scope, function (location, levels) {
                    $scope.HierarchyLevels = levels;
                    $scope.SelectLocation(location);
                });
            }
            return HierarchyController;
        }());
        Core.NG.AdministrationHierarchyModule.RegisterRouteController("", "Templates/Hierarchy.html", HierarchyController, Core.NG.$typedScope(), Core.$translation, Core.$popupMessageService, Hierarchy.Services.$locationService, Core.NG.$modal, Core.NG.$window);
    })(Hierarchy = Administration.Hierarchy || (Administration.Hierarchy = {}));
})(Administration || (Administration = {}));
