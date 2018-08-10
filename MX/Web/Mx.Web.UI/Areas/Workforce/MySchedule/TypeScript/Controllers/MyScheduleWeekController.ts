module Workforce.MySchedule {

    interface IMyScheduleWeekControllerScope extends ng.IScope {
        L10N: Api.Models.IL10N;
        InputValue: number;
        GetScheduledDate(selectedDate: Date): void;
        SetSelectedShift(index: number):void;
        GetTeamSchedules(index: number): void;
        GetDailyHours(startDate: Date): string;
        GetTotalHours(): string;
        ShowDayHeader(index: number): boolean;
        IsTimeOff(index: number): boolean;
        GetColorCode(calEntry: Api.Models.ICalendarEntry): string;
        ShareScheduleRange(): void;
        GetTimeOffStatus(index: number): { Status: string; Icon: string };
        GetTimeOffStatusIcon(index: number): string;
        GetTimeOffHours(index: number): string;
        AnyShifts(): boolean;
        ChangeDates(startDate: Date, endDate: Date):void;
        vm: {
            Loaded: boolean;
            Schedule: Array<Workforce.MySchedule.Api.Models.ICalendarEntry>;
            TeamSchedules: string;
            DatesString: string;
        };
    }

    var datePartCompareFormat = "YYMMDD";
    var usedColorCodes: any = {};
    var visibleDayHeaders: any = {};
    var calculatedDailyHours: any = {};
    var calculatedTotalHours: string;

    enum ColorCode {
        Blue = 0,
        Purple = 1,
        Red = 2,
        Green = 3,
        Yellow = 4,
        Brown = 5,
        Pink = 6,
        Gray = 7,
        DarkRed = 8,
        Silver = 9,
        PowederBlue = 10,
        Coral = 11
    }

    class MyScheduleWeekController {
        constructor(
            private $scope: IMyScheduleWeekControllerScope,
            private authService: Core.Auth.IAuthService,
            private myScheduleService: IMyScheduleService,
            private translationService: Core.ITranslationService,
            private popupMessageService: Core.IPopupMessageService,
            private $modal: ng.ui.bootstrap.IModalService,
            private dateService: Core.Date.IDateService,
            private constants: Core.IConstants,
            private layoutService: Core.ILayoutService
        ) {
            $scope.vm.Loaded = false;

            $scope.ChangeDates = (startDate: Date, endDate: Date): void => {
                $scope.vm.Loaded = false;
                $scope.vm.DatesString = moment(startDate).format("LL") + " - " + moment(endDate).format("LL");
                myScheduleService.GetShiftsByDateRange(moment(startDate), moment(endDate)).then((response) => {
                    this.ResetCalculatedfields();
                    $scope.vm.Schedule = response;
                    $scope.vm.Loaded = true;
                });
            };

            dateService.StartOfWeek(moment()).then(day => {
                $scope.ChangeDates(day.toDate(), moment(day).add({ days: 6 }).toDate());
            });

            $scope.$on("$stateChangeSuccess", () => this.layoutService.SetMobileReady(true));

            translationService.GetTranslations().then((l10NData) => {
                $scope.L10N = l10NData.WorkforceMySchedule;
                popupMessageService.SetPageTitle($scope.L10N.MySchedule);
            });


            $scope.SetSelectedShift = (index: number) => {
                myScheduleService.SetSelectedShift($scope.vm.Schedule[index]);
            };

            $scope.ShowDayHeader = (index: number): boolean => {
                if (!visibleDayHeaders.hasOwnProperty(index.toString())) {
                    if (index) {
                        var currShift = $scope.vm.Schedule[index];
                        var prevShift = $scope.vm.Schedule[index - 1];
                        if (moment(currShift.StartDateTime).format(datePartCompareFormat) === moment(prevShift.StartDateTime).format(datePartCompareFormat)) {
                            visibleDayHeaders[index] = false;
                        } else {
                            visibleDayHeaders[index] = true;
                        }
                    } else {
                        visibleDayHeaders[index] = true;
                    }
                }
                return visibleDayHeaders[index];
            };

            $scope.IsTimeOff = (index: number): boolean=> {
                return $scope.vm.Schedule[index].IsTimeOffRequest;
            };

            $scope.GetTimeOffStatus = (index: number) => myScheduleService.GetTimeOffStatus($scope.vm.Schedule[index], $scope.L10N);

            $scope.GetTimeOffHours = (index: number): string => {
                if (moment($scope.vm.Schedule[index].StartDateTime).diff(moment($scope.vm.Schedule[index].EndDateTime), "hours") == -24) {
                    return $scope.L10N.ScheduleAllDay;
                } else {
                    return moment($scope.vm.Schedule[index].StartDateTime).format("LT") + " - " + moment($scope.vm.Schedule[index].EndDateTime).format("LT");
                }
            };

            $scope.GetColorCode = (calEntry: Api.Models.ICalendarEntry): string => {
                if (!calEntry.IsTimeOffRequest) {
                    if (!usedColorCodes.hasOwnProperty(calEntry.EntityId.toString())) {
                        var lastUsedColor: number = -1;
                        $.each(usedColorCodes, (prop: string, value: number) => {
                            if (value >= lastUsedColor) {
                                lastUsedColor = value;
                            }
                        });
                        usedColorCodes[calEntry.EntityId] = ++lastUsedColor;
                    }
                    return ColorCode[usedColorCodes[calEntry.EntityId]] || "black";
                } else {
                    return "transparent";
                }
            };

            $scope.GetDailyHours = (startDate: Date): string => {
                var currDate = moment(startDate).format(datePartCompareFormat);
                if (!calculatedDailyHours.hasOwnProperty(currDate)) {
                    var filtered = _.where($scope.vm.Schedule, shift => !shift.IsTimeOffRequest && moment(shift.StartDateTime).format(datePartCompareFormat) === currDate);
                    var dailyTime = _.reduce(
                        filtered,
                        (acc:number, shift) => acc + moment(shift.EndDateTime).diff(moment(shift.StartDateTime), "minutes"),
                        0);

                    if (dailyTime > 0) {
                        calculatedDailyHours[currDate] = dailyTime > 60 ? Math.floor(dailyTime / 60) + $scope.L10N.Hours + " " + (dailyTime % 60) + $scope.L10N.Minutes : dailyTime + $scope.L10N.Minutes;
                    } else {
                        calculatedDailyHours[currDate] = "";
                    }
                }
                return calculatedDailyHours[currDate];
            };

            $scope.GetTotalHours = (): string => {
                if (!calculatedTotalHours) {
                    if ($scope.vm.Schedule && $scope.vm.Schedule.length) {
                        var total = 0;
                        for (var i = 0; i < $scope.vm.Schedule.length; i++) {
                            if (!$scope.vm.Schedule[i].IsTimeOffRequest) {
                                total += moment($scope.vm.Schedule[i].EndDateTime).diff(moment($scope.vm.Schedule[i].StartDateTime), "minutes");
                            }
                        }
                        calculatedTotalHours = total > 60 ? Math.floor(total / 60) + $scope.L10N.Hours + " " + (total % 60) + $scope.L10N.Minutes : total + $scope.L10N.Minutes;
                    }
                }
                return calculatedTotalHours;
            };

            $scope.AnyShifts = () => {
                return _.some($scope.vm.Schedule, s => !s.IsTimeOffRequest);
            };

            $scope.ShareScheduleRange = (): void => {
                $modal.open(<ng.ui.bootstrap.IModalSettings>{
                    templateUrl: "Areas/Workforce/MySchedule/Templates/ShareSchedule.html",
                    controller: "Workforce.MySchedule.ShareScheduleController",
                    resolve: {
                        isSingleShift: () => {
                            return false;
                        }
                    }
                });
            };

        }

        ResetCalculatedfields(): void {
            usedColorCodes = {};
            visibleDayHeaders = {};
            calculatedDailyHours = {};
            calculatedTotalHours = null;
        }
    }


    export var myScheduleWeekController = Core.NG.WorkforceMyScheduleModule.RegisterNamedController("MyScheduleWeekController", MyScheduleWeekController,
        Core.NG.$typedScope<IMyScheduleWeekControllerScope>(),
        Core.Auth.$authService,
        myScheduleService,
        Core.$translation,
        Core.$popupMessageService,
        Core.NG.$modal,
        Core.Date.$dateService,
        Core.Constants,
        Core.layoutService
        );
}
