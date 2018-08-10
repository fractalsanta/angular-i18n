var Core;
(function (Core) {
    var Directives;
    (function (Directives) {
        "use strict";
        var MxDateRangeController = (function () {
            function MxDateRangeController($scope, translationService, $modal) {
                var _this = this;
                this.$scope = $scope;
                this._daysBetween = 14;
                if ($scope.Days) {
                    this._daysBetween = Number($scope.Days);
                }
                else {
                    $scope.Days = this._daysBetween.toString();
                }
                $scope.Model = { FilterText: '' };
                if ($scope.Dates) {
                    if (!$scope.Dates.EndDate) {
                        $scope.Dates.EndDate = moment().toDate();
                    }
                    if (!$scope.Dates.StartDate) {
                        $scope.Dates.StartDate = moment().subtract({ days: this._daysBetween }).toDate();
                    }
                }
                else {
                    $scope.Dates = {
                        EndDate: moment().toDate(),
                        StartDate: moment().subtract({ days: this._daysBetween }).toDate()
                    };
                }
                $scope.FilterLast = function () {
                    $scope.Model.FilterText = $scope.Translations.Last + " " + _this._daysBetween + " " + $scope.Translations.Days;
                    $scope.Dates.EndDate = moment().toDate();
                    $scope.Dates.StartDate = moment().subtract({ days: _this._daysBetween }).toDate();
                    $scope.ChangeDates();
                    _this._customRange = null;
                };
                $scope.OpenCustomRangeDialog = function () {
                    var modalInstance = $modal.open({
                        templateUrl: "/Areas/Core/Templates/mx-date-range.html",
                        controller: "Core.DateRangeController",
                        windowClass: "wide-sm",
                        resolve: {
                            dateRange: function () { return _this._customRange; },
                            minMaxDateRange: function () { return _this.$scope.MinMaxDates; },
                            dateRangeOptions: function () {
                                return { SetDefaultDates: true };
                            }
                        }
                    });
                    modalInstance.result.then(function (result) {
                        var startDate = moment(result.StartDate);
                        var endDate = moment(result.EndDate);
                        var format = "MMM D, YYYY";
                        _this._customRange = result;
                        $scope.Dates.StartDate = startDate.toDate();
                        $scope.Dates.EndDate = endDate.toDate();
                        $scope.Model.FilterText = startDate.format(format) + " - " + endDate.format(format);
                        $scope.ChangeDates();
                    });
                };
                translationService.GetTranslations().then(function (result) {
                    $scope.Translations = result.Core;
                    $scope.FilterLast();
                });
            }
            return MxDateRangeController;
        }());
        Core.NG.CoreModule.RegisterNamedController("MxDateRangeController", MxDateRangeController, Core.NG.$typedScope(), Core.$translation, Core.NG.$modal);
        var MxDateRangeDirective = (function () {
            function MxDateRangeDirective() {
                return {
                    restrict: "E",
                    scope: {
                        Dates: "=dates",
                        MinMaxDates: "=minmaxdates",
                        Days: "@days",
                        ChangeDates: "&change"
                    },
                    replace: true,
                    templateUrl: "/Areas/Core/Templates/mx-date-range-directive.html",
                    controller: "Core.MxDateRangeController"
                };
            }
            return MxDateRangeDirective;
        }());
        Core.NG.CoreModule.RegisterDirective("mxDateRange", MxDateRangeDirective);
    })(Directives = Core.Directives || (Core.Directives = {}));
})(Core || (Core = {}));
