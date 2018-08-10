module Forecasting {
    "use strict";

    export interface IMirroringStoresAddControllerScope extends IMirroringStoreControllerScope {
        Model: {
            IntervalGroup: IMyStoreMirrorIntervalGroup;
            HourIntervals: IMyStoreMirrorInterval[];
            TargetDateOptions: any;
            SourceDateOptions: any;
            SourceEntity: IEntityViewModel;
            NewTargetHour: string;
            NewTargetAmPm: string;
            NewSourceHour: string;
            NewSourceAmPm: string;
        };
        ShowStoreSelector(): boolean;
        OnAdjustmentChange(interval: IMyStoreMirrorInterval): void;
        OnAdjustmentBlur(interval: IMyStoreMirrorInterval): void;
        SelectSourceEntity(): void;
        OpenSourceStartDateDialog(e: JQueryEventObject): void;
        OnTargetDateChange(): void;
        OnSourceDateChange(): void;
        OpenTargetDateDialog(e: JQueryEventObject): void;
        OpenTargetDateRangeDialog(options: any): void;
        IsDirty(): boolean;
        IsValid(): boolean;
        Save(): void;
        UpdateTargetHour(increment: number): void;
        UpdateSourceHour(increment: number): void;
        Header: Core.Directives.IGridHeader;
        AddHourInterval(): void;
        RemoveHourInterval(index: number): void;
        CanAddHourInterval(): boolean;
    }

    export class MirroringStoresAddController {
        private Stores: Core.Api.Models.IEntityModel[];

        constructor(
            private $scope: IMirroringStoresAddControllerScope,
            private $modal: ng.ui.bootstrap.IModalService,
            private popupMessageService: Core.IPopupMessageService,
            private confirmationService: Core.IConfirmationService,
            private mirroringService: Services.IMirroringService,
            private entityService: Core.Api.IEntityService,
            private authService: Core.Auth.IAuthService,
            private constants: Core.IConstants
            ) {
            // #region data

            $scope.ShowStoreSelector = (): boolean => {
                return this.authService.GetUser().BusinessUser.AssignedLocations.length > 1;
            };

            $scope.OnAdjustmentChange = (interval: IMyStoreMirrorInterval): void => {
                interval.Adjustment =
                mirroringService.CalculateAdjustment(
                    parseInt(interval.AdjustmentPercent, 10) || 0
                );
            };

            $scope.OnAdjustmentBlur = (interval: IMyStoreMirrorInterval): void => {
                if (interval.AdjustmentPercent === "%") {
                    interval.AdjustmentPercent = "0%";
                }
            };

            $scope.IsDirty = (): boolean => {
                var intervalGroup = $scope.Model.IntervalGroup;
                if ($scope.Model.SourceEntity) { return true; }
                if (intervalGroup.TargetDateStartDate) { return true; }
                if (intervalGroup.SourceDateStartDate) { return true; }
                if (intervalGroup.Adjustment !== 1) { return true; }

                return false;
            };

            $scope.IsValid = (): boolean => {
                var intervalGroup = $scope.Model.IntervalGroup;
                if ($scope.Model.IntervalGroup.IsAllDay) {
                    return $scope.Model.SourceEntity &&
                        intervalGroup.TargetDateStartDate != null &&
                        intervalGroup.TargetDateEndDate != null &&
                        intervalGroup.SourceDateStartDate != null;
                } else {
                    return $scope.Model.SourceEntity &&
                        intervalGroup.TargetDateStartDate != null &&
                        intervalGroup.SourceDateStartDate != null &&
                        $scope.Model.HourIntervals.length > 0;
                }
            };

            $scope.Cancel = (): void => {
                if ($scope.IsDirty()) {
                    confirmationService.Confirm({
                        Title: this.$scope.Vm.L10N.MirrorCancelTitle,
                        Message: this.$scope.Vm.L10N.MirrorCancelStoreMessage,
                        ConfirmText: this.$scope.Vm.L10N.MirrorCancelConfirm,
                        ConfirmationType: Core.ConfirmationTypeEnum.Positive
                    }).then((result): void => {
                        if (result) {
                            this.$scope.NavigateTo(MirroringStoreStates.Stores);
                        }
                    });
                } else {
                    this.$scope.NavigateTo(MirroringStoreStates.Stores);
                }
            };

            $scope.Save = (): void => {
                confirmationService.Confirm({
                    Title: this.$scope.Vm.L10N.SaveMirrorTitle,
                    Message: this.$scope.Vm.L10N.SaveStoreMirrorMessage,
                    ConfirmText: this.$scope.Vm.L10N.Save,
                    ConfirmationType: Core.ConfirmationTypeEnum.Positive
                }).then((overwrite: boolean): void => {
                    if (overwrite) {
                        var group = _.cloneDeep(this.$scope.Model.IntervalGroup);
                        if (this.$scope.Model.IntervalGroup.IsAllDay) {
                            group.Intervals.push(<IMyStoreMirrorInterval>{
                                Id: null,
                                GroupId: null,
                                SourceDateStart: group.SourceDateStart,
                                TargetDateStart: group.TargetDateStart,
                                TargetDateEnd: group.TargetDateEnd,
                                Adjustment: group.Adjustment,
                                AdjustmentPercent: group.AdjustmentPercent,
                                SourceEntity: { EntityId: $scope.Model.SourceEntity.EntityId },
                                TargetEntity: { EntityId: authService.GetUser().BusinessUser.MobileSettings.EntityId },
                                IsCorporateMirror: false,
                                OverwriteManager: group.OverwriteManager
                            });
                        } else {
                            group.Intervals = this.$scope.Model.HourIntervals;
                        }
                        (<IMirroringStoreControllerScope>$scope.$parent).Save(group);
                    }
                });
            };

            // #endregion

            $scope.SelectSourceEntity = (): void => {
                this.OpenSelectEntityDialog()
                    .then((entity: Core.Api.Models.IEntityModel): void => {
                        $scope.Model.SourceEntity = { EntityId: entity.Id, Name: entity.Name };
                        _.forEach($scope.Model.HourIntervals, (interval: IMyStoreMirrorInterval): void => {
                            interval.SourceEntity = $scope.Model.SourceEntity;
                        });
                    });
            };

            // #region dates

            $scope.OpenTargetDateRangeDialog = (options: any): void => {
                var intervalGroup = $scope.Model.IntervalGroup;

                $scope.OpenDateRangeDialog(
                    intervalGroup.TargetDateStartDate,
                    intervalGroup.TargetDateEndDate,
                    options.Min,
                    options.Max,
                    false)
                    .then((result: Core.IDateRange): void => {
                        intervalGroup.TargetDateStartDate = result.StartDate;
                        intervalGroup.TargetDateEndDate = result.EndDate;
                        intervalGroup.SourceDateStartDate = null;
                        $scope.Model.SourceDateOptions.Max = mirroringService.CalculateDates(intervalGroup);
                    });
            };

            $scope.OpenSourceStartDateDialog = (e: JQueryEventObject): void => {
                e.preventDefault();
                e.stopPropagation();

                if (!$scope.Model.IntervalGroup.IsAllDay) {
                    $scope.Model.IntervalGroup.TargetDateEndDate = $scope.Model.IntervalGroup.TargetDateStartDate;
                    $scope.Model.SourceDateOptions.Max = mirroringService.CalculateDates($scope.Model.IntervalGroup);
                }

                $scope.Model.SourceDateOptions.Open = true;
            };

            $scope.OpenTargetDateDialog = (e: JQueryEventObject): void => {
                e.preventDefault();
                e.stopPropagation();
                $scope.Model.SourceDateOptions.Open = false;
                $scope.Model.TargetDateOptions.Open = true;
            };

            $scope.OnSourceDateChange = (): void => {
                $scope.Model.SourceDateOptions.Open = false;
                $scope.Model.SourceDateOptions.Max = mirroringService.CalculateDates($scope.Model.IntervalGroup);
            };

            $scope.OnTargetDateChange = (): void => {
                $scope.Model.TargetDateOptions.Open = false;
                $scope.Model.IntervalGroup.TargetDateEndDate = $scope.Model.IntervalGroup.TargetDateStartDate;
                $scope.Model.SourceDateOptions.Max = mirroringService.CalculateDates($scope.Model.IntervalGroup);
            };
            // #endregion

            $scope.UpdateTargetHour = (increment: number): void => {
                var newMoment = this.UpdateHour($scope.Model.NewTargetHour, $scope.Model.NewTargetAmPm, increment);
                var hour = newMoment.get("hour");
                if (hour >= 12) {
                    if (hour > 12) {
                        hour = hour % 12;
                    }
                    $scope.Model.NewTargetAmPm = "Pm";
                } else {
                    $scope.Model.NewTargetAmPm = "Am";
                }
                if (hour === 0) {
                    hour = 12;
                }
                $scope.Model.NewTargetHour = hour.toString();
            };

            $scope.UpdateSourceHour = (increment: number): void => {
                var newMoment = this.UpdateHour($scope.Model.NewSourceHour, $scope.Model.NewSourceAmPm, increment);
                var hour = newMoment.get("hour");
                if (hour >= 12) {
                    if (hour > 12) {
                        hour = hour % 12;
                    }
                    $scope.Model.NewSourceAmPm = "Pm";
                } else {
                    $scope.Model.NewSourceAmPm = "Am";
                }
                if (hour === 0) {
                    hour = 12;
                }
                $scope.Model.NewSourceHour = hour.toString();
            };

            $scope.AddHourInterval = (): void => {
                var targetStartDate = this.GetMoment($scope.Model.IntervalGroup.TargetDateStartDate, $scope.Model.NewTargetHour, $scope.Model.NewTargetAmPm);
                var targetEndDate = targetStartDate.clone();
                targetEndDate.add({ hours: 1 });

                var sourceStartDate = this.GetMoment($scope.Model.IntervalGroup.SourceDateStartDate, $scope.Model.NewSourceHour, $scope.Model.NewSourceAmPm);
                var sourceEndDate = sourceStartDate.clone();
                sourceEndDate.add({ hours: 1 });

                var interval: IMyStoreMirrorInterval = <IMyStoreMirrorInterval>{
                    Adjustment: 0,
                    AdjustmentPercent: "0",
                    GroupId: null,
                    Id: null,
                    TargetDateStartDate: targetStartDate.toDate(),
                    TargetDateEndDate: targetEndDate.toDate(),
                    SourceDateStartDate: sourceStartDate.toDate(),
                    SourceDateEndDate: sourceEndDate.toDate(),
                    TargetDateStart: targetStartDate.format(this.constants.InternalDateTimeFormat),
                    TargetDateEnd: targetEndDate.format(this.constants.InternalDateTimeFormat),
                    SourceDateStart: sourceStartDate.format(this.constants.InternalDateTimeFormat),
                    SourceEndDate: sourceEndDate.format(this.constants.InternalDateTimeFormat),
                    SourceEntity: $scope.Model.SourceEntity,
                    TargetEntity: { EntityId: authService.GetUser().BusinessUser.MobileSettings.EntityId },
                    IsCorporateMirror: false,
                    OverwriteManager: false
                };

                $scope.Model.HourIntervals.push(interval);
                $scope.UpdateTargetHour(1);
                $scope.UpdateSourceHour(1);
            };

            $scope.RemoveHourInterval = (index: number): void => {
                $scope.Model.HourIntervals.splice(index, 1);
            };

            $scope.CanAddHourInterval = (): boolean => {
                if (!$scope.Model.IntervalGroup.TargetDateStartDate ||
                    !$scope.Model.IntervalGroup.SourceDateStartDate ||
                    !$scope.Model.SourceEntity) {
                    return false;
                }

                var targetStartDate = this.GetMoment($scope.Model.IntervalGroup.TargetDateStartDate, $scope.Model.NewTargetHour, $scope.Model.NewTargetAmPm);
                return !_.any($scope.Model.HourIntervals, (interval: IMyStoreMirrorInterval): boolean => {
                    return moment(interval.TargetDateStartDate).isSame(targetStartDate); 
                });
            };

            this.Initialize();
        }

        private GetMoment(d: Date, h: string, ampm: string): Moment {
            var hour: number = parseInt(h, 10);
            if (hour === 12) {
                hour = 0;
            }
            if (ampm === "Pm") {
                hour += 12;
            }
            return moment(d).startOf("day").add({ hours: hour });
        }

        public Initialize(): void {
            this.InitHeader();

            this.$scope.Model = {
                IntervalGroup: <Forecasting.IMyStoreMirrorIntervalGroup>{
                    Adjustment: 1,
                    GroupId: {},
                    Intervals: [],
                    IsAllDay: true,
                    OverwriteManager: true
                },
                HourIntervals: [],
                TargetDateOptions: {
                    Min: moment().add({ days: 1 }).toDate(),
                    Max: moment().add({ months: 13 }).toDate(),
                    Start: moment().add({ days: 1 }).toDate(),
                    End: moment().add({ days: 2 }).toDate()
                },
                SourceDateOptions: {
                    Open: false,
                    Min: moment().subtract({ months: 13 }),
                    Max: moment().subtract({ days: 1 })
                },
                SourceEntity: null,
                NewTargetHour: "9",
                NewSourceHour: "9",
                NewTargetAmPm: "Am",
                NewSourceAmPm: "Am"
            };

            if (this.authService.GetUser().BusinessUser.AssignedLocations.length === 1) {
                this.$scope.Model.SourceEntity = { EntityId: this.authService.GetUser().BusinessUser.AssignedLocations[0] };
            }

            this.$scope.Model.IntervalGroup.AdjustmentPercent = "0%";
            this.GetStores();

            this.$scope.Vm.SelectedStoreGroupInterval = this.$scope.Model.IntervalGroup;
        }

        private GetStores(): void {
            this.Stores = [];
            this.entityService.GetOpenEntities(this.authService.GetUser().BusinessUser.Id)
                .success((result: Core.Api.Models.IEntityModel[]): void => {
                    this.Stores = result;
                });
        }

        public OpenSelectEntityDialog(): ng.IPromise<any> {

            var modalInstance = this.$modal.open({
                templateUrl: "/Areas/Forecasting/Templates/SelectStoreDialog.html",
                controller: "Forecasting.SelectStoreController",
                windowClass: "modal-transparent",
                resolve: {
                    Stores: (): Core.Api.Models.IEntityModel[] => {
                        return this.Stores;
                    }
                }
        });

            return modalInstance.result;
        }

        private UpdateHour(h: string, ampm: string, increment: number): Moment {
            var today: Date = moment().toDate();
            var newMoment: Moment = this.GetMoment(today, h, ampm);
            newMoment.add({ hours: increment });
            newMoment = newMoment.min(moment().startOf("day"));
            newMoment = newMoment.max(moment().endOf("day"));
            return newMoment;
        }

        private InitHeader(): void {
            this.$scope.Header = <Core.Directives.IGridHeader> {
                Columns: [
                    { Title: this.$scope.Vm.L10N.TargetDate, Fields: ["TargetDateStartDate"] }
                    , { Title: this.$scope.Vm.L10N.SourceDate, Fields: ["SourceDateStartDate"] }
                    , { Title: this.$scope.Vm.L10N.AdditionalAdjustment, Fields: ["Adjustment"] }
                    , { Title: "" }
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
    }

    export var mirroringStoresAddController = Core.NG.ForecastingModule.RegisterNamedController("MirroringStoresAddController", MirroringStoresAddController,
        Core.NG.$typedScope<IMirroringStoresAddControllerScope>(),
        Core.NG.$modal,
        Core.$popupMessageService,
        Core.$confirmationService,
        Services.$mirroringService,
        Core.Api.$entityService,
        Core.Auth.$authService,
        Core.Constants
        );
}