var Administration;
(function (Administration) {
    var Settings;
    (function (Settings) {
        "use strict";
        var Task = Core.Api.Models.Task;
        var ICApi = Administration.Settings.Api;
        var InventoryCountSettingsController = (function () {
            function InventoryCountSettingsController($scope, translationService, popupMessageService, $authService, $locationService, inventoryCountSettingsService) {
                var _this = this;
                this.$scope = $scope;
                this.translationService = translationService;
                this.inventoryCountSettingsService = inventoryCountSettingsService;
                var canViewPage = $authService.CheckPermissionAllowance(Task.Administration_Settings_InventoryCount_CanAccess);
                if (!canViewPage) {
                    $locationService.path("/Core/Forbidden");
                    return;
                }
                ;
                $scope.Vm = {
                    PendingColor: "",
                    OutOfToleranceColor: "",
                    CountedColor: "",
                    IsDirty: false
                };
                translationService.GetTranslations().then(function (result) {
                    $scope.Translations = result.Settings;
                    popupMessageService.SetPageTitle($scope.Translations.InventoryCountSettings + " " + $scope.Translations.Settings);
                    _this.LoadData();
                });
                $scope.SaveInventoryCountSettings = function () {
                    if (_this.$scope.Vm.IsDirty) {
                        inventoryCountSettingsService.PostInventoryCountSettings(_this.$scope.Vm).success(function () {
                            $scope.Vm.IsDirty = false;
                            popupMessageService.ShowSuccess($scope.Translations.InventoryCountSettingsSaved);
                        });
                        popupMessageService.ShowSuccess($scope.Translations.InventoryCountSettingsSaved);
                    }
                };
                $scope.ValueChanged = function () {
                    $scope.Vm.IsDirty = true;
                };
            }
            InventoryCountSettingsController.prototype.LoadData = function () {
                var _this = this;
                this.inventoryCountSettingsService.GetInventoryCountSettings().success(function (results) {
                    _this.$scope.Vm.PendingColor = results.PendingColor;
                    _this.$scope.Vm.OutOfToleranceColor = results.OutOfToleranceColor;
                    _this.$scope.Vm.CountedColor = results.CountedColor;
                });
            };
            return InventoryCountSettingsController;
        }());
        Settings.InventoryCountSettingsController = InventoryCountSettingsController;
        Settings.inventoryCountSettingsController = Core.NG.AdministrationSettingsModule.RegisterNamedController("InventoryCountSettingsController", InventoryCountSettingsController, Core.NG.$typedScope(), Core.$translation, Core.$popupMessageService, Core.Auth.$authService, Core.NG.$location, ICApi.$inventoryCountSettingsService);
    })(Settings = Administration.Settings || (Administration.Settings = {}));
})(Administration || (Administration = {}));
