module Core {
    "use strict";

    interface IMxSidebarScope extends ng.IScope {
        NavItems: Core.INavigationItem[];
        NavState: { Expanded: boolean };
        ToggleExpansion(item: Core.INavigationItem): void;
        Collapse(): void;
        Navigate(navItem: INavigationItem): void
    }

    class MxSidebarController {
        private _lastExpandedItem: Core.INavigationItem;

        constructor(
            $scope: IMxSidebarScope,
            navigationService: INavigationService,
            $location: ng.ILocationService) {

            $scope.NavItems = navigationService.NavItems();
            $scope.NavState = navigationService.NavState();

            $scope.Collapse = (): void => {
                $scope.NavState.Expanded = false;
                $scope.NavState.Expanded = navigationService.NavState().Expanded = false;
            };

            $scope.ToggleExpansion = (item: Core.INavigationItem): void => {
                if (this._lastExpandedItem) {
                    if (this._lastExpandedItem === item) {
                        item.IsExpanded = !item.IsExpanded;
                        return;
                    }

                    this._lastExpandedItem.IsExpanded = false;
                }

                this._lastExpandedItem = item;

                if (this._lastExpandedItem) {
                    this._lastExpandedItem.IsExpanded = true;
                }
            };

            $scope.Navigate = (navItem: INavigationItem): void => {
                $location.path(navItem.Url);
                $scope.Collapse();
            };
        }
    }

    NG.CoreModule.RegisterNamedController("mxSidebarController", MxSidebarController,
        NG.$typedScope<IMxSidebarScope>(),
        $navigationService,
        NG.$location);
}
