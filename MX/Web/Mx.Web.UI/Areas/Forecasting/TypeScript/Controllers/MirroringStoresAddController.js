var Forecasting;
(function (Forecasting) {
    "use strict";
    var MirroringStoresAddController = (function () {
        function MirroringStoresAddController($scope, $modal, popupMessageService, confirmationService, mirroringService, entityService, authService, constants) {
            var _this = this;
            this.$scope = $scope;
            this.$modal = $modal;
            this.popupMessageService = popupMessageService;
            this.confirmationService = confirmationService;
            this.mirroringService = mirroringService;
            this.entityService = entityService;
            this.authService = authService;
            this.constants = constants;
            $scope.ShowStoreSelector = function () {
                return _this.authService.GetUser().BusinessUser.AssignedLocations.length > 1;
            };
            $scope.OnAdjustmentChange = function (interval) {
                interval.Adjustment =
                    mirroringService.CalculateAdjustment(parseInt(interval.AdjustmentPercent, 10) || 0);
            };
            $scope.OnAdjustmentBlur = function (interval) {
                if (interval.AdjustmentPercent === "%") {
                    interval.AdjustmentPercent = "0%";
                }
            };
            $scope.IsDirty = function () {
                var intervalGroup = $scope.Model.IntervalGroup;
                if ($scope.Model.SourceEntity) {
                    return true;
                }
                if (intervalGroup.TargetDateStartDate) {
                    return true;
                }
                if (intervalGroup.SourceDateStartDate) {
                    return true;
                }
                if (intervalGroup.Adjustment !== 1) {
                    return true;
                }
                return false;
            };
            $scope.IsValid = function () {
                var intervalGroup = $scope.Model.IntervalGroup;
                if ($scope.Model.IntervalGroup.IsAllDay) {
                    return $scope.Model.SourceEntity &&
                        intervalGroup.TargetDateStartDate != null &&
                        intervalGroup.TargetDateEndDate != null &&
                        intervalGroup.SourceDateStartDate != null;
                }
                else {
                    return $scope.Model.SourceEntity &&
                        intervalGroup.TargetDateStartDate != null &&
                        intervalGroup.SourceDateStartDate != null &&
                        $scope.Model.HourIntervals.length > 0;
                }
            };
            $scope.Cancel = function () {
                if ($scope.IsDirty()) {
                    confirmationService.Confirm({
                        Title: _this.$scope.Vm.L10N.MirrorCancelTitle,
                        Message: _this.$scope.Vm.L10N.MirrorCancelStoreMessage,
                        ConfirmText: _this.$scope.Vm.L10N.MirrorCancelConfirm,
                        ConfirmationType: Core.ConfirmationTypeEnum.Positive
                    }).then(function (result) {
                        if (result) {
                            _this.$scope.NavigateTo(Forecasting.MirroringStoreStates.Stores);
                        }
                    });
                }
                else {
                    _this.$scope.NavigateTo(Forecasting.MirroringStoreStates.Stores);
                }
            };
            $scope.Save = function () {
                confirmationService.Confirm({
                    Title: _this.$scope.Vm.L10N.SaveMirrorTitle,
                    Message: _this.$scope.Vm.L10N.SaveStoreMirrorMessage,
                    ConfirmText: _this.$scope.Vm.L10N.Save,
                    ConfirmationType: Core.ConfirmationTypeEnum.Positive
                }).then(function (overwrite) {
                    if (overwrite) {
                        var group = _.cloneDeep(_this.$scope.Model.IntervalGroup);
                        if (_this.$scope.Model.IntervalGroup.IsAllDay) {
                            group.Intervals.push({
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
                        }
                        else {
                            group.Intervals = _this.$scope.Model.HourIntervals;
                        }
                        $scope.$parent.Save(group);
                    }
                });
            };
            $scope.SelectSourceEntity = function () {
                _this.OpenSelectEntityDialog()
                    .then(function (entity) {
                    $scope.Model.SourceEntity = { EntityId: entity.Id, Name: entity.Name };
                    _.forEach($scope.Model.HourIntervals, function (interval) {
                        interval.SourceEntity = $scope.Model.SourceEntity;
                    });
                });
            };
            $scope.OpenTargetDateRangeDialog = function (options) {
                var intervalGroup = $scope.Model.IntervalGroup;
                $scope.OpenDateRangeDialog(intervalGroup.TargetDateStartDate, intervalGroup.TargetDateEndDate, options.Min, options.Max, false)
                    .then(function (result) {
                    intervalGroup.TargetDateStartDate = result.StartDate;
                    intervalGroup.TargetDateEndDate = result.EndDate;
                    intervalGroup.SourceDateStartDate = null;
                    $scope.Model.SourceDateOptions.Max = mirroringService.CalculateDates(intervalGroup);
                });
            };
            $scope.OpenSourceStartDateDialog = function (e) {
                e.preventDefault();
                e.stopPropagation();
                if (!$scope.Model.IntervalGroup.IsAllDay) {
                    $scope.Model.IntervalGroup.TargetDateEndDate = $scope.Model.IntervalGroup.TargetDateStartDate;
                    $scope.Model.SourceDateOptions.Max = mirroringService.CalculateDates($scope.Model.IntervalGroup);
                }
                $scope.Model.SourceDateOptions.Open = true;
            };
            $scope.OpenTargetDateDialog = function (e) {
                e.preventDefault();
                e.stopPropagation();
                $scope.Model.SourceDateOptions.Open = false;
                $scope.Model.TargetDateOptions.Open = true;
            };
            $scope.OnSourceDateChange = function () {
                $scope.Model.SourceDateOptions.Open = false;
                $scope.Model.SourceDateOptions.Max = mirroringService.CalculateDates($scope.Model.IntervalGroup);
            };
            $scope.OnTargetDateChange = function () {
                $scope.Model.TargetDateOptions.Open = false;
                $scope.Model.IntervalGroup.TargetDateEndDate = $scope.Model.IntervalGroup.TargetDateStartDate;
                $scope.Model.SourceDateOptions.Max = mirroringService.CalculateDates($scope.Model.IntervalGroup);
            };
            $scope.UpdateTargetHour = function (increment) {
                var newMoment = _this.UpdateHour($scope.Model.NewTargetHour, $scope.Model.NewTargetAmPm, increment);
                var hour = newMoment.get("hour");
                if (hour >= 12) {
                    if (hour > 12) {
                        hour = hour % 12;
                    }
                    $scope.Model.NewTargetAmPm = "Pm";
                }
                else {
                    $scope.Model.NewTargetAmPm = "Am";
                }
                if (hour === 0) {
                    hour = 12;
                }
                $scope.Model.NewTargetHour = hour.toString();
            };
            $scope.UpdateSourceHour = function (increment) {
                var newMoment = _this.UpdateHour($scope.Model.NewSourceHour, $scope.Model.NewSourceAmPm, increment);
                var hour = newMoment.get("hour");
                if (hour >= 12) {
                    if (hour > 12) {
                        hour = hour % 12;
                    }
                    $scope.Model.NewSourceAmPm = "Pm";
                }
                else {
                    $scope.Model.NewSourceAmPm = "Am";
                }
                if (hour === 0) {
                    hour = 12;
                }
                $scope.Model.NewSourceHour = hour.toString();
            };
            $scope.AddHourInterval = function () {
                var targetStartDate = _this.GetMoment($scope.Model.IntervalGroup.TargetDateStartDate, $scope.Model.NewTargetHour, $scope.Model.NewTargetAmPm);
                var targetEndDate = targetStartDate.clone();
                targetEndDate.add({ hours: 1 });
                var sourceStartDate = _this.GetMoment($scope.Model.IntervalGroup.SourceDateStartDate, $scope.Model.NewSourceHour, $scope.Model.NewSourceAmPm);
                var sourceEndDate = sourceStartDate.clone();
                sourceEndDate.add({ hours: 1 });
                var interval = {
                    Adjustment: 0,
                    AdjustmentPercent: "0",
                    GroupId: null,
                    Id: null,
                    TargetDateStartDate: targetStartDate.toDate(),
                    TargetDateEndDate: targetEndDate.toDate(),
                    SourceDateStartDate: sourceStartDate.toDate(),
                    SourceDateEndDate: sourceEndDate.toDate(),
                    TargetDateStart: targetStartDate.format(_this.constants.InternalDateTimeFormat),
                    TargetDateEnd: targetEndDate.format(_this.constants.InternalDateTimeFormat),
                    SourceDateStart: sourceStartDate.format(_this.constants.InternalDateTimeFormat),
                    SourceEndDate: sourceEndDate.format(_this.constants.InternalDateTimeFormat),
                    SourceEntity: $scope.Model.SourceEntity,
                    TargetEntity: { EntityId: authService.GetUser().BusinessUser.MobileSettings.EntityId },
                    IsCorporateMirror: false,
                    OverwriteManager: false
                };
                $scope.Model.HourIntervals.push(interval);
                $scope.UpdateTargetHour(1);
                $scope.UpdateSourceHour(1);
            };
            $scope.RemoveHourInterval = function (index) {
                $scope.Model.HourIntervals.splice(index, 1);
            };
            $scope.CanAddHourInterval = function () {
                if (!$scope.Model.IntervalGroup.TargetDateStartDate ||
                    !$scope.Model.IntervalGroup.SourceDateStartDate ||
                    !$scope.Model.SourceEntity) {
                    return false;
                }
                var targetStartDate = _this.GetMoment($scope.Model.IntervalGroup.TargetDateStartDate, $scope.Model.NewTargetHour, $scope.Model.NewTargetAmPm);
                return !_.any($scope.Model.HourIntervals, function (interval) {
                    return moment(interval.TargetDateStartDate).isSame(targetStartDate);
                });
            };
            this.Initialize();
        }
        MirroringStoresAddController.prototype.GetMoment = function (d, h, ampm) {
            var hour = parseInt(h, 10);
            if (hour === 12) {
                hour = 0;
            }
            if (ampm === "Pm") {
                hour += 12;
            }
            return moment(d).startOf("day").add({ hours: hour });
        };
        MirroringStoresAddController.prototype.Initialize = function () {
            this.InitHeader();
            this.$scope.Model = {
                IntervalGroup: {
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
        };
        MirroringStoresAddController.prototype.GetStores = function () {
            var _this = this;
            this.Stores = [];
            this.entityService.GetOpenEntities(this.authService.GetUser().BusinessUser.Id)
                .success(function (result) {
                _this.Stores = result;
            });
        };
        MirroringStoresAddController.prototype.OpenSelectEntityDialog = function () {
            var _this = this;
            var modalInstance = this.$modal.open({
                templateUrl: "/Areas/Forecasting/Templates/SelectStoreDialog.html",
                controller: "Forecasting.SelectStoreController",
                windowClass: "modal-transparent",
                resolve: {
                    Stores: function () {
                        return _this.Stores;
                    }
                }
            });
            return modalInstance.result;
        };
        MirroringStoresAddController.prototype.UpdateHour = function (h, ampm, increment) {
            var today = moment().toDate();
            var newMoment = this.GetMoment(today, h, ampm);
            newMoment.add({ hours: increment });
            newMoment = newMoment.min(moment().startOf("day"));
            newMoment = newMoment.max(moment().endOf("day"));
            return newMoment;
        };
        MirroringStoresAddController.prototype.InitHeader = function () {
            var _this = this;
            this.$scope.Header = {
                Columns: [
                    { Title: this.$scope.Vm.L10N.TargetDate, Fields: ["TargetDateStartDate"] },
                    { Title: this.$scope.Vm.L10N.SourceDate, Fields: ["SourceDateStartDate"] },
                    { Title: this.$scope.Vm.L10N.AdditionalAdjustment, Fields: ["Adjustment"] },
                    { Title: "" }
                ],
                OnSortEvent: function () {
                    _this.$scope.Model.HourIntervals = _this.$scope.Header.DefaultSort(_this.$scope.Model.HourIntervals);
                },
                DefaultSort: function (data) {
                    return data;
                },
                IsAscending: true
            };
            this.$scope.Header.Selected = this.$scope.Header.Columns[0];
        };
        return MirroringStoresAddController;
    }());
    Forecasting.MirroringStoresAddController = MirroringStoresAddController;
    Forecasting.mirroringStoresAddController = Core.NG.ForecastingModule.RegisterNamedController("MirroringStoresAddController", MirroringStoresAddController, Core.NG.$typedScope(), Core.NG.$modal, Core.$popupMessageService, Core.$confirmationService, Forecasting.Services.$mirroringService, Core.Api.$entityService, Core.Auth.$authService, Core.Constants);
})(Forecasting || (Forecasting = {}));
