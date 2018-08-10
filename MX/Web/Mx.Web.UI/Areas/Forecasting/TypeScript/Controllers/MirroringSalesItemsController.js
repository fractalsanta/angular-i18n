var Forecasting;
(function (Forecasting) {
    "use strict";
    var MirroringSalesItemsController = (function () {
        function MirroringSalesItemsController($scope, popupMessageService, mirroringService, $timeout) {
            var _this = this;
            this.$scope = $scope;
            this.popupMessageService = popupMessageService;
            this.mirroringService = mirroringService;
            this.$timeout = $timeout;
            this._initialDays = 14;
            this.L10N = {};
            $scope.FilterIntervals = function () {
                var text = _this.$scope.Vm.FilterText, intervals = _this.$scope.Vm.SalesItemIntervals, filtered;
                filtered = _this.ApplySearchFilter(text, intervals);
                _this.$scope.Model.FilteredIntervals = filtered;
                _this.Header.OnSortEvent();
            };
            $scope.$watch("Vm.FilterText", function () {
                _this.$scope.FilterIntervals();
            }, true);
            $scope.Header = function () {
                return _this.Header;
            };
            $scope.$watch("Vm.L10N", function (newValue) {
                _this.L10N = newValue;
                _this.Header = _this.GetHeader();
                _this.$timeout(function () {
                    $(window).resize();
                });
            }, false);
            $scope.$watch("Vm.Dates", function (newValue, oldValue) {
                if (newValue && oldValue && (newValue.StartDate != oldValue.StartDate || newValue.EndDate != oldValue.EndDate)) {
                    _this.LoadData($scope.Vm.Dates);
                }
            }, true);
            $scope.OpenDateRange = function () {
                $scope.OpenDateRangeDialog($scope.Vm.Dates.StartDate, $scope.Vm.Dates.EndDate, moment("1970-1-1").toDate(), moment("3000-12-31").toDate(), false)
                    .then(function (result) {
                    $scope.Vm.Dates = result;
                });
            };
            this.Initialize();
        }
        MirroringSalesItemsController.prototype.Initialize = function () {
            this.Header = this.GetHeader();
            this.$scope.Vm.Dates = {
                StartDate: null,
                EndDate: null
            };
            this.$scope.Model = {};
            if (!this.$scope.Vm.SalesItemIntervals) {
                this.LoadData(this.$scope.Vm.Dates);
            }
            else {
                this.$scope.FilterIntervals();
            }
        };
        MirroringSalesItemsController.prototype.GetHeader = function () {
            var _this = this;
            var performSort = function () {
                _this.$scope.Model.FilteredIntervals = _this.Header.DefaultSort(_this.$scope.Model.FilteredIntervals);
            }, defaultSort = function (data) {
                return data;
            }, header = {
                Columns: [
                    { Title: this.L10N.TargetSalesItemCode, Fields: ["TargetSalesItem.Description"] },
                    { Title: this.L10N.MirrorDates, Fields: ["TargetDateStartDate"] },
                    { Title: this.L10N.Zone },
                    { Title: "" }
                ],
                OnSortEvent: performSort,
                DefaultSort: defaultSort,
                IsAscending: true
            };
            header.Selected = header.Columns[1];
            return header;
        };
        MirroringSalesItemsController.prototype.LoadData = function (dates) {
            var _this = this;
            var startDate = dates && dates.StartDate ? dates.StartDate : moment().add("d", -this._initialDays).toDate(), endDate = dates && dates.EndDate ? dates.EndDate : moment("3000-12-31").toDate();
            this.mirroringService.GetSalesItemMirrorIntervals(startDate, endDate)
                .success(function (intervals) {
                _.each(intervals, function (interval) {
                    _this.mirroringService.Cast(interval);
                });
                _this.$scope.Vm.SalesItemIntervals = intervals;
                _this.$scope.FilterIntervals();
            })
                .error(function (message, status) {
                _this.popupMessageService.ShowError(_this.$scope.Vm.L10N.Error + message);
            });
        };
        MirroringSalesItemsController.prototype.ApplySearchFilter = function (text, items) {
            var filtered = items;
            if (text) {
                var textEscaped = text.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), regex = new RegExp(textEscaped, "i");
                filtered = _.filter(items, function (item) {
                    if (item.TargetSalesItem && item.TargetSalesItem.Description.match(regex) != null) {
                        return true;
                    }
                    if (item.TargetSalesItem && ("(" + item.TargetSalesItem.ItemCode.toString() + ")").match(regex) != null) {
                        return true;
                    }
                    if (item.Zone && item.Zone.Name.match(regex) != null) {
                        return true;
                    }
                    return false;
                });
            }
            return filtered;
        };
        return MirroringSalesItemsController;
    }());
    Forecasting.MirroringSalesItemsController = MirroringSalesItemsController;
    Forecasting.mirroringSalesItemsController = Core.NG.ForecastingModule.RegisterNamedController("MirroringSalesItemsController", MirroringSalesItemsController, Core.NG.$typedScope(), Core.$popupMessageService, Forecasting.Services.$mirroringService, Core.NG.$timeout);
})(Forecasting || (Forecasting = {}));
