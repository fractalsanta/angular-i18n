module Core.Directives {
    "use strict";

    export interface IMxSortableOptions {
        ConnectWith?: string;
        Stop?: () => void;
    }

    interface IMxSortableScope extends ng.IScope {
        Options: IMxSortableOptions;
        Container: string;
    }

    interface IDropOptions {
        Value: any;
        TargetIndex: number;
        OriginalInstance: { Reset: () => void; };
    }

    // Helper function to simplify getting cursor position regardless of
    // desktop or touch device.
    var getCursorCoordinates = (e: JQueryEventObject): JQueryCoordinates => {
        var touches: { pageX: number; pageY: number }[] = (<any>e.originalEvent).touches;

        if (touches && touches.length) {
            e.pageY = touches[0].pageY;
            e.pageX = touches[0].pageX;
        }

        return <JQueryCoordinates>{ top: e.pageY, left: e.pageX };
    };

    // Helper function to figure which container is the active container based on
    // a collection and provided cursor position.
    var getContainingElement = (elements: JQuery, coordinates: JQueryCoordinates): JQuery => {
        var length = elements.length;
        var current: JQuery = null;

        for (var i = 0; i < length; i += 1) {
            current = elements.eq(i);
            var offset = current.offset();

            if (offset.left <= coordinates.left && (offset.left + current.width()) >= coordinates.left) {
                break;
            }

            current = null;
        }

        return current;
    };

    class MxSortable implements ng.IDirective {
        constructor($window: ng.IWindowService, $timeout: ng.ITimeoutService) {
            return <ng.IDirective>{
                restrict: "A",
                scope: { Options: "=mxSortable", Container: "@scrollContainer" },
                require: "ngModel",
                link: ($scope: IMxSortableScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, $ngModel: ng.INgModelController): void => {
                    var doc = angular.element($window.document.body);
                    var validParents = angular.element($scope.Options.ConnectWith);
                    var instanceObject: {
                        Start: (e: JQueryEventObject) => void;
                        Move: (e: JQueryEventObject) => void;
                        Stop: () => void;
                        Reset: () => void;

                        UpdatePlaceholder: () => void;

                        DraggedElement?: JQuery;
                        PlaceholderElement?: JQuery;
                        LastCoordinates?: JQueryCoordinates;
                        MovingCoordinates?: JQueryCoordinates;
                    };

                    element.addClass("mx-sortable");

                    instanceObject = {
                        Start: (e: JQueryEventObject): void => {
                            //Scroll into view.
                            validParents.each(checkPosition);

                            var targetElement = angular.element(e.target);
                            var startingCoordinates = targetElement.offset();
                            var placeholder = targetElement.clone();

                            instanceObject.DraggedElement = targetElement;
                            instanceObject.PlaceholderElement = placeholder;

                            instanceObject.MovingCoordinates = startingCoordinates;
                            instanceObject.LastCoordinates = getCursorCoordinates(e);

                            placeholder.addClass("placeholder");
                            placeholder.insertAfter(targetElement);

                            // Remove target element from normal flow to prepare for movement.
                            targetElement
                                .height(targetElement.height())
                                .width(targetElement.width())
                                .addClass("drag-element")
                                .offset(startingCoordinates);

                            doc.on("mousemove.mxSortable touchmove.mxSortable", instanceObject.Move);
                            doc.one("mouseup.mxSortable touchend.mxSortable", instanceObject.Stop);

                            // Add class to prevent text selection on entire document while dragging.
                            // Override onselectstart to prevent text selection in IE9.
                            doc.addClass("disable-select")[0].onselectstart = (): boolean => { return false; };
                        },
                        Move: (e: JQueryEventObject): void => {
                            e.preventDefault();

                            var coords = getCursorCoordinates(e);
                            var movingCoordinates = instanceObject.MovingCoordinates;
                            var lastCoordinates = instanceObject.LastCoordinates;

                            if (movingCoordinates && lastCoordinates) {
                                movingCoordinates.top -= (lastCoordinates.top - coords.top);
                                movingCoordinates.left -= (lastCoordinates.left - coords.left);

                                instanceObject.DraggedElement.offset(movingCoordinates);
                                instanceObject.LastCoordinates = coords;

                                instanceObject.UpdatePlaceholder();
                            }
                        },
                        Stop: (): void => {
                            $timeout((): void => {
                                var targetContainer = instanceObject.PlaceholderElement.parent();
                                var originalContainer = instanceObject.DraggedElement.parent();
                                var originalIndex = originalContainer.children().not(instanceObject.PlaceholderElement).index(instanceObject.DraggedElement);
                                var dropOptions = <IDropOptions>{
                                    Value: $ngModel.$modelValue.splice(originalIndex, 1)[0],
                                    TargetIndex: targetContainer.children().not(instanceObject.DraggedElement).index(instanceObject.PlaceholderElement),
                                    OriginalInstance: instanceObject
                                };

                                targetContainer.trigger("drop.mxSortable", [dropOptions]);
                            }, 0, false);
                            validParents.each(resetPosition);
                        },

                        Reset: (): void => {
                            doc.removeClass("disable-select");

                            // Remove drag class and any inline-styles for positioning.
                            instanceObject.DraggedElement.removeClass("drag-element").removeAttr("style");
                            instanceObject.DraggedElement = null;

                            instanceObject.PlaceholderElement.remove();
                            instanceObject.PlaceholderElement = null;

                            // Remove events from document and remove IE9 select override.
                            doc.off("mousemove.mxSortable touchmove.mxSortable")[0].onselectstart = null;
                        },
                        UpdatePlaceholder: (): void => {
                            var dragElement = instanceObject.DraggedElement;
                            var lastCoordinates = instanceObject.LastCoordinates;
                            var parent = dragElement.parent();

                            // If the selected parents does not already include the
                            // dragged element's parent, add to the list so we can
                            // use it for positioning limitations.
                            if (validParents.index(parent) === -1) {
                                validParents.add(parent);
                            }

                            var currentContainer = getContainingElement(validParents, lastCoordinates);

                            if (currentContainer) {
                                var children = currentContainer.children().not(dragElement).not(instanceObject.PlaceholderElement);

                                var length: number;
                                var i: number;
                                for (i = 0, length = children.length; i < length; i += 1) {
                                    var current = children.eq(i);

                                    var offset = current.offset();
                                    var middle = (current.outerHeight() / 2) + offset.top;

                                    if (offset.top <= lastCoordinates.top && middle >= lastCoordinates.top) {
                                        instanceObject.PlaceholderElement.insertBefore(current);
                                        break;
                                    }

                                    if (middle <= lastCoordinates.top && (current.outerHeight() + offset.top) >= lastCoordinates.top) {
                                        instanceObject.PlaceholderElement.insertAfter(current);
                                        validParents.each(checkPosition);
                                        break;
                                    }
                                }
                            }
                        }
                    };

                    element.on("mousedown.mxSortable touchstart.mxSortable", "> li", instanceObject.Start);

                    element.on("drop.mxSortable", (e: JQueryEventObject, dropOptions?: IDropOptions): void => {
                        e.preventDefault();
                        e.stopPropagation();

                        if (dropOptions && dropOptions.Value && typeof dropOptions.TargetIndex === "number") {
                            $timeout((): void => {
                                $ngModel.$modelValue.splice(dropOptions.TargetIndex, 0, dropOptions.Value);

                                if (dropOptions.OriginalInstance && dropOptions.OriginalInstance.Reset && typeof dropOptions.OriginalInstance.Reset === "function") {
                                    dropOptions.OriginalInstance.Reset();
                                }

                                if ($scope.Options.Stop && typeof $scope.Options.Stop === "function") {
                                    $scope.Options.Stop();
                                }
                            }, 0, true);
                        }
                    });

                    $scope.$on("$destroy", (): void => {
                        element.off(".mxSortable");
                        element.removeClass("mx-sortable");
                    });

                    var resetPosition = (i: number, elem: Element): any => {
                        if (!$scope.Container) {
                            return elem;
                        }
                        $(elem).closest($scope.Container).css("top", 0);
                        return elem;
                    };

                    var checkPosition = (i: number, e: Element): any => {
                        if (!$scope.Container) {
                            return e;
                        }

                        var parent = $(e).closest(".touch-scrollable");
                        var elem = $(e).closest($scope.Container);
                        var parentHeight = parent.height();
                        var parentPos = parent.scrollTop();
                        var parentBottom = parentPos + parentHeight;

                        var myHeight = elem.height();
                        var myPos = elem.scrollTop();
                        var myBottom = myPos + myHeight;
                        var myExtra = parentHeight - myHeight;
                        if (myExtra < 0) {
                            myExtra = 0;
                        }

                        if (myBottom < parentBottom || (myBottom > parentBottom && myPos > 0)) {
                            var pos = myPos + parentBottom - myBottom - myExtra;
                            elem.css("top", Math.round(pos));
                        }
                        return e;

                    };
                }
            };
        }
    }

    NG.CoreModule.RegisterDirective("mxSortable", MxSortable, NG.$window, NG.$timeout);
} 