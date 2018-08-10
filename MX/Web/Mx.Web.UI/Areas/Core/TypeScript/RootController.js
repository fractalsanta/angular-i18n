var Core;
(function (Core) {
    var MxRootController = (function () {
        function MxRootController($scope, navigationService, popupMessageService) {
            if (popupMessageService.GetCurrentMessage().Message != null && popupMessageService.GetCurrentMessage().Message.length > 0) {
                navigationService.NavState().Expanded = false;
            }
            else {
                navigationService.NavState().Expanded = true;
            }
            popupMessageService.SetPageTitle('');
        }
        return MxRootController;
    }());
    Core.NG.CoreModule.RegisterRouteController("$", "app.html", MxRootController, Core.NG.$typedScope(), Core.$navigationService, Core.$popupMessageService);
})(Core || (Core = {}));
