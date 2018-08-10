var Core;
(function (Core) {
    var MxCheckbox = (function () {
        function MxCheckbox() {
            return {
                restrict: "E",
                scope: {
                    Model: "=?ngModel",
                    Checked: "=?checked",
                    Disabled: "=?ngDisabled",
                    Text: "=?text",
                    Class: "@?class"
                },
                templateUrl: "/Areas/Core/Templates/mx-checkbox.html",
                link: function (scope, elem) {
                    if (angular.isDefined(scope.Checked)) {
                        scope.$watch("Checked", function () {
                            scope.Model = scope.Checked;
                        });
                    }
                    scope.Toggle = function () {
                        if (!scope.Disabled) {
                            scope.Model = !scope.Model;
                            var ctrl = elem.controller('ngModel');
                            if (angular.isDefined(ctrl)) {
                                ctrl.$setViewValue(scope.Model);
                            }
                        }
                    };
                }
            };
        }
        return MxCheckbox;
    }());
    Core.MxCheckbox = MxCheckbox;
    Core.NG.CoreModule.RegisterDirective("mxCheckbox", MxCheckbox);
})(Core || (Core = {}));
