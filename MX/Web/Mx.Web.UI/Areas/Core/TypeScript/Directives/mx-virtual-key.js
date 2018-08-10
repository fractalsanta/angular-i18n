var Core;
(function (Core) {
    var MxVirtualKey = (function () {
        function MxVirtualKey(keyboardService) {
            return {
                restrict: "A",
                link: function ($scope, element, attrs) {
                    var key = attrs.mxVirtualKey;
                    var handler = function (e) {
                        keyboardService.Pressed.Fire(key);
                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                    };
                    element.on("touchstart", handler);
                    $scope.$on("$destroy", function () { return element.off("touchstart", handler); });
                }
            };
        }
        return MxVirtualKey;
    }());
    Core.NG.CoreModule.RegisterDirective("mxVirtualKey", MxVirtualKey, Core.$virtualKeyboardService);
})(Core || (Core = {}));
