module Workforce.DriverDistance {
    "use strict";

    import Task = Core.Api.Models.Task;
    import DriverDistanceStatus = Api.Models.Enums.DriverDistanceStatus;

    export class DriverDistanceController {
        private _lastSelectedDate: Moment;

        public static PendingIconClass: string = "mx-col-info fa fa-spinner";
        public static ApprovedIconClass: string = "mx-col-success fa fa-check";
        public static DeniedIconClass: string = "mx-col-warning fa fa-minus";

        constructor(
            private $scope: IDriverDistanceControllerScope,
            $routeParams: IDriverDistanceControllerRouteParams,
            private translationService: Core.ITranslationService,
            private popupMessageService: Core.IPopupMessageService,
            private authorizationService: Core.Auth.IAuthService,
            $locationService: ng.ILocationService,
            private managerDriverDistanceService: Api.IDriverDistanceManagerService,
            private employeeDriverDistanceService: Api.IDriverDistanceEmployeeService,
            private constants: Core.IConstants,
            private $modal: ng.ui.bootstrap.IModalService
            ) {

            var canViewPage = authorizationService.CheckPermissionAllowance(Task.Labor_EmployeePortal_DriverDistance_CanView);

            if (!canViewPage) {
                $locationService.path("/Core/Forbidden");
                return;
            }

            var canViewOthersRecords = authorizationService
                .CheckPermissionAllowance(Task.Labor_EmployeePortal_DriverDistance_CanViewOthersEntries);

            var canAuthoriseRecords = authorizationService
                .CheckPermissionAllowance(Task.Labor_EmployeePortal_DriverDistance_CanAuthorise);

            var tripDate = moment();
            if ($routeParams.TripDate) {
                tripDate = moment($routeParams.TripDate);
                if (!tripDate.isValid()) {
                    tripDate = moment();
                }
            }

            $scope.Vm = {
                DatePickerOptions: <Core.NG.IMxDayPickerOptions>{
                    Date: tripDate.toDate(),
                    DayOffset: 1,
                    MonthOffset: 0,
                    Max: moment().toDate()
                },

                CanViewOthersRecords: canViewOthersRecords,
                CanAuthoriseRecords: canAuthoriseRecords,

                DriverDistanceRecords: []
            };

            $scope.OnDatePickerChange = (selectedDate: Date): void => {
                var selectedMoment = moment(selectedDate);

                if (!this.AreTwoDatesSame(this._lastSelectedDate, selectedMoment)) {
                    this.LoadData(selectedMoment);
                }
            };

            $scope.CanActionRecord = (record: Api.Models.IDriverDistanceRecord): boolean => {
                return ($scope.Vm.CanViewOthersRecords
                    && $scope.Vm.CanAuthoriseRecords
                    && record.Status === DriverDistanceStatus.Pending);
            };

            $scope.DoRecordsExist = (): boolean => {
                return ($scope.Vm.DriverDistanceRecords && !!$scope.Vm.DriverDistanceRecords.length);
            };

            $scope.GetTotalDistance = (record: Api.Models.IDriverDistanceRecord): number => {
                return (record.EndDistance - record.StartDistance);
            };

            $scope.GetStatusIconClass = (record: Api.Models.IDriverDistanceRecord): string => {
                var classes = "";

                switch (record.Status) {
                    case DriverDistanceStatus.Pending:
                        classes = DriverDistanceController.PendingIconClass;
                        break;
                    case DriverDistanceStatus.Approved:
                        classes = DriverDistanceController.ApprovedIconClass;
                        break;
                    case DriverDistanceStatus.Denied:
                        classes = DriverDistanceController.DeniedIconClass;
                        break;
                }

                return classes;
            };

            $scope.GetDisplayStatus = (record: Api.Models.IDriverDistanceRecord): string => {
                var status = "";

                if (!$scope.L10N) {
                    return status;
                }

                switch (record.Status) {
                    case DriverDistanceStatus.Pending:
                        status = $scope.L10N.PendingApproval;
                        break;
                    case DriverDistanceStatus.Approved:
                        status = $scope.L10N.Approved;
                        break;
                    case DriverDistanceStatus.Denied:
                        status = $scope.L10N.Denied;
                        break;
                }

                return status;
            };

            $scope.AddDriveRecord = (): void => {
                var modalInstance = this.$modal.open(<ng.ui.bootstrap.IModalSettings>{
                    templateUrl: "/Areas/Workforce/DriverDistance/Templates/AddDriverDistance.html",
                    controller: "Workforce.DriverDistance.AddDriverDistanceController",
                    resolve: {
                        selectedDate: () => {
                            return $scope.Vm.DatePickerOptions.Date;
                        }
                    }
                });

                modalInstance.result.then((): void => {
                    this.LoadData(this._lastSelectedDate);
                });
            };

            $scope.Approve = (record: Api.Models.IDriverDistanceRecord): void => {
                this.OpenActionModalForRecordWithIntendedStatus(record, DriverDistanceStatus.Approved);
            };

            $scope.Deny = (record: Api.Models.IDriverDistanceRecord): void => {
                this.OpenActionModalForRecordWithIntendedStatus(record, DriverDistanceStatus.Denied);
            };

            this.LoadTranslations();
            this.LoadData(moment($scope.Vm.DatePickerOptions.Date));
        }

