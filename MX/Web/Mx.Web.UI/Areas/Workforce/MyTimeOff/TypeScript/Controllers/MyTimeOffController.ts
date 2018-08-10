module Workforce.MyTimeOff {
    "use strict";

    interface INewRequest {
        AllDay: boolean;
        StartDateTime: Date;
        EndDateTime: Date;
        ReasonId: string;
        Comments: string;
        StartDateLimit: Date;
        DateLimit: Date;
        ShowStartDateDisplay: boolean;
        ShowEndDateDisplay: boolean;
    }

    interface IMyTimeOffController extends ng.ui.bootstrap.IModalScope {
        Model: {
            Date: Date;
        };
        Translations: Api.Models.IL10N;
        TimeOffRequests: MySchedule.Api.Models.ITimeOffRequest[];
        TimeOffReasons: any;
        SelectedRequest: MySchedule.Api.Models.ITimeOffRequest;
        NewRequest: INewRequest;

        InDetailMode: boolean;
        InAddMode: boolean;
        ModalInstance: ng.ui.bootstrap.IModalServiceInstance;
        SettingStart: boolean;

        AddNewRequest(): void;
        DiscardNewRequest(): ng.IPromise<void>;
        SubmitRequest(request: INewRequest): void;
        ViewRequest(request: MySchedule.Api.Models.ITimeOffRequest): void;
        ResetDetailMode(): void;
        RemoveRequest(request: MySchedule.Api.Models.ITimeOffRequest): void;
        SetAllDayFlag(flag: boolean): void;
        ToggleStartDateDisplay(e: Event): void;
        ToggleEndDateDisplay(e: Event): void;
        SetDate(date: Date): void;

        IsRequestPending(request: MySchedule.Api.Models.ITimeOffRequest): boolean;
        IsRequestForAllDay(request: MySchedule.Api.Models.ITimeOffRequest): boolean;
        IsRequestForMultipleDays(request: MySchedule.Api.Models.ITimeOffRequest): boolean;

        GetStatusTranslation(requestStatus: MySchedule.Api.Models.TimeOffRequestStatus): string;
        GetStatusIconClass(requestStatus: MySchedule.Api.Models.TimeOffRequestStatus): string;
        GetStatusIconColor(requestStatus: MySchedule.Api.Models.TimeOffRequestStatus): string;
        GetAllDayRequestEndDate(request: MySchedule.Api.Models.ITimeOffRequest): Date;

        OnStartDateTimeChange(newDate: Date): void;
        OnEndDateTimeChange(newDate: Date): void;
    }

    class MyTimeOffController {
        private _inDiscard: boolean;

        constructor(
            private $scope: IMyTimeOffController,
            translationService: Core.ITranslationService,
            private popupMessageService: Core.IPopupMessageService,
            private myTimeOffService: MySchedule.Api.IMyTimeOffService,
            private timeOffReasonService: Api.ITimeOffReasonService,
            private confirmation: Core.IConfirmationService,
            private notification: Core.IPopupMessageService,
            $location: ng.ILocationService,
            constants: Core.IConstants,
            private $modal: ng.ui.bootstrap.IModalService
            ) {

            this._inDiscard = false;

            $scope.InDetailMode = false;
            $scope.InAddMode = false;

            $scope.AddNewRequest = (): void => {
                var tomorrow = this.GetDateAtMidnight(moment().toDate()).add("d", 1).toDate(),
                    defaultReasonId = "";

                for (var reasonId in $scope.TimeOffReasons) {
                    defaultReasonId = reasonId;
                    break;
                }

                $scope.NewRequest = {
                    AllDay: true,
                    StartDateTime: tomorrow,
                    EndDateTime: tomorrow,
                    ReasonId: defaultReasonId,
                    Comments: "",
                    StartDateLimit: tomorrow,
                    DateLimit: tomorrow,
                    ShowStartDateDisplay: false,
                    ShowEndDateDisplay: false
                };

                $scope.InAddMode = true;
                $scope.InDetailMode = true;
            };

            $scope.DiscardNewRequest = (): ng.IPromise<any> => {

                var promise = confirmation.Confirm({
                    Title: $scope.Translations.DiscardRequestConfirmation,
                    Message: $scope.Translations.DiscardTimeOffRequest,
                    ConfirmationType: Core.ConfirmationTypeEnum.Positive,
                    ConfirmText: $scope.Translations.Confirm
                });

                promise.then((): void => {
                    $scope.InAddMode = false;
                    $scope.ResetDetailMode();
                },
                () => {
                    this._inDiscard = false;
                });

                this._inDiscard = true;
                return promise;
            };

            $scope.SubmitRequest = (request: INewRequest): void => {
                var startTime = request.StartDateTime,
                    endTime = request.EndDateTime;

                if (!request.AllDay && startTime === endTime) {
                    popupMessageService.ShowWarning($scope.Translations.StartAndEndTimeCannotBeTheSame);
                    return;
                }

                if (request.AllDay) {
                    startTime = this.GetDateAtMidnight(startTime).toDate();
                    endTime = this.GetDateAtMidnight(endTime).toDate();
                }

                var start = moment(startTime);
                var end = moment(endTime);
                var hours: number;
                if (request.AllDay) {
                    hours = 0;
                }
                else {
                    hours = end.diff(start) / 60 / 60 / 1000;
                }

                var newRequest: Api.Models.INewTimeOffRequest = {
                    StartDateTime: start.format(constants.InternalDateTimeFormat),
                    EndDateTime: end.format(constants.InternalDateTimeFormat),
                    ReasonId: Number(request.ReasonId),
                    Comments: request.Comments,
                    Hours: hours
                };

                myTimeOffService.PostNewRequest(newRequest).success((result: Api.Models.INewTimeOffResult): void => {
                    if (result.Successful) {
                        this.GetFutureTimeOffRequests();

                        $scope.NewRequest = null;
                        $scope.InAddMode = false;
                        $scope.ResetDetailMode();
                    } else {
                        popupMessageService.ShowError($scope.Translations[result.Message]);
                    }
                });
            };

            $scope.ViewRequest = (request: MySchedule.Api.Models.ITimeOffRequest): void => {
                if ($scope.InAddMode) {
                    $scope.DiscardNewRequest().then((): void => {
                        $scope.ViewRequest(request);
                    });

                    return;
                }

                $scope.SelectedRequest = request;
                $scope.InDetailMode = true;
            };

            $scope.ResetDetailMode = (): void => {
                $scope.InDetailMode = false;
            };

            $scope.RemoveRequest = (request: MySchedule.Api.Models.ITimeOffRequest): void => {
                confirmation.Confirm({
                    Title: $scope.Translations.RemoveRequestConfirmation,
                    Message: $scope.Translations.RemoveTimeOffRequest,
                    ConfirmationType: Core.ConfirmationTypeEnum.Danger,
                    ConfirmText: $scope.Translations.Remove
                }).then((): void => {
                        myTimeOffService.PostCancelRequest(request.RequestId).success((): void => {
                            popupMessageService.ShowSuccess($scope.Translations.RequestRemoved);
                            $scope.ResetDetailMode();
                            this.GetFutureTimeOffRequests();
                        });
                    }
                );
            };

            $scope.SetAllDayFlag = (flag: boolean): void => {
                if ($scope.NewRequest) {
                    $scope.NewRequest.AllDay = flag;
                }
            };

            $scope.ToggleStartDateDisplay = (e: Event): void => {
                $scope.Model.Date = $scope.NewRequest.StartDateTime;
                this.OpenDatePicker();
                $scope.SettingStart = true;
                $scope.NewRequest.DateLimit = $scope.NewRequest.StartDateLimit;

                if ($scope.NewRequest) {
                    $scope.NewRequest.ShowStartDateDisplay = !$scope.NewRequest.ShowStartDateDisplay;
                    $scope.NewRequest.ShowEndDateDisplay = false;
                }
            };



            $scope.SetDate = (date: Date) => {
                if ($scope.SettingStart) {
                    if (date < $scope.NewRequest.StartDateLimit)
                        date = $scope.NewRequest.StartDateLimit;

                    $scope.NewRequest.StartDateTime = date;
                    if ($scope.NewRequest.EndDateTime < date)
                        $scope.NewRequest.EndDateTime = date;
                } else {
                    if (date < $scope.NewRequest.StartDateTime)
                        date = $scope.NewRequest.StartDateTime;
                    $scope.NewRequest.EndDateTime = date;
                }
                $scope.ModalInstance.close();
            }

            $scope.ToggleEndDateDisplay = (): void => {
                $scope.Model.Date = $scope.NewRequest.EndDateTime;
                $scope.SettingStart = false;
                this.OpenDatePicker();
                $scope.NewRequest.DateLimit = $scope.NewRequest.StartDateTime;

                if ($scope.NewRequest) {
                    $scope.NewRequest.ShowEndDateDisplay = !$scope.NewRequest.ShowEndDateDisplay;
                    $scope.NewRequest.ShowStartDateDisplay = false;
                }
            };

            $scope.IsRequestPending = (request: MySchedule.Api.Models.ITimeOffRequest): boolean => {
                return (request.Status === MySchedule.Api.Models.TimeOffRequestStatus.Requested);
            };

            $scope.IsRequestForAllDay = (request: MySchedule.Api.Models.ITimeOffRequest): boolean => {
                var startDate = moment(request.StartDateTime),
                    endDate = moment(request.EndDateTime);

                return (startDate.hours() === 0 && endDate.hours() === 0);
            };

            $scope.IsRequestForMultipleDays = (request: MySchedule.Api.Models.ITimeOffRequest): boolean => {
                var startDate = this.GetDateAtMidnight(moment(request.StartDateTime).toDate()),
                    endDate = this.GetDateAtMidnight(moment(request.EndDateTime).toDate());

                return (startDate.diff(endDate) !== 0);
            };

            $scope.GetStatusTranslation = (requestStatus: MySchedule.Api.Models.TimeOffRequestStatus): string => {
                switch (requestStatus) {
                    case MySchedule.Api.Models.TimeOffRequestStatus.Approved:
                        return $scope.Translations.Approved;
                    case MySchedule.Api.Models.TimeOffRequestStatus.Declined:
                        return $scope.Translations.Denied;
                    case MySchedule.Api.Models.TimeOffRequestStatus.Requested:
                        return $scope.Translations.Pending;
                    default:
                        return "";
                }
            };

            $scope.GetStatusIconClass = (requestStatus: MySchedule.Api.Models.TimeOffRequestStatus): string => {
                switch (requestStatus) {
                    case MySchedule.Api.Models.TimeOffRequestStatus.Approved:
                        return "fa-check";
                    case MySchedule.Api.Models.TimeOffRequestStatus.Declined:
                        return "fa-ban";
                    case MySchedule.Api.Models.TimeOffRequestStatus.Requested:
                        return "fa-clock-o";
                    default:
                        return "";
                }
            };

            $scope.GetStatusIconColor = (requestStatus: MySchedule.Api.Models.TimeOffRequestStatus): string => {
                switch (requestStatus) {
                    case MySchedule.Api.Models.TimeOffRequestStatus.Approved:
                        return "green";
                    case MySchedule.Api.Models.TimeOffRequestStatus.Declined:
                        return "red";
                    case MySchedule.Api.Models.TimeOffRequestStatus.Requested:
                        return "orange";
                    default:
                        return "";
                }
            };

            $scope.GetAllDayRequestEndDate = (request: MySchedule.Api.Models.ITimeOffRequest): Date => {
                return moment(request.EndDateTime).toDate();
            };

            $scope.OnStartDateTimeChange = (newDate: Date): void => {
                if ($scope.NewRequest && newDate !== null) {
                    if ($scope.NewRequest.StartDateLimit > newDate) {
                        newDate = $scope.NewRequest.StartDateLimit;
                        $scope.NewRequest.StartDateTime = newDate;
                    }

                    if ($scope.NewRequest.EndDateTime < newDate) {
                        $scope.NewRequest.EndDateTime = newDate;
                    }
                }
            };

            $scope.OnEndDateTimeChange = (newDate: Date): void => {
                if ($scope.NewRequest && newDate !== null) {
                    if ($scope.NewRequest.StartDateTime > newDate) {
                        $scope.NewRequest.EndDateTime = $scope.NewRequest.StartDateTime;
                    }
                }
            };

            translationService.GetTranslations().then((result: Core.Api.Models.ITranslations): void => {
                $scope.Translations = result.WorkforceMyTimeOff;
                popupMessageService.SetPageTitle($scope.Translations.MyTimeOff);
                if (! $scope.ModalInstance) {
                    this.GetFutureTimeOffRequests();
                }
            });

            $scope.$on("$locationChangeStart", (e: ng.IAngularEvent, newUrl: string): void => {
                var targetPath = newUrl.split("#");

                if ($scope.InAddMode && targetPath.length > 1) {

                    if (!this._inDiscard) {
                        $scope.DiscardNewRequest().then((): void => {
                            $location.path(targetPath[1]);
                        });
                    }

                    e.preventDefault();
                }
            });
        }

        private OpenDatePicker(): void {
            this.$scope.NewRequest.DateLimit = new Date();
            this.$scope.ModalInstance = this.$modal.open({
                templateUrl: 'timeOffDatePicker.html',
                controller: MyTimeOffController,
                windowClass: "datepicker",
                scope: this.$scope
            });
        }

        private GetFutureTimeOffRequests(): void {
            this.myTimeOffService.GetFutureTimeOffRequests().success((result: MySchedule.Api.Models.ITimeOffRequest[]): void => {
                this.$scope.SelectedRequest = null;
                this.$scope.TimeOffRequests = result;
            });

            this.timeOffReasonService.GetReasons().success((results: any): void => {
                this.$scope.TimeOffReasons = results;
            });
        }

        private GetDateAtMidnight(currentDate: Date): Moment {
            return moment(currentDate).hours(0).minutes(0).seconds(0).milliseconds(0);
        }
    }

    Core.NG.WorkforceMyTimeOffModule.RegisterRouteController("", "Templates/MyTimeOff.html", MyTimeOffController,
        Core.NG.$typedScope<IMyTimeOffController>(),
        Core.$translation,
        Core.$popupMessageService,
        MySchedule.Api.$myTimeOffService,
        Api.$timeOffReasonService,
        Core.$confirmationService,
        Core.$popupMessageService,
        Core.NG.$location,
        Core.Constants,
        Core.NG.$modal
        );
}