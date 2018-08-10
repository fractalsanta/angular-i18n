var Administration;
(function (Administration) {
    var Settings;
    (function (Settings) {
        "use strict";
        var FApi = Forecasting.Api;
        var ForecastFilterDialogController = (function () {
            function ForecastFilterDialogController($scope, modalInstance, translationService, translatedPosServiceTypeService, filters, filter, editMode, forecastFilterDialogService) {
                var _this = this;
                this.$scope = $scope;
                this.modalInstance = modalInstance;
                this.translationService = translationService;
                this.translatedPosServiceTypeService = translatedPosServiceTypeService;
                this.filters = filters;
                this.filter = filter;
                this.editMode = editMode;
                this.forecastFilterDialogService = forecastFilterDialogService;
                $scope.Vm = {
                    EditMode: editMode,
                    Filter: {
                        Id: filter.Id,
                        Name: filter.Name,
                        IsForecastEditableViaGroup: filter.IsForecastEditableViaGroup,
                        ForecastFilterGroupTypes: angular.copy(filter.ForecastFilterGroupTypes)
                    },
                    ServiceTypes: [],
                    ServiceTypesUsedMap: this.GetUsedMap(filters, editMode ? filter : null),
                    ValidationErrorMessage: ""
                };
                translatedPosServiceTypeService.GetPosServiceTypeEnumTranslations().success(function (result) {
                    $scope.Vm.ServiceTypes = result;
                });
                translationService.GetTranslations().then(function (result) {
                    $scope.Translations = result.Forecasting;
                });
                $scope.Cancel = function () {
                    modalInstance.dismiss();
                };
                $scope.SaveFilter = function () {
                    $scope.Vm.ValidationErrorMessage = "";
                    _this.forecastFilterDialogService.PostInsertOrUpdateForecastFilter($scope.Vm.Filter).success(function () {
                        modalInstance.close();
                    }).then(null, function (response) {
                        switch (response.status) {
                            case 409:
                                $scope.Vm.ValidationErrorMessage = response.data.Message;
                                break;
                            default:
                                break;
                        }
                        ;
                    });
                };
                $scope.ToggleType = function (id) {
                    var types = $scope.Vm.Filter.ForecastFilterGroupTypes, index = types.indexOf(id);
                    if (index !== -1) {
                        types.splice(index, 1);
                    }
                    else {
                        types.push(id);
                    }
                };
                $scope.HasType = function (id) {
                    return $scope.Vm.Filter.ForecastFilterGroupTypes.indexOf(id) !== -1;
                };
                $scope.HasTypes = function () {
                    return $scope.Vm.Filter.ForecastFilterGroupTypes.length !== 0;
                };
                $scope.UsedType = function (id) {
                    return $scope.Vm.ServiceTypesUsedMap[id];
                };
            }
            ForecastFilterDialogController.prototype.GetUsedMap = function (filters, editing) {
                var map = {};
                _.each(filters, function (filter) {
                    if (editing === null || filter.Id !== editing.Id) {
                        _.each(filter.ForecastFilterGroupTypes, function (type) {
                            map[type] = true;
                        });
                    }
                });
                return map;
            };
            return ForecastFilterDialogController;
        }());
        Settings.ForecastFilterDialogController = ForecastFilterDialogController;
        Core.NG.AdministrationSettingsModule.RegisterNamedController("ForecastFilterDialogController", ForecastFilterDialogController, Core.NG.$typedScope(), Core.NG.$modalInstance, Core.$translation, FApi.$translatedPosServiceTypeService, Core.NG.$typedCustomResolve("Filters"), Core.NG.$typedCustomResolve("Filter"), Core.NG.$typedCustomResolve("Edit"), FApi.$forecastFilterDialogService);
    })(Settings = Administration.Settings || (Administration.Settings = {}));
})(Administration || (Administration = {}));
