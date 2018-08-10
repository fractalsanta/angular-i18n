var Administration;
(function (Administration) {
    var Settings;
    (function (Settings) {
        "use strict";
        var Task = Core.Api.Models.Task;
        var FApi = Forecasting.Api;
        var ForecastFilterUsageSettingsController = (function () {
            function ForecastFilterUsageSettingsController($scope, translationService, popupMessageService, $authService, $locationService, forecastFilterService, forecastFilterAssignService) {
                var _this = this;
                this.$scope = $scope;
                this.translationService = translationService;
                this.forecastFilterService = forecastFilterService;
                this.forecastFilterAssignService = forecastFilterAssignService;
                var canViewPage = $authService.CheckPermissionAllowance(Task.Administration_Settings_ForecastUsage_CanAccess);
                if (!canViewPage) {
                    $locationService.path("/Core/Forbidden");
                    return;
                }
                ;
                $scope.Vm = {
                    Functions: [],
                    ForecastFilters: [],
                    IsDirty: false
                };
                translationService.GetTranslations().then(function (result) {
                    $scope.Translations = result.Settings;
                    popupMessageService.SetPageTitle($scope.Translations.ForecastFilterUsage + " " + $scope.Translations.Settings);
                    _this.LoadData();
                });
                $scope.SaveForecastFilterUsageSettings = function () {
                    forecastFilterAssignService.PostForecastFilterAssign(_this.$scope.Vm.Functions).success(function () {
                        $scope.Vm.IsDirty = false;
                        popupMessageService.ShowSuccess($scope.Translations.ForecastFilterUsageSettingsSaved);
                    });
                };
                $scope.FilterChanged = function () {
                    $scope.Vm.IsDirty = true;
                };
            }
            ForecastFilterUsageSettingsController.prototype.LoadData = function () {
                var _this = this;
                this.forecastFilterService.GetForecastFilters().success(function (results) {
                    results.unshift({
                        Id: null,
                        Name: _this.$scope.Translations.Total
                    });
                    _this.$scope.Vm.ForecastFilters = results;
                    _this.forecastFilterAssignService.GetForecastFilterAssigns().success(function (results) {
                        _this.$scope.Vm.Functions = results;
                    });
                });
            };
            return ForecastFilterUsageSettingsController;
        }());
        Settings.ForecastFilterUsageSettingsController = ForecastFilterUsageSettingsController;
        Settings.forecastFilterUsageSettingsController = Core.NG.AdministrationSettingsModule.RegisterNamedController("ForecastFilterUsageSettingsController", ForecastFilterUsageSettingsController, Core.NG.$typedScope(), Core.$translation, Core.$popupMessageService, Core.Auth.$authService, Core.NG.$location, FApi.$forecastFilterService, FApi.$forecastFilterAssignService);
    })(Settings = Administration.Settings || (Administration.Settings = {}));
})(Administration || (Administration = {}));
