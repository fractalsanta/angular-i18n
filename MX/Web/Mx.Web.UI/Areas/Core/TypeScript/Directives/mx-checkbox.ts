module Core {

    export interface ICheckboxScope extends ng.IScope {
        Checked: boolean;
        Model: boolean;
        Disabled: boolean;
        Text: string;
        Toggle(): void;
        Class: string;
    }

    export class MxCheckbox implements ng.IDirective {
        constructor() {
            return <ng.IDirective>{
                restrict: "E",
                scope: {
                    // only one of "ng-model" and "checked" is required
                    // see PropotionDetails.html for both use cases
                    Model: "=?ngModel",
                    Checked: "=?checked",
                    Disabled: "=?ngDisabled",
                    Text: "=?text",
                    Class: "@?class"
                },
                templateUrl: "/Areas/Core/Templates/mx-checkbox.html",
                link: (scope: ICheckboxScope, elem: ng.IAugmentedJQuery): void => {

                    if (angular.isDefined(scope.Checked)) {
                        scope.$watch("Checked", () => {
                            scope.Model = scope.Checked;
                        });
                    }

                    scope.Toggle = () => {
                        if (!scope.Disabled) {
                            scope.Model = !scope.Model;

                            var ctrl = elem.controller('ngModel');
                            if (angular.isDefined(ctrl)) {
                                // this marks form as dirty
                                ctrl.$setViewValue(scope.Model);
                            }
                        }
                    };
                }
            }
        }
    }

    NG.CoreModule.RegisterDirective("mxCheckbox", MxCheckbox);
}