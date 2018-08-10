var Administration;
(function (Administration) {
    var Hierarchy;
    (function (Hierarchy) {
        "use strict";
        var EditLocationController = (function () {
            function EditLocationController($scope, translation, popup, locationService, selectedLocation, $modalInstance) {
                $scope.NewParent = {};
                $scope.UpdatedLocation = {
                    Name: selectedLocation.Name,
                    Number: selectedLocation.Number,
                    Parent: selectedLocation.Parent
                };
                $scope.ParentOptions = {
                    Value: ""
                };
                $scope.Search = {
                    FilterText: ""
                };
                $scope.LocationInfo = selectedLocation.DisplayName;
                if (selectedLocation.Parent) {
                    $scope.ParentOptions.Value = selectedLocation.Parent.Number;
                    if (selectedLocation.Parent.Parent) {
                        $scope.PossibleParents = selectedLocation.Parent.Parent.Children;
                    }
                }
                $scope.FilterOnLocation = function (loc) {
                    return (loc.DisplayName.toLowerCase()).indexOf($scope.Search.FilterText.toLowerCase()) >= 0;
                };
                popup.Dismiss();
                translation.GetTranslations().then(function (results) {
                    $scope.Translations = results.Hierarchy;
                });
                locationService.Subscribe($scope, function (location, levels) {
                    if (selectedLocation.Parent) {
                        $scope.HierarchyLevel = levels[selectedLocation.Parent.Type - 1];
                    }
                    else {
                        $scope.HierarchyLevel = undefined;
                    }
                });
                $scope.Confirm = function (isDone) {
                    locationService.UpdateLocation(selectedLocation.Id, $scope.UpdatedLocation.Number, $scope.UpdatedLocation.Name)
                        .then(function () {
                        if ($scope.ParentOptions.Value !== "" && $scope.ParentOptions.Value !== selectedLocation.Parent.Number) {
                            locationService.MoveLocation(selectedLocation.Id, $scope.NewParent.Id)
                                .then(function () {
                                $scope.FormScope.$setPristine();
                                popup.ShowSuccess($scope.Translations.SaveSuccessful);
                                if (isDone === true) {
                                    $modalInstance.close(selectedLocation);
                                }
                            }, function (response) {
                                popup.ShowError($scope.Translations[response.statusText]);
                            });
                        }
                        else {
                            $scope.FormScope.$setPristine();
                            popup.ShowSuccess($scope.Translations.SaveSuccessful);
                            if (isDone === true) {
                                $modalInstance.close(selectedLocation);
                            }
                        }
                    }, function (response) {
                        popup.ShowError($scope.Translations[response.statusText]);
                    });
                };
                $scope.SaveAndClose = function (formScope) {
                    $scope.FormScope = formScope;
                    if ($scope.FormScope.$dirty) {
                        $scope.Confirm(true);
                    }
                    else {
                        $modalInstance.close(selectedLocation);
                    }
                };
                $scope.Cancel = function () {
                    if (!$scope.FormScope || $scope.FormScope.$dirty) {
                        $modalInstance.dismiss();
                    }
                    else {
                        $modalInstance.close(selectedLocation);
                    }
                };
                $scope.Update = function (formScope) {
                    $scope.FormScope = formScope;
                    $scope.Confirm(false);
                    popup.Dismiss();
                };
                $scope.SelectParent = function (parent, formScope) {
                    $scope.ParentOptions.Value = parent.Number;
                    $scope.NewParent = parent;
                    $scope.FormScope = formScope;
                    $scope.FormScope.$setDirty();
                };
            }
            return EditLocationController;
        }());
        Core.NG.AdministrationHierarchyModule.RegisterNamedController("EditLocation", EditLocationController, Core.NG.$typedScope(), Core.$translation, Core.$popupMessageService, Hierarchy.Services.$locationService, Core.NG.$typedCustomResolve("selectedLocation"), Core.NG.$modalInstance);
    })(Hierarchy = Administration.Hierarchy || (Administration.Hierarchy = {}));
})(Administration || (Administration = {}));
