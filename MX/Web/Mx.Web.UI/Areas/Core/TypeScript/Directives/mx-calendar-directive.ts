module Core.Directives {
    "use strict";

    interface IMxCalendarScope extends ng.IScope {
        Options: IMxCalendarViewOptions;
        IsToday(day: IMxCalendarViewDay): boolean;
        IsCurrentMonth(day: IMxCalendarViewDay): boolean;
        SelectDay(day: IMxCalendarViewDay);
    }

    export interface IMxCalendarViewDay {
        Date: Date;
        InfoTexts: string[];
        StatusTexts: string[];
        IsClosed: boolean;
    }

    export interface IMxCalendarViewOptions {
        Month: Moment;
        StartDate: Moment;
        Days: IMxCalendarViewDay[];
        Selected?: IMxCalendarViewDay;
    }

    class MxCalendarController {
        constructor(
            private $scope: IMxCalendarScope
            ) {
            
            $scope.$watch("Options.StartDate", () => $scope.Options.Selected = undefined);

            $scope.IsCurrentMonth = day => moment(day.Date).month() === $scope.Options.Month.month();
            $scope.IsToday = day => moment(day.Date).diff(moment().startOf("day"), "days", true) === 0;

            $scope.SelectDay = day => {
                if ($scope.Options.Selected === day) {
                    $scope.Options.Selected = null;
                } else {
                    $scope.Options.Selected = day;
                }
            };
        }
    }

    Core.NG.CoreModule.RegisterNamedController("MxCalendarController", MxCalendarController,
        Core.NG.$typedScope<IMxCalendarScope>(),
        Core.$translation);

    class MxCalendarDirective implements ng.IDirective {
        constructor() {
            return <ng.IDirective>{
                restrict: "E",
                scope: {
                    Options: "=options"
                },
                replace: true,
                templateUrl: "/Areas/Core/Templates/mx-calendar-directive.html",
                controller: "Core.MxCalendarController"
            };
        }
    }

    NG.CoreModule.RegisterDirective("mxCalendar", MxCalendarDirective);
}