var Workforce;
(function (Workforce) {
    var MyAvailability;
    (function (MyAvailability) {
        var MyAvailabilityController = (function () {
            function MyAvailabilityController(scope, myAvailabilityService, translationService, popupMessageService) {
                this.scope = scope;
                this.myAvailabilityService = myAvailabilityService;
                this.translationService = translationService;
                this.popupMessageService = popupMessageService;
                scope.Vm = { DetailedView: false };
                translationService.GetTranslations().then(function (l10NData) {
                    scope.L10N = l10NData.WorkforceMyAvailability;
                    popupMessageService.SetPageTitle(scope.L10N.MyAvailability);
                });
                myAvailabilityService.ResetMyAvailabilityDaySelection();
                scope.GetSelectedMyAvailabilityDay = function () {
                    return myAvailabilityService.GetSelectedMyAvailabilityDay();
                };
                scope.SetDetailedView = function (flag) {
                    scope.Vm.DetailedView = flag;
                };
            }
            return MyAvailabilityController;
        }());
        Core.NG.WorkforceMyAvailabilityModule.RegisterRouteController("", "Templates/MyAvailability.html", MyAvailabilityController, Core.NG.$typedScope(), MyAvailability.myAvailabilityService, Core.$translation, Core.$popupMessageService);
    })(MyAvailability = Workforce.MyAvailability || (Workforce.MyAvailability = {}));
})(Workforce || (Workforce = {}));
