module Core {

    interface IKeyboardScope extends ng.IScope{
        MainKeys: string[];
    }

    export class MxVirtualKeyboard implements ng.IDirective {

        // Delay, in milliseconds, to animate the sliding keyboard.
        // Must match the @animation-delay property in mx-keyboard.less
        static AnimationDelay = 300; 

        constructor(keyboardService: IVirtualKeyboardService, constants: Core.IConstants, timeout: ng.ITimeoutService) {
            if (!constants.TouchKeyboardEnabled || !$("html").hasClass("touch")) { return {}; }
            return <ng.IDirective>{
                restrict: "E",
                templateUrl: "/Areas/Core/Templates/mx-virtual-keyboard.html",
                link: ($scope: IKeyboardScope, element: ng.IAugmentedJQuery): void => {
                    $scope.MainKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.'];
                    keyboardService.ControlChanged.SubscribeController($scope, (control) => {
                        // Remove physical keyboard (if shown for some other element)
                        $(":focus").trigger("blur");
                        // Navigate to the very top of the page
                        $(window).scrollTop(0);

                        if (control) {
                            $('html').addClass('virtual-keyboard-on');
                            timeout(() => $('html').addClass("virtual-keyboard-on-animated"), MxVirtualKeyboard.AnimationDelay);
                        } else {
                            $('html').removeClass('virtual-keyboard-on').removeClass("virtual-keyboard-on-animated");
                        }
                    });

                    keyboardService.Pressed.SubscribeController($scope, key => {
                        if (key === "[LEFT]") {
                            keyboardLeftArrowClicked();
                        }
                        else if (key === "[RIGHT]") {
                            keyboardRightArrowClicked();
                        }
                        else if (key === "[CLOSE]") {
                            keyboardService.SetCurrentControl(null);
                        }
                    });

                    var keyboardLeftArrowClicked = () => {
                        var currentInput = keyboardService.GetCurrentControl();
                        if (currentInput != null) {
                            var controls = $(".mx-virtual-keyboard-input-control:visible");
                            var index = controls.index(currentInput);
                            if (index > 0) {
                                var targetInput = controls[index - 1];
                                $(targetInput).triggerHandler("touchstart");
                            }
                        }
                    };

                    var keyboardRightArrowClicked = () => {
                        var currentInput = keyboardService.GetCurrentControl();
                        if (currentInput != null) {
                            var controls = $(".mx-virtual-keyboard-input-control:visible");
                            var index = controls.index(currentInput);
                            if (index >= 0 && index < controls.length - 1) {
                                var targetInput = controls[index + 1];
                                $(targetInput).triggerHandler("touchstart");
                            }
                        }
                    }

                    // Global click event handler
                    // If a user clicks outside of the virtual keyboard area, remove focus from the element.

                    $('html').on("touchstart", (event) => {
                        var virtKeyboard = $(event.target).parents(".mx-virtual-keyboard");
                        if (virtKeyboard.length === 0) {
                            keyboardService.SetCurrentControl(null);
                        }
                    });
                }
            };
        }
    }
    NG.CoreModule.RegisterDirective("mxVirtualKeyboard", MxVirtualKeyboard, Core.$virtualKeyboardService, Core.Constants, NG.$timeout);
}  