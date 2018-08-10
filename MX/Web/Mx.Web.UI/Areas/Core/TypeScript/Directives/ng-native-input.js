var Core;
(function (Core) {
    var Directives;
    (function (Directives) {
        "use strict";
        var InputType = (function () {
            function InputType() {
            }
            InputType.Date = "date";
            InputType.Time = "time";
            return InputType;
        }());
        Directives.InputType = InputType;
        var NgInput = (function () {
            function NgInput() {
                return {
                    restrict: "E",
                    require: "?ngModel",
                    link: function ($scope, element, attrs, ngModel) {
                        var originalDateTime;
                        if (ngModel) {
                            switch (attrs.type) {
                                case InputType.Date:
                                    ngModel.$formatters.push(function (modelValue) {
                                        originalDateTime = moment(modelValue);
                                        return originalDateTime.format("YYYY-MM-DD");
                                    });
                                    ngModel.$parsers.push(function (viewValue) {
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
                                    ngModel.$formatters.push(function (modelValue) {
                                        originalDateTime = moment(modelValue);
                                        return originalDateTime.format("HH:mm");
                                    });
                                    ngModel.$parsers.push(function (viewValue) {
                                        if (!viewValue) {
                                            viewValue = "00:00";
                                            ngModel.$setViewValue(viewValue);
                                            ngModel.$render();
                                        }
                                        var newDateTime = moment(originalDateTime), timeParts = viewValue.split(":");
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
            return NgInput;
        }());
        Core.NG.CoreModule.RegisterDirective("input", NgInput);
    })(Directives = Core.Directives || (Core.Directives = {}));
})(Core || (Core = {}));
