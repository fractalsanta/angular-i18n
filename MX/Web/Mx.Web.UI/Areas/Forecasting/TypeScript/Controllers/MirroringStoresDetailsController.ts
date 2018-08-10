module Forecasting {
    "use strict";

    export interface IMirroringStoresDetailsControllerScope extends IMirroringStoreControllerScope {
        Model: {
            IntervalGroup: IMyStoreMirrorIntervalGroup;
            SourceEntity: IEntityViewModel;
            HourIntervals: IMyStoreMirrorInterval[];
        };

        GetSourceEntityName(): string;
        IsReadOnly(): boolean;
        CancelMirror(): void;
        ShowCancelMirrorButton(): boolean;
        Header: Core.Directives.IGridHeader;
        SourceDateRangeBeforeTarget(): boolean;
    }

    export class MirroringStoresDetailsController {
        private Forecast: Services.IForecastObject;

        constructor(
            private $scope: IMirroringStoresDetailsControllerScope,
            private $modal: ng.ui.bootstrap.IModalService,
            private popupMessageService: Core.IPopupMessageService,
            private mirroringService: Services.IMirroringService,
            private entityService: Core.Api.IEntityService,
            private authService: Core.Auth.IAuthService,
            private confirmService: Core.IConfirmationService,
            private constants: Core.IConstants
            ) {

            $scope.IsReadOnly = (): boolean => {
                return true;
            };
            
            $scope.ShowCancelMirrorButton = (): boolean => {
                var result = this.IsTargetEndDateInFuture() &&
                    !this.IsMirrorCancelled() &&
                    !this.IsMirrorPendingCancellation() &&
                    !this.IsMirrorPartiallyCompleted();
                return result;
            };

            $scope.CancelMirror = (): void => {
                var entityId = authService.GetUser().BusinessUser.MobileSettings.EntityId,
                    userName = authService.GetUser().BusinessUser.UserName,
                    groupId = this.$scope.Model.IntervalGroup.GroupId,
                    resetManagerForecasts = this.$scope.Model.IntervalGroup.OverwriteManager;

                this.confirmService.Confirm({
                    Title: this.$scope.Vm.L10N.CancelMirror,
                    Message: this.$scope.Vm.L10N.CancelStoreMirrorMessage,
                    ConfirmText: this.$scope.Vm.L10N.Confirm,
                    ConfirmationType: Core.ConfirmationTypeEnum.Danger
                }).then(() => {
                    this.mirroringService.DeleteStoreMirror(entityId, userName, groupId, resetManagerForecasts).then(() => {

                        this.$scope.Model.IntervalGroup.CancelledByUser = userName;
                        this.$scope.Model.IntervalGroup.CancelledDate = moment().toDate().toLocaleDateString();
                        this.$scope.Model.IntervalGroup.OverallStatus = StoreMirrorStatus.PendingCancellation;
                        this.$scope.Vm.StoreGroupIntervals = null;
                        (<IMirroringStoreControllerScope>$scope.$parent).CancelMirror(); 

                        });
                    });
            };

            $scope.Cancel = (): void => {
                this.$scope.NavigateTo(MirroringStoreStates.Stores);
            };

            $scope.SourceDateRangeBeforeTarget = (): boolean => {
                return true;
            };

            this.Initialize();
        }

        public Initialize(): void {
            this.InitHeader();

            if (!this.$scope.Vm.SelectedStoreGroupInterval) {
                this.$scope.Cancel();
            }

            this.$scope.Model.IntervalGroup = this.$scope.Vm.SelectedStoreGroupInterval;            
            this.SetSourceEntity();
            this.SetAdjustmentPercent();
            this.SetHourlyIntervals();
        }

        private InitHeader(): void {
            this.$scope.Header = <Core.Directives.IGridHeader> {
                Columns: [
                    { Title: this.$scope.Vm.L10N.TargetDate, Fields: ["TargetDateStartDate"] }
                    , { Title: this.$scope.Vm.L10N.SourceDate, Fields: ["SourceDateStartDate"] }
                    , { Title: this.$scope.Vm.L10N.AdditionalAdjustment, Fields: ["Adjustment"] }
                ]
                , OnSortEvent: (): void => {
                    this.$scope.Model.HourIntervals = this.$scope.Header.DefaultSort(this.$scope.Model.HourIntervals);
                }
                , DefaultSort: (data: any[]): any[]=> {
                    return data;
                }
                , IsAscending: true
            };
            this.$scope.Header.Selected = this.$scope.Header.Columns[0];
        }

        public SetSourceEntity(): void {
            var entityId = this.$scope.Model.IntervalGroup.SourceEntity.EntityId;

            var entity = this.entityService.Get(entityId).success((entity: Core.Api.Models.IEntityModel): void => {
                this.$scope.Model.SourceEntity = { EntityId: entity.Id, Name: entity.Name }
             });
        }

        public SetAdjustmentPercent(): void {
            if (this.$scope.Model.IntervalGroup.IsAllDay) {
                var adjustment = this.$scope.Model.IntervalGroup.Intervals[0].Adjustment;
                this.$scope.Model.IntervalGroup.Adjustment = adjustment;
                this.$scope.Model.IntervalGroup.AdjustmentPercent = "" + Math.round((adjustment - 1) * 100) + "%";
            }
        }

        public SetHourlyIntervals(): void {
            this.$scope.Model.HourIntervals = [];

            _.each(this.$scope.Model.IntervalGroup.Intervals, (interval) => {

                var myInterval: IMyStoreMirrorInterval = interval;
                myInterval.AdjustmentPercent = "" + Math.round((interval.Adjustment - 1) * 100);
                myInterval.TargetDateEndDate = moment(interval.TargetDateEnd).toDate();
                myInterval.TargetDateStartDate = moment(interval.TargetDateStart).toDate();
                myInterval.SourceDateStartDate = moment(interval.SourceDateStart).toDate();
                myInterval.SourceDateEndDate = moment(interval.SourceDateStart).toDate();

                this.$scope.Model.HourIntervals.push(myInterval);
            });
        }

        public IsTargetEndDateInFuture(): boolean {
            var result = moment().isBefore(this.$scope.Model.IntervalGroup.TargetDateEndDate, "day");

            return result;
        }

        public IsMirrorCancelled(): boolean {
            var result = this.$scope.Model.IntervalGroup.OverallStatus == StoreMirrorStatus.Cancelled;
            return result;
        }

        public IsMirrorPendingCancellation(): boolean {
            var result = this.$scope.Model.IntervalGroup.OverallStatus == StoreMirrorStatus.PendingCancellation;
            return result;
        }

        public IsMirrorPartiallyCompleted(): boolean {
            var result = this.$scope.Model.IntervalGroup.OverallStatus == StoreMirrorStatus.PartiallyCompleted;
            return result;
        }
    }

    export var mirroringStoresDetailsController = Core.NG.ForecastingModule.RegisterNamedController("MirroringStoresDetailsController", MirroringStoresDetailsController,
        Core.NG.$typedScope<IMirroringStoresDetailsControllerScope>(),
        Core.NG.$modal,
        Core.$popupMessageService,
        Forecasting.Services.$mirroringService,
        Core.Api.$entityService,
        Core.Auth.$authService,
        Core.$confirmationService,
        Core.Constants
        );
} 