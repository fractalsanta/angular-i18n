var Workforce;
(function (Workforce) {
    var MyAvailability;
    (function (MyAvailability) {
        var MyAvailabilityAddController = (function () {
            function MyAvailabilityAddController(scope, myAvailabilityService, translationService, popup, constants, dateService, modal) {
                var _this = this;
                this.scope = scope;
                this.myAvailabilityService = myAvailabilityService;
                this.translationService = translationService;
                this.constants = constants;
                this.modal = modal;
                this.availability = this.myAvailabilityService.GetSelectedMyAvailabilityDay();
                this.originalTimes = _.clone(this.availability.Times);
                scope.Vm = {
                    IsAllDay: false,
                    StartTime: moment({ hour: 1 }),
                    EndTime: moment({ hour: 23 })
                };
                translationService.GetTranslations().then(function (l10NData) {
                    scope.L10N = l10NData.WorkforceMyAvailability;
                    scope.Title = l10NData.WorkforceMyAvailability.AddAvailability;
                });
                scope.GetSelectedMyAvailabilityDay = function () {
                    return _this.myAvailabilityService.GetSelectedMyAvailabilityDay();
                };
                scope.Cancel = function () { return modal.dismiss(); };
                scope.Save = function () {
                    if (!scope.TimesValid(scope.Vm, scope.L10N)) {
                        return;
                    }
                    _this.time = myAvailabilityService.GetTime(scope.Vm, constants);
                    var newTimes = [];
                    if (!_this.time.IsAllDay) {
                        newTimes = _.clone(_this.originalTimes);
                    }
                    newTimes.push(_this.time);
                    if (dateService.IsOverlapping(myAvailabilityService.MapTimeRange(newTimes))) {
                        popup.ShowError(scope.L10N.OverLappingTimes);
                        return;
                    }
                    _this.availability.Times = myAvailabilityService.SortTimes(newTimes);
                    _this.myAvailabilityService.UpdateMyAvailabilityDay(_this.availability)
                        .then(function () {
                        modal.dismiss();
                    }, function () {
                        var restore = _.clone(_this.originalTimes);
                        _this.availability.Times = myAvailabilityService.SortTimes(restore);
                    });
                };
                scope.TimesValid = function (testTime, translations) {
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
                };
            }
            return MyAvailabilityAddController;
        }());
        Core.NG.WorkforceMyAvailabilityModule.RegisterNamedController("MyAvailabilityAddController", MyAvailabilityAddController, Core.NG.$typedScope(), MyAvailability.myAvailabilityService, Core.$translation, Core.$popupMessageService, Core.Constants, Core.Date.$dateService, Core.NG.$modalInstance);
    })(MyAvailability = Workforce.MyAvailability || (Workforce.MyAvailability = {}));
})(Workforce || (Workforce = {}));
