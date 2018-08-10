var Workforce;
(function (Workforce) {
    var MyAvailability;
    (function (MyAvailability) {
        var MyAvailabilityEditController = (function () {
            function MyAvailabilityEditController(scope, myAvailabilityService, translationService, popup, constants, dateService, modal, day, time) {
                var _this = this;
                this.scope = scope;
                this.myAvailabilityService = myAvailabilityService;
                this.translationService = translationService;
                this.constants = constants;
                this.modal = modal;
                this.originalTimes = _.without(day.Times, time);
                scope.Vm = {
                    IsAllDay: time.IsAllDay,
                    StartTime: moment(time.Start),
                    EndTime: moment(time.End)
                };
                translationService.GetTranslations().then(function (l10NData) {
                    scope.L10N = l10NData.WorkforceMyAvailability;
                    scope.Title = l10NData.WorkforceMyAvailability.EditAvailability;
                });
                scope.GetSelectedMyAvailabilityDay = function () {
                    return day;
                };
                scope.Cancel = function () { return modal.dismiss(); };
                scope.Save = function () {
                    if (!scope.TimesValid(scope.Vm, scope.L10N)) {
                        return;
                    }
                    _this.saveTime = myAvailabilityService.GetTime(scope.Vm, constants);
                    var newTimes = [];
                    if (!_this.saveTime.IsAllDay) {
                        newTimes = _.clone(_this.originalTimes);
                    }
                    newTimes.push(_this.saveTime);
                    if (dateService.IsOverlapping(myAvailabilityService.MapTimeRange(newTimes))) {
                        popup.ShowError(scope.L10N.OverLappingTimes);
                        return;
                    }
                    day.Times = myAvailabilityService.SortTimes(newTimes);
                    _this.myAvailabilityService.UpdateMyAvailabilityDay(day)
                        .then(function () {
                        modal.dismiss();
                    }, function () {
                        var restore = _.clone(_this.originalTimes);
                        restore.push(time);
                        day.Times = myAvailabilityService.SortTimes(restore);
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
            return MyAvailabilityEditController;
        }());
        Core.NG.WorkforceMyAvailabilityModule.RegisterNamedController("MyAvailabilityEditController", MyAvailabilityEditController, Core.NG.$typedScope(), MyAvailability.myAvailabilityService, Core.$translation, Core.$popupMessageService, Core.Constants, Core.Date.$dateService, Core.NG.$modalInstance, Core.NG.$typedCustomResolve("day"), Core.NG.$typedCustomResolve("time"));
    })(MyAvailability = Workforce.MyAvailability || (Workforce.MyAvailability = {}));
})(Workforce || (Workforce = {}));
