var Administration;
(function (Administration) {
    var Hierarchy;
    (function (Hierarchy) {
        "use strict";
        var NewLocationController = (function () {
            function NewLocationController($scope, translation, popup, locationService, selectedLocation, $modalInstance, $window) {
                var _this = this;
                this.$scope = $scope;
                this.ClearForm();
                $scope.NewLocations = [];
                $scope.LocationInfo = selectedLocation.DisplayName;
                translation.GetTranslations().then(function (results) {
                    $scope.Translations = results.Hierarchy;
                });
                popup.Dismiss();
                $scope.Confirm = function (isDone) {
                    locationService.CreateNewLocationForParent(selectedLocation.Id, $scope.FormData.Name, $scope.FormData.Number)
                        .then(function (result) {
                        locationService.GetLocationById(result.data).then(function (newLocation) {
                            popup.ShowSuccess(newLocation.DisplayName + $scope.Translations.AddedSingleLocation + $scope.LocationInfo);
                            $scope.NewLocations.push(newLocation);
                            if (isDone) {
                                $modalInstance.close($scope.NewLocations);
                            }
                            _this.ClearForm();
                        });
                    }, function (response) {
                        popup.ShowError($scope.Translations[response.statusText]);
                    });
                };
                $scope.AddAnother = function () {
                    popup.Dismiss();
                    $scope.Confirm(false);
                    $window.scrollTo(0, 0);
                };
                $scope.Finish = function () {
                    if ($scope.FormData.Number && $scope.FormData.Name) {
                        $scope.Confirm(true);
                    }
                    else {
                        $modalInstance.close($scope.NewLocations);
                    }
                };
                $scope.Cancel = function () {
                    if ($scope.NewLocations.length > 0) {
                        $modalInstance.close($scope.NewLocations);
                    }
                    else {
                        $modalInstance.dismiss();
                    }
                };
            }
            NewLocationController.prototype.ClearForm = function () {
                this.$scope.FormData = {
                    Name: null,
                    Number: null
                };
            };
            return NewLocationController;
        }());
        Core.NG.AdministrationHierarchyModule.RegisterNamedController("NewLocation", NewLocationController, Core.NG.$typedScope(), Core.$translation, Core.$popupMessageService, Hierarchy.Services.$locationService, Core.NG.$typedCustomResolve("selectedLocation"), Core.NG.$modalInstance, Core.NG.$window);
    })(Hierarchy = Administration.Hierarchy || (Administration.Hierarchy = {}));
})(Administration || (Administration = {}));
