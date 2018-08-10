var Forecasting;
(function (Forecasting) {
    "use strict";
    var MirroringStoresController = (function () {
        function MirroringStoresController($scope, popupMessageService, mirroringService, $timeout) {
            var _this = this;
            this.$scope = $scope;
            this.popupMessageService = popupMessageService;
            this.mirroringService = mirroringService;
            this.$timeout = $timeout;
            this.L10N = {};
            $scope.FilterIntervals = function () {
                var status = _this.$scope.Vm.FilterStatus, intervals = _this.$scope.Vm.StoreGroupIntervals, filtered;
                filtered = _this.ApplySearchFilter(status, intervals);
                _this.$scope.Model.FilteredIntervals = filtered;
                _this.GetHeader().OnSortEvent();
            };
            $scope.GroupStatusOptions = function () {
                return _this.GroupStatusOptions;
            };
            $scope.ChangeGroupStatus = function () {
                _this.LoadData($scope.Vm.FilterStatus);
            };
            $scope.Header = function () {
                return _this.Header;
            };
            $scope.StatusMap = function () {
                return _this.StatusMap;
            };
            $scope.$watch("Vm.L10N", function (newValue) {
                _this.L10N = newValue;
                _this.Header = _this.GetHeader();
                _this.GroupStatusOptions = _this.GetGroupStatusOptions();
                _this.StatusMap = _this.GetStatusMap();
                _this.$timeout(function () {
                    $(window).resize();
                });
            }, false);
            this.Initialize();
        }
        MirroringStoresController.prototype.Initialize = function () {
            this.Header = this.GetHeader();
            this.$scope.Model = {};
            if (!this.$scope.Vm.StoreGroupIntervals) {
                this.LoadData(this.$scope.Vm.FilterStatus);
            }
            else {
                this.$scope.FilterIntervals();
            }
        };
        MirroringStoresController.prototype.GetHeader = function () {
            var _this = this;
            var performSort = function () {
                _this.$scope.Model.FilteredIntervals = _this.Header.DefaultSort(_this.$scope.Model.FilteredIntervals);
            }, defaultSort = function (data) {
                return data;
            }, header = {
                Columns: [
                    { Title: this.L10N.Status, Fields: ["Status"] },
                    { Title: this.L10N.MirrorDates, Fields: ["TargetDateStartDate"] },
                    { Title: "" }
                ],
                OnSortEvent: performSort,
                DefaultSort: defaultSort,
                IsAscending: true
            };
            header.Selected = header.Columns[1];
            return header;
        };
        MirroringStoresController.prototype.GetGroupStatusOptions = function () {
            return [
                { Value: Forecasting.StoreMirrorStatusGroup.Active, Title: this.L10N.Active },
                { Value: Forecasting.StoreMirrorStatusGroup.Cancelled, Title: this.L10N.Cancelled },
                { Value: Forecasting.StoreMirrorStatusGroup.Completed, Title: this.L10N.Completed },
                { Value: Forecasting.StoreMirrorStatusGroup.Everything, Title: this.L10N.All }
            ];
        };
        MirroringStoresController.prototype.GetStatusMap = function () {
            var map = {};
            map[Forecasting.StoreMirrorStatus.Completed] = this.L10N.Completed;
            map[Forecasting.StoreMirrorStatus.InProgress] = this.L10N.InProgress;
            map[Forecasting.StoreMirrorStatus.Scheduled] = this.L10N.Scheduled;
            map[Forecasting.StoreMirrorStatus.Cancelled] = this.L10N.Cancelled;
            map[Forecasting.StoreMirrorStatus.PendingCancellation] = this.L10N.PendingCancellation;
            map[Forecasting.StoreMirrorStatus.PartiallyCompleted] = this.L10N.PartiallyCompleted;
            return map;
        };
        MirroringStoresController.prototype.LoadData = function (status) {
            var _this = this;
            this.mirroringService.GetStoreMirrorIntervals(this.$scope.Vm.EntityId, status)
                .success(function (intervals) {
                _.each(intervals, function (interval) {
                    _this.mirroringService.Cast(interval);
                });
                _this.$scope.Vm.StoreGroupIntervals = intervals;
                _this.$scope.FilterIntervals();
            })
                .error(function (message, status) {
                _this.popupMessageService.ShowError(_this.$scope.Vm.L10N.Error + message);
            });
        };
        MirroringStoresController.prototype.ApplySearchFilter = function (status, intervals) {
            var filtered = intervals;
            if (status) {
                filtered = _.filter(intervals, function (interval) {
                    if (status === Forecasting.StoreMirrorStatusGroup.Everything || interval.OverallStatusGroup === status) {
                        return true;
                    }
                    return false;
                });
            }
            return filtered;
        };
        return MirroringStoresController;
    }());
    Forecasting.MirroringStoresController = MirroringStoresController;
    Forecasting.mirroringStoresController = Core.NG.ForecastingModule.RegisterNamedController("MirroringStoresController", MirroringStoresController, Core.NG.$typedScope(), Core.$popupMessageService, Forecasting.Services.$mirroringService, Core.NG.$timeout);
})(Forecasting || (Forecasting = {}));
