var Core;
(function (Core) {
    var Directives;
    (function (Directives) {
        "use strict";
        var getCursorCoordinates = function (e) {
            var touches = e.originalEvent.touches;
            if (touches && touches.length) {
                e.pageY = touches[0].pageY;
                e.pageX = touches[0].pageX;
            }
            return { top: e.pageY, left: e.pageX };
        };
        var getContainingElement = function (elements, coordinates) {
            var length = elements.length;
            var current = null;
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
        var MxSortable = (function () {
            function MxSortable($window, $timeout) {
                return {
                    restrict: "A",
                    scope: { Options: "=mxSortable", Container: "@scrollContainer" },
                    require: "ngModel",
                    link: function ($scope, element, attrs, $ngModel) {
                        var doc = angular.element($window.document.body);
                        var validParents = angular.element($scope.Options.ConnectWith);
                        var instanceObject;
                        element.addClass("mx-sortable");
                        instanceObject = {
                            Start: function (e) {
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
                                targetElement
                                    .height(targetElement.height())
                                    .width(targetElement.width())
                                    .addClass("drag-element")
                                    .offset(startingCoordinates);
                                doc.on("mousemove.mxSortable touchmove.mxSortable", instanceObject.Move);
                                doc.one("mouseup.mxSortable touchend.mxSortable", instanceObject.Stop);
                                doc.addClass("disable-select")[0].onselectstart = function () { return false; };
                            },
                            Move: function (e) {
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
                            Stop: function () {
                                $timeout(function () {
                                    var targetContainer = instanceObject.PlaceholderElement.parent();
                                    var originalContainer = instanceObject.DraggedElement.parent();
                                    var originalIndex = originalContainer.children().not(instanceObject.PlaceholderElement).index(instanceObject.DraggedElement);
                                    var dropOptions = {
                                        Value: $ngModel.$modelValue.splice(originalIndex, 1)[0],
                                        TargetIndex: targetContainer.children().not(instanceObject.DraggedElement).index(instanceObject.PlaceholderElement),
                                        OriginalInstance: instanceObject
                                    };
                                    targetContainer.trigger("drop.mxSortable", [dropOptions]);
                                }, 0, false);
                                validParents.each(resetPosition);
                            },
                            Reset: function () {
                                doc.removeClass("disable-select");
                                instanceObject.DraggedElement.removeClass("drag-element").removeAttr("style");
                                instanceObject.DraggedElement = null;
                                instanceObject.PlaceholderElement.remove();
                                instanceObject.PlaceholderElement = null;
                                doc.off("mousemove.mxSortable touchmove.mxSortable")[0].onselectstart = null;
                            },
                            UpdatePlaceholder: function () {
                                var dragElement = instanceObject.DraggedElement;
                                var lastCoordinates = instanceObject.LastCoordinates;
                                var parent = dragElement.parent();
                                if (validParents.index(parent) === -1) {
                                    validParents.add(parent);
                                }
                                var currentContainer = getContainingElement(validParents, lastCoordinates);
                                if (currentContainer) {
                                    var children = currentContainer.children().not(dragElement).not(instanceObject.PlaceholderElement);
                                    var length;
                                    var i;
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
                        element.on("drop.mxSortable", function (e, dropOptions) {
                            e.preventDefault();
                            e.stopPropagation();
                            if (dropOptions && dropOptions.Value && typeof dropOptions.TargetIndex === "number") {
                                $timeout(function () {
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
                        $scope.$on("$destroy", function () {
                            element.off(".mxSortable");
                            element.removeClass("mx-sortable");
                        });
                        var resetPosition = function (i, elem) {
                            if (!$scope.Container) {
                                return elem;
                            }
                            $(elem).closest($scope.Container).css("top", 0);
                            return elem;
                        };
                        var checkPosition = function (i, e) {
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
            return MxSortable;
        }());
        Core.NG.CoreModule.RegisterDirective("mxSortable", MxSortable, Core.NG.$window, Core.NG.$timeout);
    })(Directives = Core.Directives || (Core.Directives = {}));
})(Core || (Core = {}));
