module Core {

    export interface IChangeWeekCallback {
        (startDate: Date, endDate: Date): void;
    }

    export interface IWeekModel {
        ActiveDate: Date;
        WeekStartDate: Date;
        WeekStartDateString: string;
        WeekEndDateString: string;        
        CalendarStartingDay: number;
        CalendarSelectedDay: Date;
        ShowCalendar: boolean;
        SelectedDates: number[];
    }

    export interface IWeekPickerScope extends ng.IScope {
        Vm: IWeekModel;
        DateOptions: ng.ui.bootstrap.IDatepickerConfig;
        ChangeDates: IChangeWeekCallback;
        SelectedDate: any;
        NextWeek(): void;
        PrevWeek(): void;
        ToggleCalendarDisplay(e: Event): void;
        OnStartDateTimeChange(date: Date): void;
    }

    export class WeekPickerController {

        constructor(
            private $scope: IWeekPickerScope,
            private dateService: Core.Date.IDateService,
            private constants: Core.IConstants) {


            $scope.DateOptions = {
                showWeeks: false
            };

            $scope.NextWeek = () => {
                var selectedWeekStartDay = this.dateService.GetStartOfWeekDay(moment($scope.Vm.ActiveDate).add('days', 7),
                    this.$scope.Vm.CalendarStartingDay);
                this.SetWeek(selectedWeekStartDay);
            }

            $scope.PrevWeek = () => {
                var selectedWeekStartDay = this.dateService.GetStartOfWeekDay(moment($scope.Vm.ActiveDate).add('days', -7),
                    this.$scope.Vm.CalendarStartingDay);
                this.SetWeek(selectedWeekStartDay);
            }

            $scope.ToggleCalendarDisplay = (e: Event) => {
                this.$scope.Vm.ShowCalendar = !this.$scope.Vm.ShowCalendar;
                e.preventDefault();
                e.stopPropagation();
            };

            $scope.OnStartDateTimeChange= (startDate: Date) => {
                var selectedWeekStartDay = this.dateService.GetStartOfWeekDay(moment(startDate),
                    this.$scope.Vm.CalendarStartingDay);
                this.SetWeek(selectedWeekStartDay);
            }

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

            this.dateService.StartOfWeek(moment()).then(day => {
                this.$scope.Vm.CalendarStartingDay = day.weekday();
            });

            if ($scope.SelectedDate) {
                var date = moment($scope.SelectedDate);
                this.SetBeginning(date);
            } else {
                this.dateService.GetEntityCurrentBusinessDay().then(result => {
                    $scope.SelectedDate = result;
                    this.SetBeginning(result);
                });
            }
        }

        private SetBeginning(date: Moment) {
            this.dateService.StartOfWeek(date).then(day => {
                this.$scope.Vm.CalendarStartingDay = day.weekday();
                var selectedWeekStartDay = this.dateService.GetStartOfWeekDay(moment(date),
                    this.$scope.Vm.CalendarStartingDay);
                this.SetWeek(selectedWeekStartDay);
            });
        }

        private SetWeek(selectedDate: Moment) {
            this.$scope.Vm.ActiveDate = selectedDate.toDate();
            var weekEndDate = moment(selectedDate).add({ days: 6 });

            // Highlight row... Skips first day of week because of selection logic being run which highlights first day
            // (and deselects first day if you set it)
            this.$scope.Vm.SelectedDates = [];
            var date: Moment;
            for (var i = 1; i < 7; i++) {
                date = moment(selectedDate).add({ days: i });
                this.$scope.Vm.SelectedDates.push(date.toDate().setHours(0, 0, 0, 0));
            }

            this.$scope.Vm.WeekStartDateString = selectedDate.format(this.constants.DateCompactFormat);
            this.$scope.Vm.WeekEndDateString = weekEndDate.format(this.constants.DateCompactFormat);
            this.$scope.ChangeDates(selectedDate.toDate(), weekEndDate.toDate());
        }
    }

    NG.CoreModule.RegisterNamedController("WeekPickerController", WeekPickerController,
        NG.$typedScope<IWeekPickerScope>(),
        Core.Date.$dateService,
        Core.Constants
    );
}