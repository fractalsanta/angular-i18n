var Core;
(function (Core) {
    var Directives;
    (function (Directives) {
        "use strict";
        var MxCalendarController = (function () {
            function MxCalendarController($scope) {
                this.$scope = $scope;
                $scope.$watch("Options.StartDate", function () { return $scope.Options.Selected = undefined; });
                $scope.IsCurrentMonth = function (day) { return moment(day.Date).month() === $scope.Options.Month.month(); };
                $scope.IsToday = function (day) { return moment(day.Date).diff(moment().startOf("day"), "days", true) === 0; };
                $scope.SelectDay = function (day) {
                    if ($scope.Options.Selected === day) {
                        $scope.Options.Selected = null;
                    }
                    else {
                        $scope.Options.Selected = day;
                    }
                };
            }
            return MxCalendarController;
        }());
        Core.NG.CoreModule.RegisterNamedController("MxCalendarController", MxCalendarController, Core.NG.$typedScope(), Core.$translation);
        var MxCalendarDirective = (function () {
            function MxCalendarDirective() {
                return {
                    restrict: "E",
                    scope: {
                        Options: "=options"
                    },
                    replace: true,
                    templateUrl: "/Areas/Core/Templates/mx-calendar-directive.html",
                    controller: "Core.MxCalendarController"
                };
            }
            return MxCalendarDirective;
        }());
        Core.NG.CoreModule.RegisterDirective("mxCalendar", MxCalendarDirective);
    })(Directives = Core.Directives || (Core.Directives = {}));
})(Core || (Core = {}));
