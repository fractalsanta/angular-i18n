var Workforce;
(function (Workforce) {
    var MySchedule;
    (function (MySchedule) {
        var ShareScheduleController = (function () {
            function ShareScheduleController($scope, authService, translationService, myScheduleService, popupMessageService, $modalInstance, constants, isSingleShift) {
                var _this = this;
                this.$scope = $scope;
                this.authService = authService;
                this.translationService = translationService;
                this.myScheduleService = myScheduleService;
                this.popupMessageService = popupMessageService;
                this.$modalInstance = $modalInstance;
                this.constants = constants;
                if (!$scope.vm) {
                    $scope.vm = {
                        CalendarName: "",
                        CalendarDataUri: "",
                        EmailLink: "",
                        IcsFileDesc: { FileName: "", FileContent: "" }
                    };
                }
                translationService.GetTranslations().then(function (l10NData) {
                    $scope.L10N = l10NData.WorkforceMySchedule;
                    popupMessageService.SetPageTitle($scope.L10N.MySchedule);
                    var shifts;
                    if (isSingleShift) {
                        shifts = [myScheduleService.GetSelectedShift()];
                    }
                    else {
                        shifts = myScheduleService.GetCachedShifts();
                    }
                    var emailBodyContent = myScheduleService.GenerateScheduleEmailBody(shifts, $scope.L10N.ScheduleEmailIntroMessage);
                    var shiftsStartDate = moment(shifts[0].StartDateTime);
                    var shiftsEndDate = moment(shifts[shifts.length - 1].EndDateTime);
                    $scope.vm.EmailLink = "mailto:?subject=" + $scope.L10N.MySchedule + ": " + shiftsStartDate.format("ll") + " - " + shiftsEndDate.format("ll") +
                        "&body=" + emailBodyContent;
                    $scope.vm.CalendarDataUri = "/Workforce/MySchedule/Api/MyScheduleDownload?beginDate=" + shiftsStartDate.format(_this.constants.InternalDateTimeFormat) + "&endDate=" + shiftsEndDate.format(_this.constants.InternalDateTimeFormat);
                });
                $scope.Cancel = function () {
                    $modalInstance.close();
                };
            }
            return ShareScheduleController;
        }());
        Core.NG.WorkforceMyScheduleModule.RegisterNamedController("ShareScheduleController", ShareScheduleController, Core.NG.$typedScope(), Core.Auth.$authService, Core.$translation, MySchedule.myScheduleService, Core.$popupMessageService, Core.NG.$modalInstance, Core.Constants, Core.NG.$typedCustomResolve("isSingleShift"));
    })(MySchedule = Workforce.MySchedule || (Workforce.MySchedule = {}));
})(Workforce || (Workforce = {}));
