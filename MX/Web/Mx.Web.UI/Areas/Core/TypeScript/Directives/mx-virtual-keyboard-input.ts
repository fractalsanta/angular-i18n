module Core {

    class MxVirtualKeyboardInput implements ng.IDirective {
        constructor(keyboardService: IVirtualKeyboardService, constants: Core.IConstants) {
            if (!constants.TouchKeyboardEnabled || !$("html").hasClass("touch")) {return {};}
            return <ng.IDirective>{
                restrict: "A",
                require: "^ngModel",
                link: ($scope: ng.IScope, element: ng.IAugmentedJQuery): void => {
                    $(element).prop('readonly', true);
                    $(element).addClass('mx-virtual-keyboard-input-control');

                    var touchHandler = (event: JQueryEventObject) => {
                        event.preventDefault();
                        event.stopPropagation();
                        if (!element.is(":disabled")) {
                            keyboardService.SetCurrentControl(element);
                            $(element).trigger('click');
                        }
                    };

                    element.on('touchstart', touchHandler);

                    $scope.$on("$destroy", () => element.off("touchstart", touchHandler));
                }
            };
        }
    }
    NG.CoreModule.RegisterDirective("mxVirtualKeyboardInput", MxVirtualKeyboardInput, Core.$virtualKeyboardService, Core.Constants);

    var setInputValue = (input: ng.IAugmentedJQuery, value: string) => {
        input.val(value);
        input.scope().$apply(() => input.controller('ngModel').$setViewValue(value));
    };

    var executeBlur = (control: ng.IAugmentedJQuery) => {
        var expression = control.attr("ng-blur");
        var scope = control.scope();
        if (scope) {
            scope.$eval(expression);
        }
    };

    var findBlockParent = (control: ng.IAugmentedJQuery) => {
        var query = $(control)
            .parents()
            .filter((index, element) => {
                var display = $(element).css("display");
                return display === "block" || display === "table-row";
            });
        return query.length ? query.first()[0] : null;
    };

    NG.CoreModule.Module().run([Core.$virtualKeyboardService.name, Core.NG.$timeout.name, (service: Core.IVirtualKeyboardService, timeout: ng.ITimeoutService) => {
        var scrollIntoView = (control: ng.IAugmentedJQuery) => {
            if (control.attr("mx-virtual-keyboard-input-skip-scroll") !== undefined) {
                return;
            }

            timeout(() => {
                var parentBlock = findBlockParent(control);
                if (parentBlock != null) {
                    var parentScrollable = $(control).parents(".touch-scrollable").first();
                    if (parentScrollable.length) {
                        parentScrollable.animate({scrollTop: parentBlock.offsetTop, scrollLeft: $(control).position().left }, "fast");
                    }
                }
            }, MxVirtualKeyboard.AnimationDelay);
        }

        $(window).on("orientationchange", () => {
            timeout(() => {
                var control = service.GetCurrentControl();
                if (control != null) {
                    scrollIntoView(control);
                }
            }, 300);
        });

        service.ControlChanged.Subscribe(control => {
            if (control) {
                $(control).addClass('selected');
                scrollIntoView(control);
            }
        });

        service.ControlChanging.Subscribe(control => {
            if (control) {
                $(control).removeClass('selected');
                executeBlur(control);
            }
        });

        service.Pressed.Subscribe(key => {
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
}  