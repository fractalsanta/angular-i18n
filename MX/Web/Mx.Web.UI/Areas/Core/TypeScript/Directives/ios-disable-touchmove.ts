module Core.NG {
    "use strict";

    // iOS safari fix touchmove bubbling up and scrolling div visually behind active div
    class IosDisableTouchmove implements ng.IDirective {
        constructor() {
            return <ng.IDirective>{
                restrict: "A",
                link: (scope: ng.IScope, element: ng.IAugmentedJQuery): void => {
                    if (window.isIOSDevice()) {
                        element.on("touchmove", e => {
                            return false;
                        });
                    }
                }
            };
        }

    }

    NG.CoreModule.RegisterDirective("iosDisableTouchmove", IosDisableTouchmove);
}
