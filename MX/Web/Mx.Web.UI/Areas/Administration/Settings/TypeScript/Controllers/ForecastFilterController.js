var Administration;
(function (Administration) {
    var Settings;
    (function (Settings) {
        "use strict";
        var Task = Core.Api.Models.Task;
        var ForecastFilterController = (function () {
            function ForecastFilterController($scope, translationService, popupMessageService, $modal, confirmationService, authorizationService, $locationService, forecastFilterService, forecastFilterAssignService) {
                var _this = this;
                this.$scope = $scope;
                this.translationService = translationService;
                this.popupMessageService = popupMessageService;
                this.forecastFilterService = forecastFilterService;
                this.forecastFilterAssignService = forecastFilterAssignService;
                var canViewPage = authorizationService.CheckPermissionAllowance(Task.Administration_Settings_ForecastFilter_CanAccess);
                if (!canViewPage) {
                    $locationService.path("/Core/Forbidden");
                    return;
                }
                ;
                $scope.Vm = {
                    Functions: [],
                    FunctionsMap: {},
                    ForecastFilters: []
                };
                $scope.AddForecastFilter = function () {
                    _this.EditForecastFilter($modal, null);
                };
                $scope.ViewForecastFilter = function (filter) {
                    _this.EditForecastFilter($modal, filter);
                };
                $scope.CanEditForecastViaFilter = function (record) {
                    return record.IsForecastEditableViaGroup;
                };
                $scope.UsedByForecastFilter = function (filter) {
                    return $scope.Vm.FunctionsMap[filter.Id] || "";
                };
                $scope.InUseForecastFilter = function (filter) {
                    return $scope.UsedByForecastFilter(filter).length !== 0;
                };
                $scope.DeleteForecastFilter = function (filter) {
                    confirmationService.Confirm({
                        Title: $scope.Translations.DeleteModalWindowTitle,
                        Message: $scope.Translations.DeleteModalWindowMessage.toString().format(filter.Name),
                        ConfirmText: $scope.Translations.Delete,
                        ConfirmationType: Core.ConfirmationTypeEnum.Danger
                    }).then(function (result) {
                        if (result) {
                            forecastFilterService.DeleteFilterById(filter.Id).success(function () {
                                popupMessageService.ShowSuccess($scope.Translations.FilterDeleted);
                                _this.LoadData();
                            }).error(function () {
                                popupMessageService.ShowError($scope.Translations.FilterDeleteError);
                                _this.LoadData();
                            });
                        }
                    });
                };
                $scope.DoRecordsExist = function () {
                    if ($scope.Vm.ForecastFilters) {
                        return $scope.Vm.ForecastFilters.length > 0;
                    }
                    return false;
                };
                this.LoadTranslations();
                this.LoadData();
            }
            ForecastFilterController.prototype.EditForecastFilter = function ($modal, filter) {
                var _this = this;
                var editMode = filter != null;
                filter = filter || {
                    Id: 0,
                    Name: "",
                    IsForecastEditableViaGroup: true,
                    ForecastFilterGroupTypes: []
                };
                var modalInstance = $modal.open({
                    templateUrl: "/Areas/Administration/Settings/Templates/ForecastFilterDialog.html",
                    controller: "Administration.Settings.ForecastFilterDialogController",
                    resolve: {
                        Filter: function () {
                            return filter;
                        },
                        Edit: function () {
                            return editMode;
                        },
                        Filters: function () {
                            return _this.$scope.Vm.ForecastFilters;
                        }
                    }
                });
                modalInstance.result.then(function () {
                    _this.LoadData();
                });
            };
            ForecastFilterController.prototype.LoadTranslations = function () {
                var _this = this;
                this.translationService.GetTranslations().then(function (translations) {
                    _this.$scope.Translations = translations.Settings;
                    _this.popupMessageService.SetPageTitle(_this.$scope.Translations.ForecastFilters);
                });
            };
            ForecastFilterController.prototype.GetMap = function (functions, translations) {
                var map = {};
                var tmp = {};
                _.each(functions, function (func) {
                    if (func.ServiceGroupId) {
                        tmp[func.ServiceGroupId] = tmp[func.ServiceGroupId] || [];
                        tmp[func.ServiceGroupId].push(translations[func.Name]);
                    }
                });
                for (var key in tmp) {
                    map[key] = tmp[key].join();
                }
                return map;
            };
            ForecastFilterController.prototype.LoadData = function () {
                var _this = this;
                this.forecastFilterService.GetForecastFilters().success(function (results) {
                    _this.$scope.Vm.ForecastFilters = results;
                });
                this.forecastFilterAssignService.GetForecastFilterAssigns().success(function (results) {
                    _this.$scope.Vm.Functions = results;
                    _this.$scope.Vm.FunctionsMap = _this.GetMap(results, _this.$scope.Translations);
                    ;
                });
            };
            return ForecastFilterController;
        }());
        Settings.ForecastFilterController = ForecastFilterController;
        Settings.forecastFilterSettingsController = Core.NG.AdministrationSettingsModule.RegisterNamedController("ForecastFilterController", ForecastFilterController, Core.NG.$typedScope(), Core.$translation, Core.$popupMessageService, Core.NG.$modal, Core.$confirmationService, Core.Auth.$authService, Core.NG.$location, Forecasting.Api.$forecastFilterService, Forecasting.Api.$forecastFilterAssignService);
    })(Settings = Administration.Settings || (Administration.Settings = {}));
})(Administration || (Administration = {}));
