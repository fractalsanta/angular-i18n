module Workforce.MyAvailability {

    interface IMyAvailabilityDetailControllerScope extends ng.IScope {
        L10N: Api.Models.IL10N;
        GetSelectedMyAvailabilityDay(): Api.Models.IDayAvailability;
        EditAvailabilityTime(day: Api.Models.IDayAvailability, time: Api.Models.ITimeRange): void;
        DeleteAvailabilityTime(day: Api.Models.IDayAvailability,time: Api.Models.ITimeRange) : void;
        AddAvailability(): void;
        ShowAddButton(): boolean;
    }

    class MyAvailabilityDetailController {
        constructor(
            private scope: IMyAvailabilityDetailControllerScope,
            private authService: Core.Auth.IAuthService,
            myAvailabilityService: IMyAvailabilityService,
            private translationService: Core.ITranslationService,
            private popup: Core.IPopupMessageService,
            private modal: ng.ui.bootstrap.IModalService,
            constants: Core.IConstants
            ) {

            translationService.GetTranslations().then((l10NData) => {
                scope.L10N = l10NData.WorkforceMyAvailability;               
            });

            scope.GetSelectedMyAvailabilityDay = () => {
                return myAvailabilityService.GetSelectedMyAvailabilityDay();
            }
            scope.ShowAddButton = ():boolean => {
                var hasAllDay = _.some(myAvailabilityService.GetSelectedMyAvailabilityDay().Times, 'IsAllDay');
                return ! hasAllDay;
            }

            scope.AddAvailability = () => {
                modal.open({
                    templateUrl: "/Areas/Workforce/MyAvailability/Templates/MyAvailabilityModal.html",
                    controller: "Workforce.MyAvailability.MyAvailabilityAddController",
                    size:'sm'
                });
            }
            scope.EditAvailabilityTime = (day: Api.Models.IDayAvailability, time: Api.Models.ITimeRange): void => {
                modal.open({
                    templateUrl: "/Areas/Workforce/MyAvailability/Templates/MyAvailabilityModal.html",
                    controller: "Workforce.MyAvailability.MyAvailabilityEditController",
                    size: 'sm',
                    resolve: {
                        day: (): Api.Models.IDayAvailability => {
                            return day;
                        },
                        time: (): Api.Models.ITimeRange => {
                            return time;
                        }
                    }
                });
            }

            scope.DeleteAvailabilityTime = (day: Api.Models.IDayAvailability, time: Api.Models.ITimeRange): void => {

                var deleteRequest = <Workforce.MyAvailability.IMyAvailabilityDelete>{
                    DayOfWeek: day.DayOfWeek,
                    End: time.End.format(constants.InternalDateTimeFormat),
                    Start: time.Start.format(constants.InternalDateTimeFormat),
                    IsAllDay: time.IsAllDay,
                };
                
                myAvailabilityService.DeleteMyAvailabilityDay(deleteRequest).then(() => {
                        day.Times = _.without(day.Times, time);
                    });
            };
        }
    }

    Core.NG.WorkforceMyAvailabilityModule.RegisterNamedController("MyAvailabilityDetailController", MyAvailabilityDetailController,
        Core.NG.$typedScope<IMyAvailabilityDetailControllerScope>(),
        Core.Auth.$authService,
        myAvailabilityService,
        Core.$translation,
        Core.$popupMessageService,
        Core.NG.$modal,
        Core.Constants
        );
} 