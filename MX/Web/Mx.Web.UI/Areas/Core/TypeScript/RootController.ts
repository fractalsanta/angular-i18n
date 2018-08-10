module Core {

    interface IMxRootScope extends ng.IScope {
    }

    class MxRootController {

        constructor(
            $scope: IMxRootScope,
            navigationService: INavigationService,
            popupMessageService: Core.IPopupMessageService
            ) {

            if (popupMessageService.GetCurrentMessage().Message != null && popupMessageService.GetCurrentMessage().Message.length > 0) {
                navigationService.NavState().Expanded = false;
            } else {
            navigationService.NavState().Expanded = true;            
            }

            popupMessageService.SetPageTitle('');
        }

    }
    NG.CoreModule.RegisterRouteController("$", "app.html", MxRootController, NG.$typedScope<IMxRootScope>(), $navigationService, Core.$popupMessageService);
}
