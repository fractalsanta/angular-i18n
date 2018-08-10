module Workforce.MyAvailability {

    interface IMyAvailabilityEditControllerScope extends ng.IScope {
        L10N: Api.Models.IL10N;
        Title: string;
        Cancel(): void;
        Save(): void;
        GetSelectedMyAvailabilityDay(): Api.Models.IDayAvailability;
        Vm: IMyAvailabilityEntry;
        TimesValid(testTime: IMyAvailabilityEntry, translations: Workforce.MyAvailability.Api.Models.IL10N): boolean;
    }

    class MyAvailabilityEditController {

        private originalTimes: Workforce.MyAvailability.Api.Models.ITimeRange[];
        private saveTime: Workforce.MyAvailability.Api.Models.ITimeRange;

        constructor(
            private scope: IMyAvailabilityEditControllerScope,
            private myAvailabilityService: IMyAvailabilityService,
            private translationService: Core.ITranslationService,
            popup: Core.IPopupMessageService,
            private constants: Core.IConstants,
            dateService: Core.Date.IDateService,
            private modal: ng.ui.bootstrap.IModalServiceInstance,
            day: Api.Models.IDayAvailability,
            time: Api.Models.ITimeRange
        ) {

            this.originalTimes = _.without(day.Times, time);

            scope.Vm = {
                IsAllDay: time.IsAllDay,
                StartTime: moment(time.Start),
                EndTime: moment(time.End)
            };

            translationService.GetTranslations().then((l10NData) => {
                scope.L10N = l10NData.WorkforceMyAvailability;
                scope.Title = l10NData.WorkforceMyAvailability.EditAvailability;
            });

            scope.GetSelectedMyAvailabilityDay = () => {
                return day;
            }

            scope.Cancel = (): void => modal.dismiss();
            scope.Save = (): void => {
                if (!scope.TimesValid(scope.Vm, scope.L10N)) {
                    return;
                }
                this.saveTime = myAvailabilityService.GetTime(scope.Vm, constants);

                var newTimes: Workforce.MyAvailability.Api.Models.ITimeRange[] = [];
                // Clear times array if all day...
                if (! this.saveTime.IsAllDay) {
                    newTimes = _.clone(this.originalTimes);
                }
                newTimes.push(this.saveTime);

                if (dateService.IsOverlapping(myAvailabilityService.MapTimeRange(newTimes))) {
                    popup.ShowError(scope.L10N.OverLappingTimes);
                    return;
                }
                day.Times = myAvailabilityService.SortTimes(newTimes);
                this.myAvailabilityService.UpdateMyAvailabilityDay(day)
                    .then(() => {
                        modal.dismiss();
                    },
                    () => {
                        var restore = _.clone(this.originalTimes);
                        restore.push(time);
                        day.Times = myAvailabilityService.SortTimes(restore);

                    });
            }
            scope.TimesValid = (testTime:IMyAvailabilityEntry, translations:Workforce.MyAvailability.Api.Models.IL10N):boolean =>
            {
                if (!testTime.IsAllDay) {
                    if (!testTime.StartTime) {
                        popup.ShowError(translations.TimeInvalid);
                        return false;
                    }
                    if (!testTime.EndTime) {
                        popup.ShowError(translations.TimeInvalid);
                        return false;
                    }
                    if (testTime.StartTime > testTime.EndTime) {
                        popup.ShowError(translations.StartTimeBeforeEnd);
                        return false;
                    }
                }
                return true;
            }
        }


    }

    Core.NG.WorkforceMyAvailabilityModule.RegisterNamedController("MyAvailabilityEditController", MyAvailabilityEditController,
        Core.NG.$typedScope<IMyAvailabilityEditControllerScope>()
        , myAvailabilityService
        , Core.$translation
        , Core.$popupMessageService
        , Core.Constants
        , Core.Date.$dateService
        , Core.NG.$modalInstance,
        Core.NG.$typedCustomResolve<Api.Models.IDayAvailability>("day"),
        Core.NG.$typedCustomResolve<Api.Models.ITimeRange>("time")
        );
}

