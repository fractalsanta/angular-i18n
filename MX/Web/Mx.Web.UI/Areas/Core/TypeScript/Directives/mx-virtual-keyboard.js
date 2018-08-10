var Core;
(function (Core) {
    var MxVirtualKeyboard = (function () {
        function MxVirtualKeyboard(keyboardService, constants, timeout) {
            if (!constants.TouchKeyboardEnabled || !$("html").hasClass("touch")) {
                return {};
            }
            return {
                restrict: "E",
                templateUrl: "/Areas/Core/Templates/mx-virtual-keyboard.html",
                link: function ($scope, element) {
                    $scope.MainKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.'];
                    keyboardService.ControlChanged.SubscribeController($scope, function (control) {
                        $(":focus").trigger("blur");
                        $(window).scrollTop(0);
                        if (control) {
                            $('html').addClass('virtual-keyboard-on');
                            timeout(function () { return $('html').addClass("virtual-keyboard-on-animated"); }, MxVirtualKeyboard.AnimationDelay);
                        }
                        else {
                            $('html').removeClass('virtual-keyboard-on').removeClass("virtual-keyboard-on-animated");
                        }
                    });
                    keyboardService.Pressed.SubscribeController($scope, function (key) {
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
                    var keyboardLeftArrowClicked = function () {
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
                    var keyboardRightArrowClicked = function () {
                        var currentInput = keyboardService.GetCurrentControl();
                        if (currentInput != null) {
                            var controls = $(".mx-virtual-keyboard-input-control:visible");
                            var index = controls.index(currentInput);
                            if (index >= 0 && index < controls.length - 1) {
                                var targetInput = controls[index + 1];
                                $(targetInput).triggerHandler("touchstart");
                            }
                        }
                    };
                    $('html').on("touchstart", function (event) {
                        var virtKeyboard = $(event.target).parents(".mx-virtual-keyboard");
                        if (virtKeyboard.length === 0) {
                            keyboardService.SetCurrentControl(null);
                        }
                    });
                }
            };
        }
        MxVirtualKeyboard.AnimationDelay = 300;
        return MxVirtualKeyboard;
    }());
    Core.MxVirtualKeyboard = MxVirtualKeyboard;
    Core.NG.CoreModule.RegisterDirective("mxVirtualKeyboard", MxVirtualKeyboard, Core.$virtualKeyboardService, Core.Constants, Core.NG.$timeout);
})(Core || (Core = {}));
