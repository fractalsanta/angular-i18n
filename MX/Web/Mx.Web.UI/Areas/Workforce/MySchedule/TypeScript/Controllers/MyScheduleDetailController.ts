module Workforce.MySchedule {

    export class MyScheduleDetailController {

        private _managerShifts: Api.Models.ICalendarEntry[];
        private _teamShifts: Api.Models.ICalendarEntry[];
        private _shift: Api.Models.ICalendarEntry;

        constructor(
            private $scope: IMyScheduleDetailControllerScope,
            private authService: Core.Auth.IAuthService,
            private translationService: Core.ITranslationService,
            private myScheduleService: IMyScheduleService,
            private popupMessageService: Core.IPopupMessageService,
            private $modal: ng.ui.bootstrap.IModalService
            ) {

            this._shift = null;
            this._managerShifts = null;
            this._teamShifts = null;

            translationService.GetTranslations().then((l10NData) => {
                $scope.L10N = l10NData.WorkforceMySchedule;
                popupMessageService.SetPageTitle($scope.L10N.MySchedule);
            });

            $scope.GetShift = ()=> {
                if (this._shift != myScheduleService.GetSelectedShift()) {
                    this._shift = myScheduleService.GetSelectedShift();
                    this._managerShifts = null;
                    this._teamShifts = null;
                    if (this._shift != null && this._shift.TeamShifts != null) {
                        this._managerShifts = _.where(this._shift.TeamShifts, (shft)=> { return shft.IsManagement; });
                        this._teamShifts = _.where(this._shift.TeamShifts, (shft)=> { return !shft.IsManagement; });
                    }
                }
                return this._shift;
            };

            $scope.GetManagerShifts = ()=> {
                if (this._managerShifts) {
                    return this._managerShifts;
                }
                return null;
            };

            $scope.GetManagerPhoneNumber = (manager) => {
                return manager.Mobile || manager.Telephone;
            };

            $scope.ShareScheduleShift = (): void=> {
                $modal.open(<ng.ui.bootstrap.IModalSettings>{
                    templateUrl: "Areas/Workforce/MySchedule/Templates/ShareSchedule.html",
                    controller: "Workforce.MySchedule.ShareScheduleController",
                    resolve: {
                        isSingleShift: ()=> {
                            return true;
                        }
                    }
                });
            };

            $scope.GetTeamShifts = ()=> {
                if (this._teamShifts) {
                    return this._teamShifts;
                }
                return null;
            };

            $scope.GetTimeOffStatus = (calEntry: Api.Models.ICalendarEntry) => myScheduleService.GetTimeOffStatus(calEntry, $scope.L10N);
        }
    }


    export var myScheduleDetailController =  Core.NG.WorkforceMyScheduleModule.RegisterNamedController("MyScheduleDetailController", MyScheduleDetailController,
        Core.NG.$typedScope<IMyScheduleDetailControllerScope>(),
        Core.Auth.$authService,
        Core.$translation,
        myScheduleService,
        Core.$popupMessageService,
        Core.NG.$modal
        );

} 