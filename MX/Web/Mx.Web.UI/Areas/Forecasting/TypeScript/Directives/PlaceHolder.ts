module Forecasting {
    "use strict";

    export interface IPlaceholdScope extends ng.IScope {
        txt: string;
        val: any;
    }

    export class Placehold implements ng.IDirective {
        constructor() {
            return <ng.IDirective>{
                restrict: "A",
                scope: { txt: "@placehold" },
                link: (scope: IPlaceholdScope, element: ng.IAugmentedJQuery): void => {
                    element.on("focus", (): void => {
                        if (element.val() === scope.txt) {
                            element.val("");
                        }
                        scope.$apply();
                    });

                    element.on("blur", (): void => {
                        if (element.val() !== "") {
                            element.val(element.val());
                        } else {
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
    }

    Core.NG.ForecastingModule.RegisterDirective("placehold", Placehold);
}