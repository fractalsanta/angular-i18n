var Core;
(function (Core) {
    "use strict";
    var Sticky = (function () {
        function Sticky($timeout) {
            return {
                restrict: "A",
                scope: { offset: "@" },
                link: function ($scope, elem, attrs) {
                    $timeout(function () {
                        var offsetTop = $scope.offset || 75, $window = angular.element(window), $document = angular.element(document), doc = document.documentElement, initialPosition = elem.css("position"), initialOffset = elem.css("top"), initialWidth = elem.width(), stickyLine, setInitial, checkSticky, isStuck;
                        setInitial = function () {
                            stickyLine = elem.offset().top - offsetTop;
                            checkSticky();
                        };
                        checkSticky = function () {
                            var scrollTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0), docBottom = $document.height(), elemBottom = elem.offset().top + elem.outerHeight();
                            if (scrollTop >= stickyLine && (isStuck || ((elemBottom + 100) < docBottom))) {
                                elem.css({
                                    position: "fixed",
                                    top: offsetTop + "px",
                                    width: initialWidth
                                });
                                isStuck = true;
                            }
                            else {
                                elem.css({
                                    position: initialPosition,
                                    top: initialOffset + "px",
                                    width: ""
                                });
                                isStuck = false;
                            }
                        };
                        $window.on("scroll touchstart touchend touchmove", checkSticky);
                        $window.on("resize orientationchange", function () {
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
        return Sticky;
    }());
    Core.NG.CoreModule.RegisterDirective("sticky", Sticky, Core.NG.$timeout);
})(Core || (Core = {}));
