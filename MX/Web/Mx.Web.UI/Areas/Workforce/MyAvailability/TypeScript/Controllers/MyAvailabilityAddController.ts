module Workforce.MyAvailability {

    interface IMyAvailabilityAddControllerScope extends ng.IScope {
        L10N: Api.Models.IL10N;
        Title: string;
        Cancel(): void;
        Save(): void;
        GetSelectedMyAvailabilityDay(): Api.Models.IDayAvailability;
        Vm: IMyAvailabilityEntry;
        TimesValid(testTime: IMyAvailabilityEntry, translations: Workforce.MyAvailability.Api.Models.IL10N): boolean;
    }

    class MyAvailabilityAddController {

        private originalTimes: Workforce.MyAvailability.Api.Models.ITimeRange[];
        private availability: Workforce.MyAvailability.Api.Models.IDayAvailability;
        private time: Workforce.MyAvailability.Api.Models.ITimeRange;

        constructor(
            private scope: IMyAvailabilityAddControllerScope,
            private myAvailabilityService: IMyAvailabilityService,
            private translationService: Core.ITranslationService,
            popup: Core.IPopupMessageService,
            private constants: Core.IConstants,
            dateService: Core.Date.IDateService,
            private modal: ng.ui.bootstrap.IModalServiceInstance
            ) {

            this.availability = this.myAvailabilityService.GetSelectedMyAvailabilityDay();
            this.originalTimes = _.clone(this.availability.Times);

            scope.Vm = {
                IsAllDay: false,
                StartTime: moment({hour:1}),
                EndTime: moment({ hour: 23 })
            };

            translationService.GetTranslations().then((l10NData) => {
                scope.L10N = l10NData.WorkforceMyAvailability;
                scope.Title = l10NData.WorkforceMyAvailability.AddAvailability;
            });

            scope.GetSelectedMyAvailabilityDay = () => {
                return this.myAvailabilityService.GetSelectedMyAvailabilityDay();
            }
            scope.Cancel = (): void => modal.dismiss();
            scope.Save = (): void => {
                if (!scope.TimesValid(scope.Vm, scope.L10N)) {
                    return;
                }
                this.time = myAvailabilityService.GetTime(scope.Vm, constants);
                var newTimes: Workforce.MyAvailability.Api.Models.ITimeRange[] = [];
                // Clear times array if all day...
                if (! this.time.IsAllDay) {
                    newTimes = _.clone(this.originalTimes);
                }
                newTimes.push(this.time);

                if (dateService.IsOverlapping(myAvailabilityService.MapTimeRange(newTimes))) {
                    popup.ShowError(scope.L10N.OverLappingTimes);
                    return;
                }
                this.availability.Times = myAvailabilityService.SortTimes(newTimes);

                this.myAvailabilityService.UpdateMyAvailabilityDay(this.availability)
                    .then(() => {
                        modal.dismiss();
                    },
                    () => {
                        var restore = _.clone(this.originalTimes);
                        this.availability.Times = myAvailabilityService.SortTimes(restore);

                    });
            };
            scope.TimesValid = (testTime: IMyAvailabilityEntry, translations: Workforce.MyAvailability.Api.Models.IL10N): boolean => {
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

    Core.NG.WorkforceMyAvailabilityModule.RegisterNamedController("MyAvailabilityAddController", MyAvailabilityAddController,
        Core.NG.$typedScope<IMyAvailabilityAddControllerScope>()
        , myAvailabilityService
        , Core.$translation
        , Core.$popupMessageService
        , Core.Constants
        , Core.Date.$dateService
        , Core.NG.$modalInstance
        );
}

