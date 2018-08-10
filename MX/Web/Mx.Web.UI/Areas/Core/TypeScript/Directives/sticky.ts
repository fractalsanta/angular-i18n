module Core {
    "use strict";

    interface IStickyScope extends ng.IScope {
        offset: number;
    }

    class Sticky implements ng.IDirective {
        constructor($timeout: ng.ITimeoutService) {
            return <ng.IDirective>{
                restrict: "A",
                scope: { offset: "@" },
                link: ($scope: IStickyScope, elem: ng.IAugmentedJQuery, attrs: ng.IAttributes): void => {
                    $timeout((): void => {
                        var offsetTop = $scope.offset || 75,
                            $window = angular.element(window),
                            $document = angular.element(document),
                            doc = document.documentElement,
                            initialPosition = elem.css("position"),
                            initialOffset = elem.css("top"),
                            initialWidth = elem.width(),
                            stickyLine,
                            setInitial,
                            checkSticky,
                            isStuck;

                        setInitial = (): void => {
                            stickyLine = elem.offset().top - offsetTop;
                            checkSticky();
                        };

                        checkSticky = (): void => {
                            var scrollTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0),
                                docBottom = $document.height(),
                                elemBottom = elem.offset().top + elem.outerHeight();

                            if (scrollTop >= stickyLine && (isStuck || ((elemBottom + 100) < docBottom))) {
                                elem.css({
                                    position: "fixed",
                                    top: offsetTop + "px",
                                    width: initialWidth
                                });

                                isStuck = true;
                            } else {
                                elem.css({
                                    position: initialPosition,
                                    top: initialOffset + "px",
                                    width: ""
                                });

                                isStuck = false;
                            }
                        };

                        $window.on("scroll touchstart touchend touchmove", checkSticky);

                        $window.on("resize orientationchange", (): void => {
                            elem.css({
                                position: initialPosition,
                                top: "",
                                width: ""
                            });

                            isStuck = false;

                            initialWidth = elem.width();
                            initialOffset = elem.css("top"),
                            setInitial();
                        });

                        setInitial();
                    });
                }
            };
        }
    }

    NG.CoreModule.RegisterDirective("sticky", Sticky, NG.$timeout);
} 