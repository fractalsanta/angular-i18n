module Workforce.MySchedule {

    interface IShareScheduleControllerScope extends ng.IScope {
        L10N: Api.Models.IL10N;
        Cancel(): void;
        ProcessIcsDownload(): void;
        vm: {
            CalendarDataUri: string;
            CalendarName: string;
            EmailLink: string;
            IcsFileDesc: { FileName: string; FileContent: string; };
        };
    }

    class ShareScheduleController {
        constructor(
            private $scope: IShareScheduleControllerScope,
            private authService: Core.Auth.IAuthService,
            private translationService: Core.ITranslationService,
            private myScheduleService: IMyScheduleService,
            private popupMessageService: Core.IPopupMessageService,
            private $modalInstance: ng.ui.bootstrap.IModalServiceInstance,
            private constants: Core.IConstants,
            isSingleShift: boolean
        ) {

            if (!$scope.vm) {
                $scope.vm = {
                    CalendarName: "",
                    CalendarDataUri: "",
                    EmailLink: "",
                    IcsFileDesc: { FileName: "", FileContent: "" }
                };
            }

            translationService.GetTranslations().then((l10NData) => {

                $scope.L10N = l10NData.WorkforceMySchedule;
                popupMessageService.SetPageTitle($scope.L10N.MySchedule);

                var shifts: Array<Api.Models.ICalendarEntry>;

                if (isSingleShift) {
                    shifts = [myScheduleService.GetSelectedShift()];
                } else {
                    shifts = myScheduleService.GetCachedShifts();
                }

                var emailBodyContent = myScheduleService.GenerateScheduleEmailBody(shifts, $scope.L10N.ScheduleEmailIntroMessage);

                var shiftsStartDate = moment(shifts[0].StartDateTime);
                var shiftsEndDate = moment(shifts[shifts.length - 1].EndDateTime);

                $scope.vm.EmailLink = "mailto:?subject=" + $scope.L10N.MySchedule + ": " + shiftsStartDate.format("ll") + " - " + shiftsEndDate.format("ll") +
                                                "&body=" + emailBodyContent;

                $scope.vm.CalendarDataUri = "/Workforce/MySchedule/Api/MyScheduleDownload?beginDate=" + shiftsStartDate.format(this.constants.InternalDateTimeFormat) + "&endDate=" + shiftsEndDate.format(this.constants.InternalDateTimeFormat);
            });

            $scope.Cancel = (): void => {
                $modalInstance.close();
            };
        }
    }

    Core.NG.WorkforceMyScheduleModule.RegisterNamedController("ShareScheduleController", ShareScheduleController,
        Core.NG.$typedScope<IShareScheduleControllerScope>(),
        Core.Auth.$authService,
        Core.$translation,
        myScheduleService,
        Core.$popupMessageService,
        Core.NG.$modalInstance,
        Core.Constants,
        Core.NG.$typedCustomResolve<boolean>("isSingleShift")
    );
}
