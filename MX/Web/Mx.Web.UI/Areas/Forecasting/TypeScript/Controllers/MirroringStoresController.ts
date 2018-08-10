module Forecasting {
    "use strict";

    export interface IMirroringStoresControllerScope extends IMirroringStoreControllerScope {
        Model: {
            FilteredIntervals?: IMyStoreMirrorInterval[];
        };

        StatusMap(): any;
        GroupStatusOptions(): any[];
        ChangeGroupStatus(): void;
        Header(): Core.Directives.IGridHeader;
        FilterIntervals(): void;
    }

    export class MirroringStoresController {
        private L10N: Api.Models.ITranslations = <Api.Models.ITranslations>{};
        private Header: Core.Directives.IGridHeader;
        private GroupStatusOptions: any[];
        private StatusMap: any;

        constructor(
            private $scope: IMirroringStoresControllerScope,
            private popupMessageService: Core.IPopupMessageService,
            private mirroringService: Services.IMirroringService,
            private $timeout: ng.ITimeoutService
            ) {

            // #region toolbar

            $scope.FilterIntervals = (): void => {
                var status = this.$scope.Vm.FilterStatus,
                    intervals = this.$scope.Vm.StoreGroupIntervals,
                    filtered;

                filtered = this.ApplySearchFilter(status, intervals);

                this.$scope.Model.FilteredIntervals = filtered;

                this.GetHeader().OnSortEvent();
            };

            $scope.GroupStatusOptions = (): any[] => {
                return this.GroupStatusOptions;
            };

            $scope.ChangeGroupStatus = (): void => {
                this.LoadData($scope.Vm.FilterStatus);
            };

            // #endregion

            // #region data

            $scope.Header = (): Core.Directives.IGridHeader => {
                return this.Header;
            };

            $scope.StatusMap = (): any => {
                return this.StatusMap;
            };

            $scope.$watch("Vm.L10N", (newValue: Api.Models.ITranslations): void => {
                this.L10N = newValue;
                this.Header = this.GetHeader();
                this.GroupStatusOptions = this.GetGroupStatusOptions();
                this.StatusMap = this.GetStatusMap();
                this.$timeout(() => {
                    $(window).resize();
                });
            }, false);

            // #endregion

            this.Initialize();
        }

        public Initialize(): void {
            this.Header = this.GetHeader();

            this.$scope.Model = {
            };

            if (!this.$scope.Vm.StoreGroupIntervals) {
                this.LoadData(this.$scope.Vm.FilterStatus);
            } else {
                this.$scope.FilterIntervals();
            }
        }

        public GetHeader(): Core.Directives.IGridHeader {
            var performSort = (): void => {
                this.$scope.Model.FilteredIntervals = this.Header.DefaultSort(this.$scope.Model.FilteredIntervals);
            },
            defaultSort = (data: any[]): any[] => {
                return data;
            },
            header =  <Core.Directives.IGridHeader> {
                Columns: [
                    { Title: this.L10N.Status, Fields: ["Status"] },
                    { Title: this.L10N.MirrorDates, Fields: ["TargetDateStartDate"] },
                    { Title: "" } // chevron
                ],
                OnSortEvent: performSort,
                DefaultSort: defaultSort,
                IsAscending: true
            };

            header.Selected = header.Columns[1];

            return header;
        }

        public GetGroupStatusOptions(): any[] {
            return [
                { Value: StoreMirrorStatusGroup.Active, Title: this.L10N.Active },
                { Value: StoreMirrorStatusGroup.Cancelled, Title: this.L10N.Cancelled },
                { Value: StoreMirrorStatusGroup.Completed, Title: this.L10N.Completed },
                { Value: StoreMirrorStatusGroup.Everything, Title: this.L10N.All }
            ];
        }

        public GetStatusMap(): any {
            var map: any = {};

            map[StoreMirrorStatus.Completed] = this.L10N.Completed;
            map[StoreMirrorStatus.InProgress] = this.L10N.InProgress;
            map[StoreMirrorStatus.Scheduled] = this.L10N.Scheduled;
            map[StoreMirrorStatus.Cancelled] = this.L10N.Cancelled;
            map[StoreMirrorStatus.PendingCancellation] = this.L10N.PendingCancellation;
            map[StoreMirrorStatus.PartiallyCompleted] = this.L10N.PartiallyCompleted;

            return map;
        }

        public LoadData(status: number): void {
            this.mirroringService.GetStoreMirrorIntervals(this.$scope.Vm.EntityId, status)
                .success((intervals: IMyStoreMirrorIntervalGroup[]): void => {
                    _.each(intervals, (interval: IMyStoreMirrorIntervalGroup): void => {
                        this.mirroringService.Cast(interval);
                    });

                    this.$scope.Vm.StoreGroupIntervals = intervals;
                    this.$scope.FilterIntervals();
                })
                .error((message: any, status: any): void => {
                    this.popupMessageService.ShowError(this.$scope.Vm.L10N.Error + message);
                });
        }

        public ApplySearchFilter(status: number, intervals: IMyStoreMirrorIntervalGroup[]): IMyStoreMirrorIntervalGroup[] {
            var filtered: IMyStoreMirrorIntervalGroup[] = intervals;
            
            if (status) {
                filtered = _.filter(intervals, (interval: IMyStoreMirrorIntervalGroup): boolean => {
                    if (status === StoreMirrorStatusGroup.Everything || interval.OverallStatusGroup === status) {
                        return true;
                    }

                    return false;
                });
            }

            return filtered;
        }
    }

    export var mirroringStoresController = Core.NG.ForecastingModule.RegisterNamedController("MirroringStoresController", MirroringStoresController,
        Core.NG.$typedScope<IMirroringStoresControllerScope>(),
        Core.$popupMessageService,
        Forecasting.Services.$mirroringService,
        Core.NG.$timeout
        );
}