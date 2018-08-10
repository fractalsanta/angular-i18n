// touch scroll support, preventing document bouncing on iOS
module Core {
    var scrollableClass = ".touch-scrollable";
   
    Core.NG.CoreModule.Module().directive('mxRepeatScrollTop', () => {
        return (scope: any, element: JQuery) => {
            if (scope.$last) {
                element.parents(scrollableClass)[0].scrollTop = 0;
            }
        };
    });
}
