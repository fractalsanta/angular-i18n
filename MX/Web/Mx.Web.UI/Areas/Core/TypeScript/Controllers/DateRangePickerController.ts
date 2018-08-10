module Core {
    "use strict";

    export interface IPickerMode {
        Mode: number;
    }

    interface IDateRangePickerControllerScope extends ng.IScope {

        Vm: {
            ActiveDate: Date;
            SelectedDates: Date[];
            CalendarStartingDay: number;
        };

        DateRange: Date[];
        ChangeRange: Function;
        IsUpdated: boolean;
        Title: string;
        State: IPickerMode;

        ModalInstance: ng.ui.bootstrap.IModalServiceInstance;

        Range(): void;
        Week(): void;
        Month(): void;

        Cancel(): void;

        OnStartDateTimeChange(date: Date): void;

        ToggleCalendarDisplay(): void;

        Translations: Api.Models.IL10N;
    }

    class DateRangePickerController {

        constructor(
            private $scope: IDateRangePickerControllerScope,
            modal: ng.ui.bootstrap.IModalService,
            translationService: ITranslationService,
            dateService: Core.Date.IDateService
            ) {

            $scope.State = $scope.State || { Mode: 0 };

            $scope.Vm = {
                ActiveDate: null,
                SelectedDates: [],
                CalendarStartingDay: 0
            }

            $scope.Translations = <Api.Models.IL10N>{};

            $scope.ToggleCalendarDisplay = (): void => {
                $scope.ModalInstance = modal.open({
                    templateUrl: "/Areas/Core/Templates/mx-date-range-dialog.html",
                    controller: DateRangePickerController,
                    windowClass: "datepicker",
                    scope: $scope
                });
            };

            $scope.Cancel = (): void => {
                $scope.ModalInstance.dismiss();
            };

            $scope.Range = () => {
                $scope.State.Mode = 0;
            };

            $scope.Week = () => {
                $scope.State.Mode = 1;
            };

            $scope.Month = () => {
                $scope.State.Mode = 2;
            };

            dateService.StartOfWeek(moment()).then(day => {
                $scope.Vm.CalendarStartingDay = day.weekday();
            });


            $scope.OnStartDateTimeChange = (date: Date) => {
                if ($scope.State.Mode === 1) {
                    var start = dateService.GetStartOfWeekDay(moment(date), $scope.Vm.CalendarStartingDay).toDate();
                    this.Apply(
                        start,
                        moment(start).add({ days: 6 }).toDate()
                    );
                    return;
                }
                if ($scope.State.Mode === 2) {
                    var sm = moment(date).startOf('month').toDate();
                    var em = moment(date).endOf('month').toDate();
                    console.log('month', sm, em);
                    this.Apply(sm, em);
                    return;
                }
                if ($scope.Vm.SelectedDates.length === 1) {
                    this.Apply(
                        $scope.Vm.SelectedDates[0],
                        date
                    );
                    return;
                }
            };

            translationService.GetTranslations().then((result: Core.Api.Models.ITranslations): void => {
                $scope.Translations = result.Core;
                if (! $scope.Title) {
                    $scope.Title = $scope.Translations.PickerTitle;
                }
            });
        }

        private Apply(start: Date, end: Date) {
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
        }
    }

    NG.CoreModule.RegisterNamedController("DateRangePickerController", DateRangePickerController,
        NG.$typedScope<IDateRangePickerControllerScope>(),
        NG.$modal,
        Core.$translation,
        Core.Date.$dateService
    );
}