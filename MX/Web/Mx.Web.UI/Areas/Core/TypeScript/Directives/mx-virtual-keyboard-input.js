var Core;
(function (Core) {
    var MxVirtualKeyboardInput = (function () {
        function MxVirtualKeyboardInput(keyboardService, constants) {
            if (!constants.TouchKeyboardEnabled || !$("html").hasClass("touch")) {
                return {};
            }
            return {
                restrict: "A",
                require: "^ngModel",
                link: function ($scope, element) {
                    $(element).prop('readonly', true);
                    $(element).addClass('mx-virtual-keyboard-input-control');
                    var touchHandler = function (event) {
                        event.preventDefault();
                        event.stopPropagation();
                        if (!element.is(":disabled")) {
                            keyboardService.SetCurrentControl(element);
                            $(element).trigger('click');
                        }
                    };
                    element.on('touchstart', touchHandler);
                    $scope.$on("$destroy", function () { return element.off("touchstart", touchHandler); });
                }
            };
        }
        return MxVirtualKeyboardInput;
    }());
    Core.NG.CoreModule.RegisterDirective("mxVirtualKeyboardInput", MxVirtualKeyboardInput, Core.$virtualKeyboardService, Core.Constants);
    var setInputValue = function (input, value) {
        input.val(value);
        input.scope().$apply(function () { return input.controller('ngModel').$setViewValue(value); });
    };
    var executeBlur = function (control) {
        var expression = control.attr("ng-blur");
        var scope = control.scope();
        if (scope) {
            scope.$eval(expression);
        }
    };
    var findBlockParent = function (control) {
        var query = $(control)
            .parents()
            .filter(function (index, element) {
            var display = $(element).css("display");
            return display === "block" || display === "table-row";
        });
        return query.length ? query.first()[0] : null;
    };
    Core.NG.CoreModule.Module().run([Core.$virtualKeyboardService.name, Core.NG.$timeout.name, function (service, timeout) {
            var scrollIntoView = function (control) {
                if (control.attr("mx-virtual-keyboard-input-skip-scroll") !== undefined) {
                    return;
                }
                timeout(function () {
                    var parentBlock = findBlockParent(control);
                    if (parentBlock != null) {
                        var parentScrollable = $(control).parents(".touch-scrollable").first();
                        if (parentScrollable.length) {
                            parentScrollable.animate({ scrollTop: parentBlock.offsetTop, scrollLeft: $(control).position().left }, "fast");
                        }
                    }
                }, Core.MxVirtualKeyboard.AnimationDelay);
            };
            $(window).on("orientationchange", function () {
                timeout(function () {
                    var control = service.GetCurrentControl();
                    if (control != null) {
                        scrollIntoView(control);
                    }
                }, 300);
            });
            service.ControlChanged.Subscribe(function (control) {
                if (control) {
                    $(control).addClass('selected');
                    scrollIntoView(control);
                }
            });
            service.ControlChanging.Subscribe(function (control) {
                if (control) {
                    $(control).removeClass('selected');
                    executeBlur(control);
                }
            });
            service.Pressed.Subscribe(function (key) {
                var input = service.GetCurrentControl();
                if (input == null) {
                    return;
                }
                var currentValue = input.val() || '';
                if (key === "[BACKSPACE]") {
                    if (currentValue.length > 0) {
                        setInputValue(input, currentValue.substring(0, currentValue.length - 1));
                    }
                    return;
                }
                if (currentValue == '0') {
                    currentValue = '';
                }
                if (key === '.' && currentValue.indexOf('.') >= 0) {
                    return;
                }
                if (key[0] != '[') {
                    setInputValue(input, currentValue + key);
                }
            });
        }]);
})(Core || (Core = {}));
