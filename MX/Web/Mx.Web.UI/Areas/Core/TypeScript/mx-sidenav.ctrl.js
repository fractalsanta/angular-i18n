var Core;
(function (Core) {
    "use strict";
    var MxSidebarController = (function () {
        function MxSidebarController($scope, navigationService, $location) {
            var _this = this;
            $scope.NavItems = navigationService.NavItems();
            $scope.NavState = navigationService.NavState();
            $scope.Collapse = function () {
                $scope.NavState.Expanded = false;
                $scope.NavState.Expanded = navigationService.NavState().Expanded = false;
            };
            $scope.ToggleExpansion = function (item) {
                if (_this._lastExpandedItem) {
                    if (_this._lastExpandedItem === item) {
                        item.IsExpanded = !item.IsExpanded;
                        return;
                    }
                    _this._lastExpandedItem.IsExpanded = false;
                }
                _this._lastExpandedItem = item;
                if (_this._lastExpandedItem) {
                    _this._lastExpandedItem.IsExpanded = true;
                }
            };
            $scope.Navigate = function (navItem) {
                $location.path(navItem.Url);
                $scope.Collapse();
            };
        }
        return MxSidebarController;
    }());
    Core.NG.CoreModule.RegisterNamedController("mxSidebarController", MxSidebarController, Core.NG.$typedScope(), Core.$navigationService, Core.NG.$location);
})(Core || (Core = {}));
