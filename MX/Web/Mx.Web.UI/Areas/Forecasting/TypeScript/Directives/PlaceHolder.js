var Forecasting;
(function (Forecasting) {
    "use strict";
    var Placehold = (function () {
        function Placehold() {
            return {
                restrict: "A",
                scope: { txt: "@placehold" },
                link: function (scope, element) {
                    element.on("focus", function () {
                        if (element.val() === scope.txt) {
                            element.val("");
                        }
                        scope.$apply();
                    });
                    element.on("blur", function () {
                        if (element.val() !== "") {
                            element.val(element.val());
                        }
                        else {
                            element.val(scope.txt);
                        }
                    });
                    scope.val = element.val();
                    scope.$watch("val", function () {
                        if (element.val() === "") {
                            element.val(scope.txt);
                        }
                    });
                }
            };
        }
        return Placehold;
    }());
    Forecasting.Placehold = Placehold;
    Core.NG.ForecastingModule.RegisterDirective("placehold", Placehold);
})(Forecasting || (Forecasting = {}));
