module Forecasting {
    "use strict";

    export class MirroringStoreStates {
        static Stores = "Stores";
        static StoreDetails = "StoreDetails";
        static StoreAdd = "StoreAdd";
    }

    export enum StoreMirrorStatusGroup {
        None = 0,
        Active = 1,
        Cancelled = 2,
        Completed = 3,
        Everything = 4
    }

    export enum StoreMirrorStatus {
        None = 0,
        Completed = 1,
        InProgress = 2,
        Scheduled = 3,
        Cancelled = 4,
        PendingCancellation = 5,
        PartiallyCompleted = 6,
    }

    export enum StoreMirrorType {
        None = 0,
        Corporate = 1,
        NonCorporate = 2,
        All = 3
    }

    export interface IMirroringStoreControllerScope extends ng.IScope {
        Vm: {
            L10N: Api.Models.ITranslations;
            Dates?: Core.IDateRange;
            FilterStatus: number;
            StoreGroupIntervals?: IMyStoreMirrorIntervalGroup[];
            SelectedStoreGroupInterval?: IMyStoreMirrorIntervalGroup;
            EntityId: number;
        };

        NavigateTo(state: string): void;
        NavigateToParam(key: string, value: string): void;
        OpenDateRangeDialog(startDate: Date, endDate: Date, minDate: Date, maxDate: Date, setDefaultDates: boolean): ng.IPromise<any>;

        Cancel(): void;
        CancelMirror(): void;
        AddMirror(): void;
        ViewMirrorDetails(interval: IMyStoreMirrorIntervalGroup, index: number): void;
        Save(interval: IMyStoreMirrorIntervalGroup): void;

        SourceDateRangeBeforeTarget(): boolean;
    }

    export class MirroringStoreController {
        private L10N: Api.Models.ITranslations = <Api.Models.ITranslations>{};
        private mirroringStoreContainer: IMirroringStatesContainer = <IMirroringStatesContainer>{};

        constructor(
            private $scope: IMirroringStoreControllerScope,
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
                if (toState.name.match("Stores$")) {
                    this.$scope.Vm.SelectedStoreGroupInterval = null;
                }
            });

            $scope.Cancel = (): void => {
                this.$scope.NavigateTo(MirroringStoreStates.Stores);
            };

            $scope.ViewMirrorDetails = (intervalGroup: IMyStoreMirrorIntervalGroup, index: number): void => {
                var firstInterval = intervalGroup.Intervals[0];
                intervalGroup.IsAllDay = this.mirroringService.IsAllDay(firstInterval);

                this.$scope.Vm.SelectedStoreGroupInterval = intervalGroup;
                this.$scope.NavigateTo(MirroringStoreStates.StoreDetails);
            };

            $scope.AddMirror = (): void => {
                this.$scope.Vm.SelectedStoreGroupInterval = <IMyStoreMirrorIntervalGroup>{};
                this.$scope.NavigateTo(MirroringStoreStates.StoreAdd);
            };

            $scope.CancelMirror = (): void => {
                this.popupMessageService.ShowSuccess(this.L10N.CancelMirrorSuccess);
            };

            // #endregion

            // #region data

            $scope.OpenDateRangeDialog = (startDate: Date, endDate: Date, minDate: Date, maxDate: Date, setDefaultDates: boolean): ng.IPromise<any> => {
                return this.OpenDateRangeDialog(startDate, endDate, minDate, maxDate, setDefaultDates);
            };

            $scope.Save = (interval: IMyStoreMirrorIntervalGroup): void => {
                this.Save(interval);
            };

            $scope.SourceDateRangeBeforeTarget = (): boolean => {
                if (!$scope.Vm.SelectedStoreGroupInterval || !$scope.Vm.SelectedStoreGroupInterval.SourceDateEndDate || !$scope.Vm.SelectedStoreGroupInterval.TargetDateStartDate) {
                    return true;
                }

                if ($scope.Vm.SelectedStoreGroupInterval.SourceDateEndDate < moment($scope.Vm.SelectedStoreGroupInterval.TargetDateStartDate).toDate()) {
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
                FilterStatus: StoreMirrorStatusGroup.Active,
                EntityId: this.$authService.GetUser().BusinessUser.MobileSettings.EntityId
            };

            if (Forecasting.hasOwnProperty("mirroringStoreContainer")) {
                this.mirroringStoreContainer = Forecasting["mirroringStoreContainer"];
            }

            this.GetL10N();
            this.SetTitle();
        }

        GetL10N(): void {
            this.translationService.GetTranslations().then((l10NData: any): void => {
                this.L10N = this.$scope.Vm.L10N = l10NData.Forecasting;
                this.mirroringStoreContainer.L10N = this.L10N;
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
                mc = this.mirroringStoreContainer;

            if (mc && name) {
                var state: IMirroringState = mc.GetState(name);
                if (state) {
                    title = state.GetTitle();
                }
            }

            this.popupMessageService.SetPageTitle(title);
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

        public Save(interval: IMyStoreMirrorIntervalGroup): void {
            this.mirroringService.SaveStoreMirror(interval)
                .success((): void => {
                    this.popupMessageService.ShowSuccess(this.$scope.Vm.L10N.SavedSuccessfully);
                    this.$scope.Vm.StoreGroupIntervals = null;
                    this.$scope.NavigateTo(MirroringStoreStates.Stores);
                })
                .error((message: any, status: any): void => {
                    if (status === Core.HttpStatus.Conflict) {
                        this.popupMessageService.ShowError(this.$scope.Vm.L10N.StoreMirrorOverlapMessage);
                    } else {
                        this.popupMessageService.ShowError(this.$scope.Vm.L10N.Error + status + " " + message.Message);
                    }
                });
        }
    }

    export var mirroringStoreController =
        Core.NG.ForecastingModule.RegisterNamedController("MirroringStoreController", MirroringStoreController,
            Core.NG.$typedScope<IMirroringStoreControllerScope>(),
            Core.NG.$state,
            Core.Auth.$authService,
            Core.$translation,
            Core.$popupMessageService,
            Core.NG.$modal,
            Forecasting.Services.$mirroringService);
}