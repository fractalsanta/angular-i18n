var Core;
(function (Core) {
    var LayoutService = (function () {
        function LayoutService($rootScope) {
            var _this = this;
            this._isMobileReady = false;
            $rootScope.$on('$stateChangeSuccess', function () {
                _this._isMobileReady = false;
            });
        }
        LayoutService.prototype.SetMobileReady = function (ready) {
            this._isMobileReady = ready;
        };
        LayoutService.prototype.IsMobileReady = function () {
            return this._isMobileReady;
        };
        return LayoutService;
    }());
    Core.layoutService = Core.NG.CoreModule.RegisterService("LayoutService", LayoutService, Core.NG.$rootScope);
})(Core || (Core = {}));
