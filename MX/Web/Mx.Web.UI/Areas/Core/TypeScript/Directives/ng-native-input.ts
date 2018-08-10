module Core.Directives {
    "use strict";

    export class InputType {
        public static Date = "date";
        public static Time = "time";
    }

    interface IInputAttributes extends ng.IAttributes {
        type: string;
    }

    class NgInput implements ng.IDirective {
        constructor() {
            return <ng.IDirective>{
                restrict: "E",
                require: "?ngModel",
                link: ($scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: IInputAttributes, ngModel: ng.INgModelController): void => {
                    var originalDateTime: Moment;

                    if (ngModel) {
                        switch (attrs.type) {
                            case InputType.Date:
                                ngModel.$formatters.push((modelValue: Date): string => {
                                    originalDateTime = moment(modelValue);

                                    return originalDateTime.format("YYYY-MM-DD");
                                });

                                ngModel.$parsers.push((viewValue: string): Date => {
                                    if (!viewValue) {
                                        return null;
                                    }

                                    var parsedDate = moment(viewValue);

                                    parsedDate.hours(originalDateTime.hours());
                                    parsedDate.minutes(originalDateTime.minutes());
                                    parsedDate.seconds(originalDateTime.seconds());
                                    parsedDate.milliseconds(originalDateTime.milliseconds());

                                    originalDateTime = parsedDate;

                                    return parsedDate.toDate();
                                });
                                break;
                            case InputType.Time:
                                ngModel.$formatters.push((modelValue: Date): string => {
                                    originalDateTime = moment(modelValue);

                                    return originalDateTime.format("HH:mm");
                                });

                                ngModel.$parsers.push((viewValue: string): Date => {
                                    if (!viewValue) {
                                        viewValue = "00:00";
                                        ngModel.$setViewValue(viewValue);
                                        ngModel.$render();
                                    }

                                    var newDateTime = moment(originalDateTime),
                                        timeParts = viewValue.split(":");

                                    if (timeParts[0] !== undefined) {
                                        newDateTime.hours(Number(timeParts[0]));
                                    }

                                    if (timeParts[1] !== undefined) {
                                        newDateTime.minutes(Number(timeParts[1]));
                                    }

                                    if (timeParts[2] !== undefined) {
                                        newDateTime.seconds(Number(timeParts[2]));
                                    }

                                    originalDateTime = newDateTime;

                                    return newDateTime.toDate();
                                });
                                break;
                            default:
                                break;
                        }
                    }
                }
            };
        }
    }

    Core.NG.CoreModule.RegisterDirective("input", NgInput);
} 