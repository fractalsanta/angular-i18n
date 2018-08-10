module Workforce.MyTimeCard {

    class MyTimeCardController {

        constructor(
            private scope: IMyTimeCardControllerScope,
            private translationService: Core.ITranslationService,
            private timeCardService: IMyTimeCardService,
            private popupService: Core.IPopupMessageService,
            private dateService: Core.Date.IDateService,
            private constants: Core.IConstants
            ) {

            scope.Vm = { Days: [], WeekStart: null, WeekEnd: null, WeekStartString: null, WeekEndString: null };

            this.scope.ChangeDates = (startDate: Date, endDate: Date): void => { this.SetWeek(startDate, endDate); };

            translationService.GetTranslations().then((l10NData) => {
                var loc = l10NData.WorkforceMyTimeCard;
                scope.L10N = loc;
                scope.GetDescription = (b: IBreak) => {
                    var type = b.IsPaid ? loc.Paid : loc.Unpaid;
                    type += " " + (b.Type == Api.Models.BreakType.Meal ? loc.Meal : loc.Rest);
                    type += " " + loc.Break;
                    return type;
                }

                scope.FormatHours = day => loc.HoursFormat.format(this.RoundHours(day.TotalHours));
                scope.GetTotalHours = (days: IDayEntry[]) => {
                    var reduced = _.reduce(days, (m: number, day: IDayEntry) => m + day.TotalHours, 0);
                    return this.RoundHours(reduced).toString();
                };
                popupService.SetPageTitle(loc.MyTimeCard);
            });

            dateService.StartOfWeek(moment()).then(day => {
                this.SetWeek(day.toDate(), moment(day).add('d',6).toDate());
            });
        }

        SetWeek(start: Date, end: Date) {

            this.timeCardService.GetTimeCards(moment(start), moment(end)).then(result => {
               this.scope.Vm.Days = result;
            });
        }

        RoundHours(hours: number): number {
            return Math.round(hours * 100) / 100;
        }

    }

    Core.NG.WorkforceMyTimeCardModule.RegisterRouteController("", "Templates/MyTimeCard.html", MyTimeCardController,
        Core.NG.$typedScope<IMyTimeCardControllerScope>(),
        Core.$translation,
        myTimeCardService,
        Core.$popupMessageService,
        Core.Date.$dateService,
        Core.Constants
        );

}