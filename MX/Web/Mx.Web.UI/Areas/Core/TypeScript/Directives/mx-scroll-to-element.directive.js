var Core;
(function (Core) {
    var MxScrollToElement = (function () {
        function MxScrollToElement($windowService) {
            return {
                restrict: "A",
                link: function ($scope, element) {
                    var parent = element.parent();
                    var parentDiv = element.closest(".touch-scrollable");
                    $windowService.setTimeout(function () {
                        parentDiv.scrollTop(parent[0].offsetTop);
                    }, 0);
                }
            };
        }
        return MxScrollToElement;
    }());
    Core.NG.CoreModule.RegisterDirective("mxScrollToElement", MxScrollToElement, Core.NG.$window);
})(Core || (Core = {}));
