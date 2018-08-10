var Forecasting;
(function (Forecasting) {
    "use strict";
    var MirroringStoresDetailsController = (function () {
        function MirroringStoresDetailsController($scope, $modal, popupMessageService, mirroringService, entityService, authService, confirmService, constants) {
            var _this = this;
            this.$scope = $scope;
            this.$modal = $modal;
            this.popupMessageService = popupMessageService;
            this.mirroringService = mirroringService;
            this.entityService = entityService;
            this.authService = authService;
            this.confirmService = confirmService;
            this.constants = constants;
            $scope.IsReadOnly = function () {
                return true;
            };
            $scope.ShowCancelMirrorButton = function () {
                var result = _this.IsTargetEndDateInFuture() &&
                    !_this.IsMirrorCancelled() &&
                    !_this.IsMirrorPendingCancellation() &&
                    !_this.IsMirrorPartiallyCompleted();
                return result;
            };
            $scope.CancelMirror = function () {
                var entityId = authService.GetUser().BusinessUser.MobileSettings.EntityId, userName = authService.GetUser().BusinessUser.UserName, groupId = _this.$scope.Model.IntervalGroup.GroupId, resetManagerForecasts = _this.$scope.Model.IntervalGroup.OverwriteManager;
                _this.confirmService.Confirm({
                    Title: _this.$scope.Vm.L10N.CancelMirror,
                    Message: _this.$scope.Vm.L10N.CancelStoreMirrorMessage,
                    ConfirmText: _this.$scope.Vm.L10N.Confirm,
                    ConfirmationType: Core.ConfirmationTypeEnum.Danger
                }).then(function () {
                    _this.mirroringService.DeleteStoreMirror(entityId, userName, groupId, resetManagerForecasts).then(function () {
                        _this.$scope.Model.IntervalGroup.CancelledByUser = userName;
                        _this.$scope.Model.IntervalGroup.CancelledDate = moment().toDate().toLocaleDateString();
                        _this.$scope.Model.IntervalGroup.OverallStatus = Forecasting.StoreMirrorStatus.PendingCancellation;
                        _this.$scope.Vm.StoreGroupIntervals = null;
                        $scope.$parent.CancelMirror();
                    });
                });
            };
            $scope.Cancel = function () {
                _this.$scope.NavigateTo(Forecasting.MirroringStoreStates.Stores);
            };
            $scope.SourceDateRangeBeforeTarget = function () {
                return true;
            };
            this.Initialize();
        }
        MirroringStoresDetailsController.prototype.Initialize = function () {
            this.InitHeader();
            if (!this.$scope.Vm.SelectedStoreGroupInterval) {
                this.$scope.Cancel();
            }
            this.$scope.Model.IntervalGroup = this.$scope.Vm.SelectedStoreGroupInterval;
            this.SetSourceEntity();
            this.SetAdjustmentPercent();
            this.SetHourlyIntervals();
        };
        MirroringStoresDetailsController.prototype.InitHeader = function () {
            var _this = this;
            this.$scope.Header = {
                Columns: [
                    { Title: this.$scope.Vm.L10N.TargetDate, Fields: ["TargetDateStartDate"] },
                    { Title: this.$scope.Vm.L10N.SourceDate, Fields: ["SourceDateStartDate"] },
                    { Title: this.$scope.Vm.L10N.AdditionalAdjustment, Fields: ["Adjustment"] }
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
        MirroringStoresDetailsController.prototype.SetSourceEntity = function () {
            var _this = this;
            var entityId = this.$scope.Model.IntervalGroup.SourceEntity.EntityId;
            var entity = this.entityService.Get(entityId).success(function (entity) {
                _this.$scope.Model.SourceEntity = { EntityId: entity.Id, Name: entity.Name };
            });
        };
        MirroringStoresDetailsController.prototype.SetAdjustmentPercent = function () {
            if (this.$scope.Model.IntervalGroup.IsAllDay) {
                var adjustment = this.$scope.Model.IntervalGroup.Intervals[0].Adjustment;
                this.$scope.Model.IntervalGroup.Adjustment = adjustment;
                this.$scope.Model.IntervalGroup.AdjustmentPercent = "" + Math.round((adjustment - 1) * 100) + "%";
            }
        };
        MirroringStoresDetailsController.prototype.SetHourlyIntervals = function () {
            var _this = this;
            this.$scope.Model.HourIntervals = [];
            _.each(this.$scope.Model.IntervalGroup.Intervals, function (interval) {
                var myInterval = interval;
                myInterval.AdjustmentPercent = "" + Math.round((interval.Adjustment - 1) * 100);
                myInterval.TargetDateEndDate = moment(interval.TargetDateEnd).toDate();
                myInterval.TargetDateStartDate = moment(interval.TargetDateStart).toDate();
                myInterval.SourceDateStartDate = moment(interval.SourceDateStart).toDate();
                myInterval.SourceDateEndDate = moment(interval.SourceDateStart).toDate();
                _this.$scope.Model.HourIntervals.push(myInterval);
            });
        };
        MirroringStoresDetailsController.prototype.IsTargetEndDateInFuture = function () {
            var result = moment().isBefore(this.$scope.Model.IntervalGroup.TargetDateEndDate, "day");
            return result;
        };
        MirroringStoresDetailsController.prototype.IsMirrorCancelled = function () {
            var result = this.$scope.Model.IntervalGroup.OverallStatus == Forecasting.StoreMirrorStatus.Cancelled;
            return result;
        };
        MirroringStoresDetailsController.prototype.IsMirrorPendingCancellation = function () {
            var result = this.$scope.Model.IntervalGroup.OverallStatus == Forecasting.StoreMirrorStatus.PendingCancellation;
            return result;
        };
        MirroringStoresDetailsController.prototype.IsMirrorPartiallyCompleted = function () {
            var result = this.$scope.Model.IntervalGroup.OverallStatus == Forecasting.StoreMirrorStatus.PartiallyCompleted;
            return result;
        };
        return MirroringStoresDetailsController;
    }());
    Forecasting.MirroringStoresDetailsController = MirroringStoresDetailsController;
    Forecasting.mirroringStoresDetailsController = Core.NG.ForecastingModule.RegisterNamedController("MirroringStoresDetailsController", MirroringStoresDetailsController, Core.NG.$typedScope(), Core.NG.$modal, Core.$popupMessageService, Forecasting.Services.$mirroringService, Core.Api.$entityService, Core.Auth.$authService, Core.$confirmationService, Core.Constants);
})(Forecasting || (Forecasting = {}));
