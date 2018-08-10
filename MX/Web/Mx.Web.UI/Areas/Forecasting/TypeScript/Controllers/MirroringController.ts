module Forecasting {
    "use strict";

    export class MirroringStates {
        static List = "SalesItems";
        static Details = "SalesItemDetails";
        static Add = "SalesItemAdd";
    }
    
    export interface IMirroringControllerScope extends ng.IScope {
        Vm: {
            L10N: Api.Models.ITranslations;
            Dates?: Core.IDateRange;
            FilterText: string;
            SalesItemIntervals?: IMySalesItemMirroringInterval[];
            SelectedSalesItemInterval?: IMySalesItemMirroringInterval;
            Zones?: Api.Models.IZone[];
        };

        NavigateTo(state: string): void;
        NavigateToParam(key: string, value: string): void;
        OpenDateRangeDialog(startDate: Date, endDate: Date, minDate: Date, maxDate: Date, setDefaultDates: boolean): ng.IPromise<any>;

        Cancel(): void;
        AddItem(): void;
        ViewDetails(interval: IMySalesItemMirroringInterval, index: number): void;
        Save(interval: IMySalesItemMirroringInterval): void;

        GetZoneSelectedCount(): string;
        SameDay(): boolean;
        SourceDateRangeBeforeTarget(): boolean;
    }

    export class MirroringController {
        private L10N: Api.Models.ITranslations = <Api.Models.ITranslations>{};
        private mirroringContainer: IMirroringStatesContainer = <IMirroringStatesContainer>{};

        constructor(
            private $scope: IMirroringControllerScope,
            private $state: ng.ui.IStateService,
            private $authService: Core.Auth.IAuthService,
            private translationService: Core.ITranslationService,
            private popupMessageService: Core.IPopupMessageService,
            private $modal: ng.ui.bootstrap.IModalService,
            private mirroringService: Services.IMirroringService
            ) {

            // #region states

            this.$scope.NavigateTo = (state: string, extendedParams?: string): void => {
                var tmp: any = _.clone(this.$state.params);
                this.AddKeyValues(tmp, extendedParams);

                this.$state.go((<any>this.$state.current).parent.name + "." + state, tmp, { inherit: true, location: true, notify: true });
            };

            this.$scope.NavigateToParam = (key: string, value: string, extendedParams?: string): void => {
                var tmp: any = _.clone(this.$state.params);
                tmp[key] = value;
                this.AddKeyValues(tmp, extendedParams);

                this.$state.go(this.$state.current.name, tmp, { inherit: true, location: true, notify: true });
            };

            $scope.$on(Core.ApplicationEvent.UiRouterStateChangeSuccess, (event: any, toState: any, toParams: any, fromState: any, fromParms: any): void => {
                this.SetTitle(toState.name);
                if (toState.name.match("SalesItems$")) {
                    this.$scope.Vm.SelectedSalesItemInterval = null;
                }
            });

            $scope.Cancel = (): void => {
                this.$scope.NavigateTo(MirroringStates.List);
            };

            $scope.ViewDetails = (interval: IMySalesItemMirroringInterval, index: number): void => {
                this.$scope.Vm.SelectedSalesItemInterval = interval;
                this.$scope.NavigateTo(MirroringStates.Details);
            };

            $scope.AddItem = (): void => {
                this.$scope.Vm.SelectedSalesItemInterval = <IMySalesItemMirroringInterval>{};
                this.$scope.NavigateTo(MirroringStates.Add);
            };

            // #endregion

            // #region data

            $scope.OpenDateRangeDialog = (startDate: Date, endDate: Date, minDate: Date, maxDate: Date, setDefaultDates: boolean): ng.IPromise<any> => {
                return this.OpenDateRangeDialog(startDate, endDate, minDate, maxDate, setDefaultDates);
            };

            $scope.GetZoneSelectedCount = (): string => {
                var zone: Api.Models.IZone = this.$scope.Vm.SelectedSalesItemInterval ? this.$scope.Vm.SelectedSalesItemInterval.Zone : <Api.Models.IZone>{},
                    count: string = "" + (zone ? zone.EntityCount || 0 : 0);
                return this.L10N.Restaurants ? this.L10N.Restaurants.replace(/\{0\}/g, count) : "";
            };

            $scope.Save = (interval: IMySalesItemMirroringInterval): void => {
                this.Save(interval);
            };

            $scope.SameDay = (): boolean => {
                if (!$scope.Vm.SelectedSalesItemInterval || !$scope.Vm.SelectedSalesItemInterval.TargetDateStartDate || !$scope.Vm.SelectedSalesItemInterval.SourceDateStartDate) {
                    return true;
                }

                if ($scope.Vm.SelectedSalesItemInterval.TargetDateStartDate.getDay() === $scope.Vm.SelectedSalesItemInterval.SourceDateStartDate.getDay()) {
                    return true;
                }

                return false;
            };

            $scope.SourceDateRangeBeforeTarget = (): boolean => {
                if (!$scope.Vm.SelectedSalesItemInterval || !$scope.Vm.SelectedSalesItemInterval.SourceDateEndDate || !$scope.Vm.SelectedSalesItemInterval.TargetDateStartDate) {
                    return true;
                }

                if ($scope.Vm.SelectedSalesItemInterval.SourceDateEndDate < moment($scope.Vm.SelectedSalesItemInterval.TargetDateStartDate).toDate()) {
                    return true;
                }

                return false;
            };

            // #endregion

            this.Initialize();
        }

        Initialize(): void {
            this.$scope.Vm = {
                L10N: <Api.Models.ITranslations>{},
                FilterText: ""
            };

            if (Forecasting.hasOwnProperty("mirroringContainer")) {
                this.mirroringContainer = Forecasting["mirroringContainer"];
            }

            this.GetL10N();
            this.GetZones();
            this.SetTitle();
        }

        GetL10N(): void {
            this.translationService.GetTranslations().then((l10NData: any): void => {
                this.L10N = this.$scope.Vm.L10N = l10NData.Forecasting;
                this.mirroringContainer.L10N = this.L10N;
                this.SetTitle();
            });
        }

        SetTitle(name?: string): void {
            if (!name) {
                if (this.$state && this.$state.current) {
                    name = this.$state.current.name;
                }
            }

            var title = "",
                mc = this.mirroringContainer;

            if (mc && name) {
                var state: IMirroringState = mc.GetState(name);
                if (state) {
                    title = state.GetTitle();
                }
            }

            this.popupMessageService.SetPageTitle(title);
        }

        GetZones(): void {
            this.mirroringService.GetForecastZones()
                .success((zones: Api.Models.IZone[]): void => {
                    this.$scope.Vm.Zones = zones;
                })
                .error((message: any, status: any): void => {
                    this.popupMessageService.ShowError(this.$scope.Vm.L10N.Error + message);
                });
        }

        AddKeyValues(params: any, extendedParams: string): void {
            if (extendedParams) {
                var pairs = extendedParams.split("&");
                _.each(pairs, (pair: string): void => {
                    var keyValue = pair.split("=");
                    params[keyValue[0]] = keyValue[1];
                });
            }
        }

        public OpenDateRangeDialog(startDate: Date, endDate: Date, minDate: Date, maxDate: Date, setDefaultDates: boolean): ng.IPromise<any> {
            var range: Core.IDateRange = <Core.IDateRange>{ StartDate: startDate, EndDate: endDate },
                minMax: Core.IDateRange = <Core.IDateRange>{ StartDate: minDate, EndDate: maxDate },
                modalInstance = this.$modal.open(<ng.ui.bootstrap.IModalSettings>{
                    templateUrl: "/Areas/Core/Templates/mx-date-range.html",
                    controller: "Core.DateRangeController",
                    windowClass: "wide-sm",
                    resolve: {
                        dateRange: (): Core.IDateRange => { return range; },
                        minMaxDateRange: (): Core.IDateRange => { return minMax; },
                        dateRangeOptions: (): Core.IDateRangeOptions => {
                            return <Core.IDateRangeOptions> { SetDefaultDates: setDefaultDates };
                        }
                    }
                });

            return modalInstance.result;
        }

        public Save(interval: IMySalesItemMirroringInterval): void {
            this.mirroringService.SaveSalesItem(interval)
                .success((): void => {
                    this.popupMessageService.ShowSuccess(this.$scope.Vm.L10N.SavedSuccessfully);
                    this.$scope.Vm.SalesItemIntervals = null;
                    this.$scope.NavigateTo(MirroringStates.List);
                })
                .error((message: any, status: any): void => {
                    if (status === Core.HttpStatus.Conflict) {
                        this.popupMessageService.ShowError(this.$scope.Vm.L10N.MirrorOverlapMessage);
                    } else {
                        this.popupMessageService.ShowError(this.$scope.Vm.L10N.Error + status + " " + message.Message);
                    }
                });
        }
    }

    export var mirroringController =
        Core.NG.ForecastingModule.RegisterNamedController("MirroringController", MirroringController,
            Core.NG.$typedScope<IMirroringControllerScope>(),
            Core.NG.$state,
            Core.Auth.$authService,
            Core.$translation,
            Core.$popupMessageService,
            Core.NG.$modal,
            Forecasting.Services.$mirroringService);
}