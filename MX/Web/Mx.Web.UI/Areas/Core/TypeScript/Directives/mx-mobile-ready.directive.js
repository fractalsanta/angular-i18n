var Core;
(function (Core) {
    var MxMobileReady = (function () {
        function MxMobileReady(layoutService) {
            return {
                restrict: "A",
                link: function () { return layoutService.SetMobileReady(true); }
            };
        }
        return MxMobileReady;
    }());
    Core.NG.CoreModule.RegisterDirective("mxMobileReady", MxMobileReady, Core.layoutService);
})(Core || (Core = {}));
