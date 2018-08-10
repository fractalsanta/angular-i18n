var Core;
(function (Core) {
    var NG;
    (function (NG) {
        "use strict";
        var MxPrevdayNextdayPicker = (function () {
            function MxPrevdayNextdayPicker($timeout) {
                return {
                    restrict: "E",
                    scope: { Options: "=options", OnDateChange: "&onChange" },
                    replace: true,
                    templateUrl: "/Areas/Core/Templates/mx-prevday-nextday-picker.html",
                    link: function ($scope, element) {
                        var clickDelay = 200;
                        var timer = null;
                        $(element).on("focus", "button", function (e) {
                            $(e.target).blur();
                        });
                        $scope.InstanceModel = { TargetDate: $scope.Options.Date };
                        $scope.OnClick = function () {
                            $scope.PopupOpened = true;
                        };
                        $scope.OnSelectedDayChange = function () {
                            if (timer) {
                                $timeout.cancel(timer);
                                timer = null;
                            }
                            timer = $timeout(function () {
                                $scope.Options.Date = $scope.InstanceModel.TargetDate;
                                $scope.OnDateChange({ selectedDate: $scope.InstanceModel.TargetDate });
                            }, clickDelay);
                        };
                        $scope.PrevDay = function () {
                            $scope.InstanceModel.TargetDate =
                                moment($scope.InstanceModel.TargetDate).add("d", -$scope.Options.DayOffset).toDate();
                            $scope.InstanceModel.TargetDate =
                                moment($scope.InstanceModel.TargetDate).add("M", -$scope.Options.MonthOffset).toDate();
                            if ($scope.Options.Min && $scope.InstanceModel.TargetDate < $scope.Options.Min) {
                                $scope.InstanceModel.TargetDate = $scope.Options.Min;
                            }
                            $scope.OnSelectedDayChange();
                        };
                        $scope.NextDay = function () {
                            $scope.InstanceModel.TargetDate =
                                moment($scope.InstanceModel.TargetDate).add("d", +$scope.Options.DayOffset).toDate();
                            $scope.InstanceModel.TargetDate =
                                moment($scope.InstanceModel.TargetDate).add("M", +$scope.Options.MonthOffset).toDate();
                            if ($scope.Options.Max && $scope.InstanceModel.TargetDate > $scope.Options.Max) {
                                $scope.InstanceModel.TargetDate = $scope.Options.Max;
                            }
                            $scope.OnSelectedDayChange();
                        };
                        $scope.$watch("Options.Date", function () {
                            $scope.InstanceModel.TargetDate = $scope.Options.Date;
                        });
                    }
                };
            }
            return MxPrevdayNextdayPicker;
        }());
        NG.CoreModule.RegisterDirective("mxPrevdayNextdayPicker", MxPrevdayNextdayPicker, NG.$timeout);
    })(NG = Core.NG || (Core.NG = {}));
})(Core || (Core = {}));
