module Core.NG {
    "use strict";

    // iOS safari fix, when the iOS keyboard expands it adds an extra CSS class to the element
    // we use capital "I" in "iOS" to get the attribute name as "mx-ios-detect"
    class MxIosDetect implements ng.IDirective {
        constructor() {
            return <ng.IDirective>{
                restrict: "A",
                link: (scope: ng.IScope, element: ng.IAugmentedJQuery): void => {
                    if (/iPhone|iPad|iPod/i.test(window.navigator.userAgent)) {
                        element.addClass("mx-ios");
                        element.on("focus", "input,textarea", e => {
                            element.addClass("mx-ios-keyboard-open");
                        }).on("blur", "input,textarea", e => {
                            element.removeClass("mx-ios-keyboard-open");
                            setTimeout(update, 500);
                        });

                        var update = () => {
                            // we forcable updated the width and height on iOS as these are incorrectly set by the browser when running with 100% height and width
                            // for example when the keyboard is up iOS flips! width and height, causing crazy viewport rendering
                            $("html,document,body").css("width", $(window).width()).css("height", $(window).height());
                            if (!element.hasClass("mx-ios-keyboard-open")) {
                                // we only scroll to top when orientation is changed and keyboard is not open to avoid the incorrectly reported height when in landscape orientation
                                window.scrollTo(0, 0);
                            }
                        };

                        $(window).on("orientationchange", () => {
                            // iOS window height reports incorrect sizes directly after the orientationchange event, this was observed for up to 300 ms after the event
                            // there are no events that are fired post correct size reporting so we have to wait for a longer period in the hope of avoiding a race condition 
                            setTimeout(update, 500);
                        });
                    }

                }
            };
        }

    }

    NG.CoreModule.RegisterDirective("mxIosDetect", MxIosDetect);
}