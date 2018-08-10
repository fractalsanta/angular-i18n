var Core;
(function (Core) {
    var NG;
    (function (NG) {
        "use strict";
        var MxScrollableTableDirective = (function () {
            function MxScrollableTableDirective($timeout, $q) {
                return {
                    restrict: "A",
                    scope: {
                        rows: '=watch',
                        headerId: "@",
                        refreshCallback: "=?",
                        firstRowIndex: "@"
                    },
                    link: function (scope, element, attr) {
                        var firstRowIndex = scope.firstRowIndex || "0";
                        if (scope.refreshCallback != null) {
                            scope.refreshCallback.call = function () {
                                waitForRender().then(function () {
                                    fixHeaderWidths();
                                    handleHorizontalScroll(null);
                                });
                            };
                        }
                        var initialTop = parseInt($(element).parent().css('top'));
                        var headerElement = $("#" + scope.headerId);
                        headerElement.css('visibility', 'hidden');
                        var waitForRender = function () {
                            var deferredRender = $q.defer();
                            var wait = function () {
                                if (element.find(":visible").length === 0) {
                                    $timeout(wait, 100);
                                }
                                else {
                                    deferredRender.resolve();
                                }
                            };
                            $timeout(wait);
                            return deferredRender.promise;
                        };
                        var headersAreFixed = $q.defer();
                        var getCssHeight = function (el) {
                            return parseInt($(el).css('height'));
                        };
                        var setCssHeight = function (el, height) {
                            if (!height) {
                                $(el).css('height', '');
                            }
                            else {
                                $(el).css('height', height + "px");
                            }
                        };
                        var fixHeaderWidths = function () {
                            var firstRowElements = element.find("tr:eq(" + firstRowIndex + ")>td");
                            if (!firstRowElements || !firstRowElements.length) {
                                headersAreFixed.resolve();
                                return;
                            }
                            var columnHeaders = headerElement.find("div.column-header");
                            var maxHeight = 0;
                            setCssHeight(headerElement.parent(), null);
                            setCssHeight(headerElement, null);
                            element.parent().css("top", "");
                            columnHeaders.each(function (idx, elInner) {
                                setCssHeight(elInner, null);
                            });
                            var horizontalOffset = 0;
                            element.find("tr:eq(" + firstRowIndex + ")>td").each(function (idx, elInner) {
                                var el = $(elInner);
                                var width = el.width();
                                var outerWidth = el.outerWidth();
                                $(columnHeaders[idx]).width(width);
                                $(columnHeaders[idx]).css("left", horizontalOffset + "px");
                                horizontalOffset += outerWidth;
                            });
                            columnHeaders.each(function (idx, elInner) {
                                if ($(elInner).width()) {
                                    var height = getCssHeight(elInner);
                                    if (height > maxHeight) {
                                        maxHeight = height;
                                    }
                                }
                            });
                            var maxHeightWithMargin = maxHeight + 20;
                            setCssHeight(headerElement.parent(), maxHeightWithMargin);
                            setCssHeight(headerElement, maxHeightWithMargin);
                            element.parent().css("top", (initialTop - 54 + maxHeightWithMargin) + "px");
                            columnHeaders.each(function (idx, elInner) {
                                setCssHeight(elInner, maxHeight);
                            });
                            headerElement.css('visibility', 'visible');
                            headersAreFixed.resolve();
                        };
                        var handleHorizontalScroll = function (event) {
                            var scrollAmount = element.parent().scrollLeft();
                            headerElement.css('margin-left', (-1 * scrollAmount) + "px");
                        };
                        angular.element(window).on('resize', fixHeaderWidths);
                        element.parent().on('scroll', handleHorizontalScroll);
                        var unregisterWatch = scope.$watch('rows', function (newValue, oldValue) {
                            if (newValue) {
                                waitForRender().then(fixHeaderWidths);
                            }
                        });
                        scope.$on('$destroy', function () {
                            angular.element(window).off('resize', fixHeaderWidths);
                            element.parent().off('scroll', handleHorizontalScroll);
                            unregisterWatch();
                        });
                    }
                };
            }
            return MxScrollableTableDirective;
        }());
        NG.CoreModule.RegisterDirective("mxScrollableTable", MxScrollableTableDirective, Core.NG.$timeout, Core.NG.$q);
    })(NG = Core.NG || (Core.NG = {}));
})(Core || (Core = {}));
