module Core {
    class MxVirtualKey {
        constructor(keyboardService: IVirtualKeyboardService) {
            return <ng.IDirective>{
                restrict: "A",
                link: ($scope, element: ng.IAugmentedJQuery, attrs): void => {
                    var key = attrs.mxVirtualKey;
                    var handler = e => {
                        keyboardService.Pressed.Fire(key);
                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                    };
                    element.on("touchstart", handler);
                    $scope.$on("$destroy", () => element.off("touchstart", handler));
                }
            };
        }
    }

    NG.CoreModule.RegisterDirective("mxVirtualKey", MxVirtualKey, Core.$virtualKeyboardService);
} 