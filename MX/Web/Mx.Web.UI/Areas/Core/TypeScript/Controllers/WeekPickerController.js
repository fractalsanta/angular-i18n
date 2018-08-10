var Core;
(function (Core) {
    var WeekPickerController = (function () {
        function WeekPickerController($scope, dateService, constants) {
            var _this = this;
            this.$scope = $scope;
            this.dateService = dateService;
            this.constants = constants;
            $scope.DateOptions = {
                showWeeks: false
            };
            $scope.NextWeek = function () {
                var selectedWeekStartDay = _this.dateService.GetStartOfWeekDay(moment($scope.Vm.ActiveDate).add('days', 7), _this.$scope.Vm.CalendarStartingDay);
                _this.SetWeek(selectedWeekStartDay);
            };
            $scope.PrevWeek = function () {
                var selectedWeekStartDay = _this.dateService.GetStartOfWeekDay(moment($scope.Vm.ActiveDate).add('days', -7), _this.$scope.Vm.CalendarStartingDay);
                _this.SetWeek(selectedWeekStartDay);
            };
            $scope.ToggleCalendarDisplay = function (e) {
                _this.$scope.Vm.ShowCalendar = !_this.$scope.Vm.ShowCalendar;
                e.preventDefault();
                e.stopPropagation();
            };
            $scope.OnStartDateTimeChange = function (startDate) {
                var selectedWeekStartDay = _this.dateService.GetStartOfWeekDay(moment(startDate), _this.$scope.Vm.CalendarStartingDay);
                _this.SetWeek(selectedWeekStartDay);
            };
            var today = moment().toDate();
            today.setHours(0, 0, 0, 0);
            $scope.Vm = {
                ActiveDate: null,
                WeekStartDate: null,
                WeekStartDateString: null,
                WeekEndDateString: null,
                CalendarSelectedDay: today,
                CalendarStartingDay: null,
                ShowCalendar: false,
                SelectedDates: []
            };
            this.dateService.StartOfWeek(moment()).then(function (day) {
                _this.$scope.Vm.CalendarStartingDay = day.weekday();
            });
            if ($scope.SelectedDate) {
                var date = moment($scope.SelectedDate);
                this.SetBeginning(date);
            }
            else {
                this.dateService.GetEntityCurrentBusinessDay().then(function (result) {
                    $scope.SelectedDate = result;
                    _this.SetBeginning(result);
                });
            }
        }
        WeekPickerController.prototype.SetBeginning = function (date) {
            var _this = this;
            this.dateService.StartOfWeek(date).then(function (day) {
                _this.$scope.Vm.CalendarStartingDay = day.weekday();
                var selectedWeekStartDay = _this.dateService.GetStartOfWeekDay(moment(date), _this.$scope.Vm.CalendarStartingDay);
                _this.SetWeek(selectedWeekStartDay);
            });
        };
        WeekPickerController.prototype.SetWeek = function (selectedDate) {
            this.$scope.Vm.ActiveDate = selectedDate.toDate();
            var weekEndDate = moment(selectedDate).add({ days: 6 });
            this.$scope.Vm.SelectedDates = [];
            var date;
            for (var i = 1; i < 7; i++) {
                date = moment(selectedDate).add({ days: i });
                this.$scope.Vm.SelectedDates.push(date.toDate().setHours(0, 0, 0, 0));
            }
            this.$scope.Vm.WeekStartDateString = selectedDate.format(this.constants.DateCompactFormat);
            this.$scope.Vm.WeekEndDateString = weekEndDate.format(this.constants.DateCompactFormat);
            this.$scope.ChangeDates(selectedDate.toDate(), weekEndDate.toDate());
        };
        return WeekPickerController;
    }());
    Core.WeekPickerController = WeekPickerController;
    Core.NG.CoreModule.RegisterNamedController("WeekPickerController", WeekPickerController, Core.NG.$typedScope(), Core.Date.$dateService, Core.Constants);
})(Core || (Core = {}));
