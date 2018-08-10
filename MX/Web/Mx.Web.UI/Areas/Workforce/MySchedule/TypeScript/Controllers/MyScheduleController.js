var Workforce;
(function (Workforce) {
    var MySchedule;
    (function (MySchedule) {
        var MyScheduleController = (function () {
            function MyScheduleController($scope, myScheduleService, translationService, popupMessageService) {
                this.$scope = $scope;
                this.myScheduleService = myScheduleService;
                this.translationService = translationService;
                this.popupMessageService = popupMessageService;
                $scope.Vm = { DetailedView: false };
                translationService.GetTranslations().then(function (l10NData) {
                    $scope.L10N = l10NData.WorkforceMySchedule;
                    popupMessageService.SetPageTitle($scope.L10N.MySchedule);
                });
                myScheduleService.ResetShiftSelection();
                $scope.GetSelectedShift = function () {
                    return myScheduleService.GetSelectedShift();
                };
                $scope.SetDetailedView = function (flag) {
                    $scope.Vm.DetailedView = flag;
                };
            }
            return MyScheduleController;
        }());
        MySchedule.myScheduleController = Core.NG.WorkforceMyScheduleModule.RegisterNamedController("MyScheduleController", MyScheduleController, Core.NG.$typedScope(), MySchedule.myScheduleService, Core.$translation, Core.$popupMessageService);
    })(MySchedule = Workforce.MySchedule || (Workforce.MySchedule = {}));
})(Workforce || (Workforce = {}));
