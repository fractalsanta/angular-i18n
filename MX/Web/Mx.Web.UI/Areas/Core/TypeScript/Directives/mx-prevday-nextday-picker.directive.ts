module Core.NG {
    "use strict";

    interface IMxPrevdayNextdayPickerScope extends ng.IScope {
        Options: IMxDayPickerOptions;

        PopupOpened: boolean;

        OnClick(): void;
        OnSelectedDayChange(): void;
        OnDateChange(updateObject: { selectedDate: Date }): void;

        InstanceModel: { TargetDate: Date };

        PrevDay(): void;
        NextDay(): void;
    }

    export interface IMxDayPickerOptions {
        Date: Date;
        DayOffset: number;
        MonthOffset?: number;
        Min?: Date;
        Max?: Date;
    }

    class MxPrevdayNextdayPicker implements ng.IDirective {
        constructor(
            $timeout: ng.ITimeoutService
            ) {


            return <ng.IDirective>{
                restrict: "E",
                scope: { Options: "=options", OnDateChange: "&onChange" },
                replace: true,
                templateUrl: "/Areas/Core/Templates/mx-prevday-nextday-picker.html",
                link: ($scope: IMxPrevdayNextdayPickerScope, element: any): void => {

                    var clickDelay: number = 200;

                    var timer = null;

                    $(element).on("focus", "button", (e: JQueryEventObject) => {
                        $(e.target).blur();
                    });

                    $scope.InstanceModel = { TargetDate: $scope.Options.Date };

                    $scope.OnClick = (): void => {
                        $scope.PopupOpened = true;
                    };

                    $scope.OnSelectedDayChange = (): void => {
                        if (timer) {
                            $timeout.cancel(timer);
                            timer = null;
                        }

                        timer = $timeout(() => {
                            $scope.Options.Date = $scope.InstanceModel.TargetDate;
                            $scope.OnDateChange({ selectedDate: $scope.InstanceModel.TargetDate });
                        }, clickDelay);
                    };

                    $scope.PrevDay = (): void => {
                        $scope.InstanceModel.TargetDate =
                        moment($scope.InstanceModel.TargetDate).add("d", -$scope.Options.DayOffset).toDate();
                        $scope.InstanceModel.TargetDate =
                        moment($scope.InstanceModel.TargetDate).add("M", -$scope.Options.MonthOffset).toDate();

                        if ($scope.Options.Min && $scope.InstanceModel.TargetDate < $scope.Options.Min) {
                            $scope.InstanceModel.TargetDate = $scope.Options.Min;
                        }

                        $scope.OnSelectedDayChange();
                    };

                    $scope.NextDay = (): void => {
                        $scope.InstanceModel.TargetDate =
                            moment($scope.InstanceModel.TargetDate).add("d", +$scope.Options.DayOffset).toDate();
                        $scope.InstanceModel.TargetDate =
                            moment($scope.InstanceModel.TargetDate).add("M", +$scope.Options.MonthOffset).toDate();

                        if ($scope.Options.Max && $scope.InstanceModel.TargetDate > $scope.Options.Max) {
                            $scope.InstanceModel.TargetDate = $scope.Options.Max;
                        }

                        $scope.OnSelectedDayChange();
                    };
                    
                    $scope.$watch("Options.Date", (): void => {
                        $scope.InstanceModel.TargetDate = $scope.Options.Date;
                    });
                }
            };
        }
    }
    NG.CoreModule.RegisterDirective("mxPrevdayNextdayPicker", MxPrevdayNextdayPicker,
        NG.$timeout
        );
}