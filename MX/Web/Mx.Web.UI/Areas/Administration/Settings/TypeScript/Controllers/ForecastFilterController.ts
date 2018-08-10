module Administration.Settings {
    "use strict";

    import Task = Core.Api.Models.Task;

    export class ForecastFilterController {
        constructor(
            private $scope: IForecastFilterControllerScope,
            private translationService: Core.ITranslationService,
            private popupMessageService: Core.IPopupMessageService,
            $modal: ng.ui.bootstrap.IModalService,
            confirmationService: Core.IConfirmationService,
            authorizationService: Core.Auth.IAuthService,
            $locationService: ng.ILocationService,
            private forecastFilterService: Forecasting.Api.IForecastFilterService,
            private forecastFilterAssignService: Forecasting.Api.IForecastFilterAssignService
            ) {

            var canViewPage = authorizationService.CheckPermissionAllowance(Task.Administration_Settings_ForecastFilter_CanAccess);

            if (!canViewPage) {
                $locationService.path("/Core/Forbidden");
                return;
            };

            $scope.Vm = {
                Functions: [], 
                FunctionsMap: {},
                ForecastFilters: []
            };

            $scope.AddForecastFilter = (): void => {
                this.EditForecastFilter($modal, null);
            };

            $scope.ViewForecastFilter = (filter: Forecasting.Api.Models.IForecastFilterRecord): void => {
                this.EditForecastFilter($modal, filter);
            };

            $scope.CanEditForecastViaFilter = (record: Forecasting.Api.Models.IForecastFilterRecord): boolean => {
                return record.IsForecastEditableViaGroup;
            };

            $scope.UsedByForecastFilter = (filter: Forecasting.Api.Models.IForecastFilterRecord): string => {
                return $scope.Vm.FunctionsMap[filter.Id] || "";
            };

            $scope.InUseForecastFilter = (filter: Forecasting.Api.Models.IForecastFilterRecord): boolean => {
                return $scope.UsedByForecastFilter(filter).length !== 0;
            };

            $scope.DeleteForecastFilter = (filter: Forecasting.Api.Models.IForecastFilterRecord): void => {
                confirmationService.Confirm({
                    Title: $scope.Translations.DeleteModalWindowTitle,
                    Message: $scope.Translations.DeleteModalWindowMessage.toString().format(filter.Name),
                    ConfirmText: $scope.Translations.Delete,
                    ConfirmationType: Core.ConfirmationTypeEnum.Danger
                }).then((result) => {
                    if (result) {
                        forecastFilterService.DeleteFilterById(filter.Id).success(() => {
                            popupMessageService.ShowSuccess($scope.Translations.FilterDeleted);
                            this.LoadData();
                        }).error(() => {
                            popupMessageService.ShowError($scope.Translations.FilterDeleteError);
                            this.LoadData();
                        });
                    }
                });
            };

            $scope.DoRecordsExist = (): boolean => {
                if ($scope.Vm.ForecastFilters) {
                    return $scope.Vm.ForecastFilters.length > 0;
                }

                return false;
            };

            this.LoadTranslations();
            this.LoadData();
        }

        EditForecastFilter($modal: ng.ui.bootstrap.IModalService, filter: Forecasting.Api.Models.IForecastFilterRecord): void {
            var editMode: boolean = filter != null;
            filter = filter || <Forecasting.Api.Models.IForecastFilterRecord>{
                Id: 0,
                Name: "",
                IsForecastEditableViaGroup: true,
                ForecastFilterGroupTypes: []
            };

            var modalInstance = $modal.open({
                templateUrl: "/Areas/Administration/Settings/Templates/ForecastFilterDialog.html",
                controller: "Administration.Settings.ForecastFilterDialogController",
                resolve: {
                    Filter: (): Forecasting.Api.Models.IForecastFilterRecord => {
                        return filter;
                    },
                    Edit: (): boolean => {
                        return editMode;
                    },
                    Filters: (): Forecasting.Api.Models.IForecastFilterRecord[] => {
                        return this.$scope.Vm.ForecastFilters;
                    }

                }
            });

            modalInstance.result.then(() => {
                this.LoadData();
            });
        }

        public LoadTranslations(): void {
            this.translationService.GetTranslations().then((translations: Core.Api.Models.ITranslations): void => {
                this.$scope.Translations = translations.Settings;
                this.popupMessageService.SetPageTitle(this.$scope.Translations.ForecastFilters);
            });
        }

        public GetMap(functions: Forecasting.Api.Models.IForecastFilterAssignRecord[], translations: any): any {
            var map: Object = {};
                var tmp: Object = {};

            _.each(functions, (func) => {
                if (func.ServiceGroupId) {
                    tmp[func.ServiceGroupId] = tmp[func.ServiceGroupId] || [];
                    tmp[func.ServiceGroupId].push(translations[func.Name]);
                }
            });

            for (var key in tmp) {
                map[key] = tmp[key].join();
            }

            return map;
        }

        public LoadData(): void {
            this.forecastFilterService.GetForecastFilters().success((results: Forecasting.Api.Models.IForecastFilterRecord[]): void => {
                this.$scope.Vm.ForecastFilters = results;
            });

            this.forecastFilterAssignService.GetForecastFilterAssigns().success((results: Forecasting.Api.Models.IForecastFilterAssignRecord[]): void => {
                this.$scope.Vm.Functions = results;
                this.$scope.Vm.FunctionsMap = this.GetMap(results, this.$scope.Translations);;
            });
        }
    }

    export var forecastFilterSettingsController = Core.NG.AdministrationSettingsModule.RegisterNamedController("ForecastFilterController", ForecastFilterController,
        Core.NG.$typedScope<IForecastFilterControllerScope>(),
        Core.$translation,
        Core.$popupMessageService,
        Core.NG.$modal,
        Core.$confirmationService,
        Core.Auth.$authService,
        Core.NG.$location,
        Forecasting.Api.$forecastFilterService,
        Forecasting.Api.$forecastFilterAssignService
        );
}