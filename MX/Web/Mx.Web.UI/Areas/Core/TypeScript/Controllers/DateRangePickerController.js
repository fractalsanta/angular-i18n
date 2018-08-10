var Core;
(function (Core) {
    "use strict";
    var DateRangePickerController = (function () {
        function DateRangePickerController($scope, modal, translationService, dateService) {
            var _this = this;
            this.$scope = $scope;
            $scope.State = $scope.State || { Mode: 0 };
            $scope.Vm = {
                ActiveDate: null,
                SelectedDates: [],
                CalendarStartingDay: 0
            };
            $scope.Translations = {};
            $scope.ToggleCalendarDisplay = function () {
                $scope.ModalInstance = modal.open({
                    templateUrl: "/Areas/Core/Templates/mx-date-range-dialog.html",
                    controller: DateRangePickerController,
                    windowClass: "datepicker",
                    scope: $scope
                });
            };
            $scope.Cancel = function () {
                $scope.ModalInstance.dismiss();
            };
            $scope.Range = function () {
                $scope.State.Mode = 0;
            };
            $scope.Week = function () {
                $scope.State.Mode = 1;
            };
            $scope.Month = function () {
                $scope.State.Mode = 2;
            };
            dateService.StartOfWeek(moment()).then(function (day) {
                $scope.Vm.CalendarStartingDay = day.weekday();
            });
            $scope.OnStartDateTimeChange = function (date) {
                if ($scope.State.Mode === 1) {
                    var start = dateService.GetStartOfWeekDay(moment(date), $scope.Vm.CalendarStartingDay).toDate();
                    _this.Apply(start, moment(start).add({ days: 6 }).toDate());
                    return;
                }
                if ($scope.State.Mode === 2) {
                    var sm = moment(date).startOf('month').toDate();
                    var em = moment(date).endOf('month').toDate();
                    console.log('month', sm, em);
                    _this.Apply(sm, em);
                    return;
                }
                if ($scope.Vm.SelectedDates.length === 1) {
                    _this.Apply($scope.Vm.SelectedDates[0], date);
                    return;
                }
            };
            translationService.GetTranslations().then(function (result) {
                $scope.Translations = result.Core;
                if (!$scope.Title) {
                    $scope.Title = $scope.Translations.PickerTitle;
                }
            });
        }
        DateRangePickerController.prototype.Apply = function (start, end) {
            var startvalue = moment(start);
            var endvalue = moment(end);
            if (startvalue.diff(endvalue) > 0) {
                startvalue = endvalue;
                endvalue = moment(start);
            }
            if (this.$scope.DateRange.length === 2) {
                if (startvalue.diff(moment(this.$scope.DateRange[0])) !== 0 ||
                    endvalue.diff(moment(this.$scope.DateRange[1])) !== 0) {
                    while (this.$scope.DateRange.length > 0) {
                        this.$scope.DateRange.shift();
                    }
                    this.$scope.DateRange.push(startvalue.toDate());
                    this.$scope.DateRange.push(endvalue.toDate());
                    this.$scope.ChangeRange();
                }
            }
            this.$scope.ModalInstance.close({ start: startvalue.toDate(), end: endvalue.toDate() });
        };
        return DateRangePickerController;
    }());
    Core.NG.CoreModule.RegisterNamedController("DateRangePickerController", DateRangePickerController, Core.NG.$typedScope(), Core.NG.$modal, Core.$translation, Core.Date.$dateService);
})(Core || (Core = {}));
