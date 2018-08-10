var Workforce;
(function (Workforce) {
    var MyAvailability;
    (function (MyAvailability) {
        var MyAvailabilityDetailController = (function () {
            function MyAvailabilityDetailController(scope, authService, myAvailabilityService, translationService, popup, modal, constants) {
                this.scope = scope;
                this.authService = authService;
                this.translationService = translationService;
                this.popup = popup;
                this.modal = modal;
                translationService.GetTranslations().then(function (l10NData) {
                    scope.L10N = l10NData.WorkforceMyAvailability;
                });
                scope.GetSelectedMyAvailabilityDay = function () {
                    return myAvailabilityService.GetSelectedMyAvailabilityDay();
                };
                scope.ShowAddButton = function () {
                    var hasAllDay = _.some(myAvailabilityService.GetSelectedMyAvailabilityDay().Times, 'IsAllDay');
                    return !hasAllDay;
                };
                scope.AddAvailability = function () {
                    modal.open({
                        templateUrl: "/Areas/Workforce/MyAvailability/Templates/MyAvailabilityModal.html",
                        controller: "Workforce.MyAvailability.MyAvailabilityAddController",
                        size: 'sm'
                    });
                };
                scope.EditAvailabilityTime = function (day, time) {
                    modal.open({
                        templateUrl: "/Areas/Workforce/MyAvailability/Templates/MyAvailabilityModal.html",
                        controller: "Workforce.MyAvailability.MyAvailabilityEditController",
                        size: 'sm',
                        resolve: {
                            day: function () {
                                return day;
                            },
                            time: function () {
                                return time;
                            }
                        }
                    });
                };
                scope.DeleteAvailabilityTime = function (day, time) {
                    var deleteRequest = {
                        DayOfWeek: day.DayOfWeek,
                        End: time.End.format(constants.InternalDateTimeFormat),
                        Start: time.Start.format(constants.InternalDateTimeFormat),
                        IsAllDay: time.IsAllDay
                    };
                    myAvailabilityService.DeleteMyAvailabilityDay(deleteRequest).then(function () {
                        day.Times = _.without(day.Times, time);
                    });
                };
            }
            return MyAvailabilityDetailController;
        }());
        Core.NG.WorkforceMyAvailabilityModule.RegisterNamedController("MyAvailabilityDetailController", MyAvailabilityDetailController, Core.NG.$typedScope(), Core.Auth.$authService, MyAvailability.myAvailabilityService, Core.$translation, Core.$popupMessageService, Core.NG.$modal, Core.Constants);
    })(MyAvailability = Workforce.MyAvailability || (Workforce.MyAvailability = {}));
})(Workforce || (Workforce = {}));
