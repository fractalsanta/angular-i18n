module Administration.Settings {
    "use strict";

    import FApi = Forecasting.Api;

    export class ForecastFilterDialogController {
        constructor(
            private $scope: IForecastFilterDialogControllerScope,
            private modalInstance: ng.ui.bootstrap.IModalServiceInstance,
            private translationService: Core.ITranslationService,
            private translatedPosServiceTypeService: FApi.ITranslatedPosServiceTypeService,
            private filters: FApi.Models.IForecastFilterRecord[],
            private filter: FApi.Models.IForecastFilterRecord,
            private editMode: boolean,
            private forecastFilterDialogService: FApi.IForecastFilterDialogService
            ) {

            $scope.Vm = {
                EditMode: editMode,
                Filter: <FApi.Models.IForecastFilterRecord>{
                    Id: filter.Id,
                    Name: filter.Name,
                    IsForecastEditableViaGroup: filter.IsForecastEditableViaGroup,
                    ForecastFilterGroupTypes: angular.copy(filter.ForecastFilterGroupTypes)
                },
                ServiceTypes: [],
                ServiceTypesUsedMap: this.GetUsedMap(filters, editMode ? filter : null),
                ValidationErrorMessage: ""
            };

            translatedPosServiceTypeService.GetPosServiceTypeEnumTranslations().success((result: Core.Api.Models.ITranslatedEnum[]): void => {
                $scope.Vm.ServiceTypes = result;
            });

            translationService.GetTranslations().then((result: Core.Api.Models.ITranslations): void => {
                $scope.Translations = result.Forecasting;
            });

            $scope.Cancel = (): void => {
                modalInstance.dismiss();
            };

            $scope.SaveFilter = (): void => {
                $scope.Vm.ValidationErrorMessage = "";

                this.forecastFilterDialogService.PostInsertOrUpdateForecastFilter($scope.Vm.Filter).success((): void => {
                    modalInstance.close();
                }).then(null, (response: ng.IHttpPromiseCallbackArg<Mx.Web.UI.Config.WebApi.IErrorMessage>): void => {
                        switch (response.status) {
                            case 409:
                                $scope.Vm.ValidationErrorMessage = response.data.Message;
                                break;
                            default:
                                break;
                        };
                    });
            };

            $scope.ToggleType = (id: number): void => {
                var types = $scope.Vm.Filter.ForecastFilterGroupTypes,
                    index = types.indexOf(id);

                if (index !== -1) {
                    types.splice(index, 1);
                } else {
                    types.push(id);
                }
            };

            $scope.HasType = (id: number): boolean => {
                return $scope.Vm.Filter.ForecastFilterGroupTypes.indexOf(id) !== -1;
            };

            $scope.HasTypes = (): boolean => {
                return $scope.Vm.Filter.ForecastFilterGroupTypes.length !== 0;
            };

            $scope.UsedType = (id: number): boolean => {
                return $scope.Vm.ServiceTypesUsedMap[id];
            }
        }

        public GetUsedMap(filters: FApi.Models.IForecastFilterRecord[], editing: FApi.Models.IForecastFilterRecord): any {
            var map: Object = {};

            _.each(filters, (filter) => {
                if (editing === null || filter.Id !== editing.Id) {
                    _.each(filter.ForecastFilterGroupTypes, (type) => {
                        map[type] = true;
                    });
                }
            });

            return map;
        }
    }

    Core.NG.AdministrationSettingsModule.RegisterNamedController("ForecastFilterDialogController", ForecastFilterDialogController,
        Core.NG.$typedScope<IForecastFilterDialogControllerScope>(),
        Core.NG.$modalInstance,
        Core.$translation,
        FApi.$translatedPosServiceTypeService,
        Core.NG.$typedCustomResolve<FApi.Models.IForecastFilterRecord[]>("Filters"),
        Core.NG.$typedCustomResolve<FApi.Models.IForecastFilterRecord>("Filter"),
        Core.NG.$typedCustomResolve<boolean>("Edit"),
        FApi.$forecastFilterDialogService
        );
} 
