var Workforce;
(function (Workforce) {
    var MySchedule;
    (function (MySchedule) {
        var MyScheduleDetailController = (function () {
            function MyScheduleDetailController($scope, authService, translationService, myScheduleService, popupMessageService, $modal) {
                var _this = this;
                this.$scope = $scope;
                this.authService = authService;
                this.translationService = translationService;
                this.myScheduleService = myScheduleService;
                this.popupMessageService = popupMessageService;
                this.$modal = $modal;
                this._shift = null;
                this._managerShifts = null;
                this._teamShifts = null;
                translationService.GetTranslations().then(function (l10NData) {
                    $scope.L10N = l10NData.WorkforceMySchedule;
                    popupMessageService.SetPageTitle($scope.L10N.MySchedule);
                });
                $scope.GetShift = function () {
                    if (_this._shift != myScheduleService.GetSelectedShift()) {
                        _this._shift = myScheduleService.GetSelectedShift();
                        _this._managerShifts = null;
                        _this._teamShifts = null;
                        if (_this._shift != null && _this._shift.TeamShifts != null) {
                            _this._managerShifts = _.where(_this._shift.TeamShifts, function (shft) { return shft.IsManagement; });
                            _this._teamShifts = _.where(_this._shift.TeamShifts, function (shft) { return !shft.IsManagement; });
                        }
                    }
                    return _this._shift;
                };
                $scope.GetManagerShifts = function () {
                    if (_this._managerShifts) {
                        return _this._managerShifts;
                    }
                    return null;
                };
                $scope.GetManagerPhoneNumber = function (manager) {
                    return manager.Mobile || manager.Telephone;
                };
                $scope.ShareScheduleShift = function () {
                    $modal.open({
                        templateUrl: "Areas/Workforce/MySchedule/Templates/ShareSchedule.html",
                        controller: "Workforce.MySchedule.ShareScheduleController",
                        resolve: {
                            isSingleShift: function () {
                                return true;
                            }
                        }
                    });
                };
                $scope.GetTeamShifts = function () {
                    if (_this._teamShifts) {
                        return _this._teamShifts;
                    }
                    return null;
                };
                $scope.GetTimeOffStatus = function (calEntry) { return myScheduleService.GetTimeOffStatus(calEntry, $scope.L10N); };
            }
            return MyScheduleDetailController;
        }());
        MySchedule.MyScheduleDetailController = MyScheduleDetailController;
        MySchedule.myScheduleDetailController = Core.NG.WorkforceMyScheduleModule.RegisterNamedController("MyScheduleDetailController", MyScheduleDetailController, Core.NG.$typedScope(), Core.Auth.$authService, Core.$translation, MySchedule.myScheduleService, Core.$popupMessageService, Core.NG.$modal);
    })(MySchedule = Workforce.MySchedule || (Workforce.MySchedule = {}));
})(Workforce || (Workforce = {}));
