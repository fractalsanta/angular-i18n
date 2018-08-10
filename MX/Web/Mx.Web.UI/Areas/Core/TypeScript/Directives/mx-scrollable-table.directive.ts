// This is a heavily modified version of angular-scrollable-table found at 
// https://github.com/alalonde/angular-scrollable-table commit 33630d02e9

// removed the sorting, extra header space for the sort indicators, allowed the headers 
// to be able to wrap on a new row

module Core.NG {
    "use strict";

    export interface IDirectiveCallback {
        call: Function
    }

    interface MxScrollableTableScope extends ng.IScope {
        rows: any[];
        headerId: string;
        refreshCallback?: IDirectiveCallback;
        firstRowIndex?: string;
    }

    class MxScrollableTableDirective implements ng.IDirective {
        constructor(
            $timeout: ng.ITimeoutService,
            $q: ng.IQService
            ) {
            return <ng.IDirective>{
                restrict: "A",
                scope: {
                    rows: '=watch',
                    headerId: "@",
                    refreshCallback: "=?",
                    firstRowIndex: "@"
                },
                link: (scope: MxScrollableTableScope, element: ng.IAugmentedJQuery, attr: any): void => {
                    
                    // If first-row-index attribute is not set on the element, fall back on 0
                    var firstRowIndex = scope.firstRowIndex || "0";
                    
                    // Set fixed widths for the table headers in case the text overflows.
                    // There's no callback for when rendering is complete, so check the visibility of the table 
                    // periodically -- see http://stackoverflow.com/questions/11125078

                    if (scope.refreshCallback != null) {
                        scope.refreshCallback.call = ()=> {
                            waitForRender().then(()=> {
                                fixHeaderWidths();
                                handleHorizontalScroll(null);
                            });

                        };
                    }

                    // keep track of what was our initial top for the scrolling area
                    // since we could have 1,2 or 3 toolbars
                    var initialTop = parseInt($(element).parent().css('top'));

                    // the element that contains the header for the scrolling table
                    var headerElement = $("#" + scope.headerId);
                    headerElement.css('visibility', 'hidden');

                    var waitForRender = () => {
                        var deferredRender = $q.defer();

                        var wait = () => {
                            if (element.find(":visible").length === 0) {
                                $timeout(wait, 100);
                            } else {
                                deferredRender.resolve();
                            }
                        };

                        $timeout(wait);
                        return deferredRender.promise;
                    };

                    var headersAreFixed = $q.defer();

                    var getCssHeight = (el: any) => {
                        return parseInt($(el).css('height'));
                    };

                    var setCssHeight = (el: any, height: number) => {
                        if (!height) {
                            $(el).css('height', '');
                        } else {
                            $(el).css('height', height + "px");
                        }
                    };

                    var fixHeaderWidths = () => {

                        var firstRowElements = element.find("tr:eq(" + firstRowIndex + ")>td");

                        if (!firstRowElements || !firstRowElements.length) {
                            headersAreFixed.resolve();
                            return;
                        }

                        // each of the column headers
                        var columnHeaders = headerElement.find("div.column-header");

                        var maxHeight = 0;
                        setCssHeight(headerElement.parent(), null);
                        setCssHeight(headerElement, null);
                        
                        element.parent().css("top", "");

                        // clear heights for each column header
                        columnHeaders.each((idx, elInner) => {
                            setCssHeight(elInner, null);
                        });

                        var horizontalOffset = 0;

                        element.find("tr:eq(" + firstRowIndex + ")>td").each((idx, elInner) => {
                            var el = $(elInner);
                            var width = el.width();
                            var outerWidth = el.outerWidth();
                            $(columnHeaders[idx]).width(width);
                            $(columnHeaders[idx]).css("left", horizontalOffset + "px");
                            horizontalOffset += outerWidth;
                        });

                        // calculate new height
                        columnHeaders.each((idx, elInner) => {
                            if ($(elInner).width()) {
                                var height = getCssHeight(elInner);
                                if (height > maxHeight) {
                                    maxHeight = height;
                                }
                            }
                        });

                        // account for extra margin space above and below the headers
                        var maxHeightWithMargin = maxHeight + 20;
                        setCssHeight(headerElement.parent(), maxHeightWithMargin);
                        setCssHeight(headerElement, maxHeightWithMargin);
                        element.parent().css("top", (initialTop - 54 + maxHeightWithMargin) + "px");
                        
                        // set new height for each column header
                        columnHeaders.each((idx, elInner) => {
                            setCssHeight(elInner,maxHeight);
                        });

                        headerElement.css('visibility', 'visible');

                        headersAreFixed.resolve();
                    };

                    var handleHorizontalScroll = (event)=> {
                        var scrollAmount = element.parent().scrollLeft();
                        headerElement.css('margin-left', (-1 * scrollAmount) + "px");
                    };

                    angular.element(window).on('resize', fixHeaderWidths);

                    element.parent().on('scroll', handleHorizontalScroll);

                    // when the data model changes, fix the header widths.  See the comments here:
                    // http://docs.angularjs.org/api/ng.$timeout
                    var unregisterWatch = scope.$watch('rows', (newValue, oldValue) => {
                        if (newValue) {
                            waitForRender().then(fixHeaderWidths);
                        }
                    });

                    scope.$on('$destroy', () => {
                        angular.element(window).off('resize', fixHeaderWidths);
                        element.parent().off('scroll', handleHorizontalScroll);
                        unregisterWatch();
                    });
                }
            };
        }
    }

    NG.CoreModule.RegisterDirective("mxScrollableTable", MxScrollableTableDirective,
        Core.NG.$timeout,
        Core.NG.$q);
}