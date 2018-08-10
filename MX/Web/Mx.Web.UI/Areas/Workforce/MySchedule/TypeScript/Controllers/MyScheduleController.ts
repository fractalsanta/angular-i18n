module Workforce.MySchedule {

    class MyScheduleController {
        
        constructor(
            private $scope: IMyScheduleControllerScope,
            private myScheduleService: IMyScheduleService,
            private translationService: Core.ITranslationService,
            private popupMessageService: Core.IPopupMessageService

            ) {

            $scope.Vm = {DetailedView: false};

            translationService.GetTranslations().then((l10NData) => {
                $scope.L10N = l10NData.WorkforceMySchedule;
                popupMessageService.SetPageTitle($scope.L10N.MySchedule);
            });

            myScheduleService.ResetShiftSelection();

            $scope.GetSelectedShift = ()=> {
                return myScheduleService.GetSelectedShift();
            };

            $scope.SetDetailedView = (flag: boolean)=> {
                $scope.Vm.DetailedView = flag;
            };
        }
    }

    export var myScheduleController = Core.NG.WorkforceMyScheduleModule.RegisterNamedController("MyScheduleController", MyScheduleController,
        Core.NG.$typedScope<IMyScheduleControllerScope>(),
        myScheduleService,
        Core.$translation,
        Core.$popupMessageService
        );


}