        public LoadTranslations(): void {
            this.translationService.GetTranslations().then((translations: Core.Api.Models.ITranslations): void => {
                this.$scope.L10N = translations.WorkforceDriverDistance;
                this.popupMessageService.SetPageTitle(this.$scope.L10N.DriverDistance);
            });
        }

        public LoadData(date: Moment): void {
            date = this.SetDateToMidnight(date);

            var promise: ng.IHttpPromise<Api.Models.IDriverDistanceRecord[]>,
                user = this.authorizationService.GetUser(),
                formattedDate = date.format(this.constants.InternalDateTimeFormat);

            this.$scope.Vm.DriverDistanceRecords = [];
            this._lastSelectedDate = date;

            if (this.$scope.Vm.CanViewOthersRecords) {
                promise = this.managerDriverDistanceService.GetRecordsForEntityByDate(
                    user.BusinessUser.MobileSettings.EntityId,
                    formattedDate);
            } else {
                promise = this.employeeDriverDistanceService.GetRecordsForEmployeeByEntityAndDate(
                    user.BusinessUser.EmployeeId,
                    user.BusinessUser.MobileSettings.EntityId,
                    formattedDate);
            }

            promise.success((results: Api.Models.IDriverDistanceRecord[]): void => {
                results = _.sortBy(results, (record: Api.Models.IDriverDistanceRecord): Date => {
                    return moment(record.SubmitTime).toDate();
                });

                this.$scope.Vm.DriverDistanceRecords = results;
            });
        }

        public SetDateToMidnight(date: Moment): Moment {
            return date.hours(0).minutes(0).seconds(0).milliseconds(0);
        }

        public AreTwoDatesSame(dateOne: Moment, dateTwo: Moment): boolean {
            return (dateOne.year() === dateTwo.year()
                && dateOne.month() === dateTwo.month()
                && dateOne.date() === dateTwo.date());
        }

        public OpenActionModalForRecordWithIntendedStatus(record: Api.Models.IDriverDistanceRecord, status: DriverDistanceStatus): void {
            var resolveObject = {};

            resolveObject[ActionDriverDistanceController.RecordToActionResolveName] = (): Api.Models.IDriverDistanceRecord => {
                return record;
            };

            resolveObject[ActionDriverDistanceController.NewStatusResolveName] = (): DriverDistanceStatus => {
                return status;
            };

            var modalInstance = this.$modal.open({
                templateUrl: "Areas/Workforce/DriverDistance/Templates/ActionDriverDistance.html",
                controller: "Workforce.DriverDistance.ActionDriverDistanceController",
                resolve: resolveObject
            });

            modalInstance.result.then((): void => {
                this.LoadData(this._lastSelectedDate);
            });
        }
    }

    Core.NG.WorkforceDriverDistanceModule.RegisterRouteController("", "Templates/DriverDistance.html", DriverDistanceController,
        Core.NG.$typedScope<IDriverDistanceControllerScope>(),
        Core.NG.$typedStateParams<IDriverDistanceControllerRouteParams>(),
        Core.$translation,
        Core.$popupMessageService,
        Core.Auth.$authService,
        Core.NG.$location,
        Api.$driverDistanceManagerService,
        Api.$driverDistanceEmployeeService,
        Core.Constants,
        Core.NG.$modal
        );

    Core.NG.WorkforceDriverDistanceModule.RegisterRouteController(":TripDate", "Templates/DriverDistance.html", DriverDistanceController,
        Core.NG.$typedScope<IDriverDistanceControllerScope>(),
        Core.NG.$typedStateParams<IDriverDistanceControllerRouteParams>(),
        Core.$translation,
        Core.$popupMessageService,
        Core.Auth.$authService,
        Core.NG.$location,
        Api.$driverDistanceManagerService,
        Api.$driverDistanceEmployeeService,
        Core.Constants,
        Core.NG.$modal
        );
}