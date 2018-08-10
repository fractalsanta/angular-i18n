var Core;
(function (Core) {
    var scrollableClass = ".touch-scrollable";
    Core.NG.CoreModule.Module().directive('mxRepeatScrollTop', function () {
        return function (scope, element) {
            if (scope.$last) {
                element.parents(scrollableClass)[0].scrollTop = 0;
            }
        };
    });
})(Core || (Core = {}));
