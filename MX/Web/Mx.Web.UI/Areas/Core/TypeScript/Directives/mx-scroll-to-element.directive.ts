module Core {
    class MxScrollToElement implements ng.IDirective {
        constructor($windowService: ng.IWindowService) {            
            return <ng.IDirective>{
                restrict: "A",
                link: ($scope, element: ng.IAugmentedJQuery): void => {
                    var parent = element.parent();
                    var parentDiv = element.closest(".touch-scrollable");
                    $windowService.setTimeout(() => {
                        parentDiv.scrollTop(parent[0].offsetTop);
                    }, 0);
                }
            };
        }
    }
    NG.CoreModule.RegisterDirective("mxScrollToElement", MxScrollToElement, Core.NG.$window);
} 