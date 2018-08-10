var Workforce;
(function (Workforce) {
    var MyAvailability;
    (function (MyAvailability) {
        var MyAvailabilityWeekController = (function () {
            function MyAvailabilityWeekController(scope, authService, myAvailablityService, translationService, popupMessageService, modal) {
                var _this = this;
                this.scope = scope;
                this.authService = authService;
                this.myAvailablityService = myAvailablityService;
                this.translationService = translationService;
                this.popupMessageService = popupMessageService;
                this.modal = modal;
                translationService.GetTranslations().then(function (l10NData) {
                    scope.L10N = l10NData.WorkforceMyAvailability;
                });
                myAvailablityService.GetAvailabilityPromise().then(function (result) {
                    _this._availability = result.data;
                });
                scope.GetAvailability = function () {
                    return _this._availability;
                };
                scope.GetColorCode = function (day) {
                    if (day != null && day.Times != null) {
                        if (day.Times.length > 0) {
                            return "green";
                        }
                    }
                    return "red";
                };
                scope.SelectMyAvailabilityDay = function (myAvailablityDay) {
                    myAvailablityService.SelectMyAvailabilityDay(myAvailablityDay);
                };
                scope.GetDayAvailability = function () {
                    if (myAvailablityService.GetAvailability() != null && myAvailablityService.GetAvailability().AvailableDays != null) {
                        return myAvailablityService.GetAvailability().AvailableDays;
                    }
                    return null;
                };
            }
            return MyAvailabilityWeekController;
        }());
        Core.NG.WorkforceMyAvailabilityModule.RegisterNamedController("MyAvailabilityWeekController", MyAvailabilityWeekController, Core.NG.$typedScope(), Core.Auth.$authService, MyAvailability.myAvailabilityService, Core.$translation, Core.$popupMessageService, Core.NG.$modal);
    })(MyAvailability = Workforce.MyAvailability || (Workforce.MyAvailability = {}));
})(Workforce || (Workforce = {}));
