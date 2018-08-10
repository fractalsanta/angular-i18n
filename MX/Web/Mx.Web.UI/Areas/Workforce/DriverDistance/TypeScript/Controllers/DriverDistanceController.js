var Workforce;
(function (Workforce) {
    var DriverDistance;
    (function (DriverDistance) {
        "use strict";
        var Task = Core.Api.Models.Task;
        var DriverDistanceStatus = DriverDistance.Api.Models.Enums.DriverDistanceStatus;
        var DriverDistanceController = (function () {
            function DriverDistanceController($scope, $routeParams, translationService, popupMessageService, authorizationService, $locationService, managerDriverDistanceService, employeeDriverDistanceService, constants, $modal) {
                var _this = this;
                this.$scope = $scope;
                this.translationService = translationService;
                this.popupMessageService = popupMessageService;
                this.authorizationService = authorizationService;
                this.managerDriverDistanceService = managerDriverDistanceService;
                this.employeeDriverDistanceService = employeeDriverDistanceService;
                this.constants = constants;
                this.$modal = $modal;
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
                    DatePickerOptions: {
                        Date: tripDate.toDate(),
                        DayOffset: 1,
                        MonthOffset: 0,
                        Max: moment().toDate()
                    },
                    CanViewOthersRecords: canViewOthersRecords,
                    CanAuthoriseRecords: canAuthoriseRecords,
                    DriverDistanceRecords: []
                };
                $scope.OnDatePickerChange = function (selectedDate) {
                    var selectedMoment = moment(selectedDate);
                    if (!_this.AreTwoDatesSame(_this._lastSelectedDate, selectedMoment)) {
                        _this.LoadData(selectedMoment);
                    }
                };
                $scope.CanActionRecord = function (record) {
                    return ($scope.Vm.CanViewOthersRecords
                        && $scope.Vm.CanAuthoriseRecords
                        && record.Status === DriverDistanceStatus.Pending);
                };
                $scope.DoRecordsExist = function () {
                    return ($scope.Vm.DriverDistanceRecords && !!$scope.Vm.DriverDistanceRecords.length);
                };
                $scope.GetTotalDistance = function (record) {
                    return (record.EndDistance - record.StartDistance);
                };
                $scope.GetStatusIconClass = function (record) {
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
                $scope.GetDisplayStatus = function (record) {
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
                $scope.AddDriveRecord = function () {
                    var modalInstance = _this.$modal.open({
                        templateUrl: "/Areas/Workforce/DriverDistance/Templates/AddDriverDistance.html",
                        controller: "Workforce.DriverDistance.AddDriverDistanceController",
                        resolve: {
                            selectedDate: function () {
                                return $scope.Vm.DatePickerOptions.Date;
                            }
                        }
                    });
                    modalInstance.result.then(function () {
                        _this.LoadData(_this._lastSelectedDate);
                    });
                };
                $scope.Approve = function (record) {
                    _this.OpenActionModalForRecordWithIntendedStatus(record, DriverDistanceStatus.Approved);
                };
                $scope.Deny = function (record) {
                    _this.OpenActionModalForRecordWithIntendedStatus(record, DriverDistanceStatus.Denied);
                };
                this.LoadTranslations();
                this.LoadData(moment($scope.Vm.DatePickerOptions.Date));
            }
            DriverDistanceController.prototype.LoadTranslations = function () {
                var _this = this;
                this.translationService.GetTranslations().then(function (translations) {
                    _this.$scope.L10N = translations.WorkforceDriverDistance;
                    _this.popupMessageService.SetPageTitle(_this.$scope.L10N.DriverDistance);
                });
            };
            DriverDistanceController.prototype.LoadData = function (date) {
                var _this = this;
                date = this.SetDateToMidnight(date);
                var promise, user = this.authorizationService.GetUser(), formattedDate = date.format(this.constants.InternalDateTimeFormat);
                this.$scope.Vm.DriverDistanceRecords = [];
                this._lastSelectedDate = date;
                if (this.$scope.Vm.CanViewOthersRecords) {
                    promise = this.managerDriverDistanceService.GetRecordsForEntityByDate(user.BusinessUser.MobileSettings.EntityId, formattedDate);
                }
                else {
                    promise = this.employeeDriverDistanceService.GetRecordsForEmployeeByEntityAndDate(user.BusinessUser.EmployeeId, user.BusinessUser.MobileSettings.EntityId, formattedDate);
                }
                promise.success(function (results) {
                    results = _.sortBy(results, function (record) {
                        return moment(record.SubmitTime).toDate();
                    });
                    _this.$scope.Vm.DriverDistanceRecords = results;
                });
            };
            DriverDistanceController.prototype.SetDateToMidnight = function (date) {
                return date.hours(0).minutes(0).seconds(0).milliseconds(0);
            };
            DriverDistanceController.prototype.AreTwoDatesSame = function (dateOne, dateTwo) {
                return (dateOne.year() === dateTwo.year()
                    && dateOne.month() === dateTwo.month()
                    && dateOne.date() === dateTwo.date());
            };
            DriverDistanceController.prototype.OpenActionModalForRecordWithIntendedStatus = function (record, status) {
                var _this = this;
                var resolveObject = {};
                resolveObject[DriverDistance.ActionDriverDistanceController.RecordToActionResolveName] = function () {
                    return record;
                };
                resolveObject[DriverDistance.ActionDriverDistanceController.NewStatusResolveName] = function () {
                    return status;
                };
                var modalInstance = this.$modal.open({
                    templateUrl: "Areas/Workforce/DriverDistance/Templates/ActionDriverDistance.html",
                    controller: "Workforce.DriverDistance.ActionDriverDistanceController",
                    resolve: resolveObject
                });
                modalInstance.result.then(function () {
                    _this.LoadData(_this._lastSelectedDate);
                });
            };
            DriverDistanceController.PendingIconClass = "mx-col-info fa fa-spinner";
            DriverDistanceController.ApprovedIconClass = "mx-col-success fa fa-check";
            DriverDistanceController.DeniedIconClass = "mx-col-warning fa fa-minus";
            return DriverDistanceController;
        }());
        DriverDistance.DriverDistanceController = DriverDistanceController;
        Core.NG.WorkforceDriverDistanceModule.RegisterRouteController("", "Templates/DriverDistance.html", DriverDistanceController, Core.NG.$typedScope(), Core.NG.$typedStateParams(), Core.$translation, Core.$popupMessageService, Core.Auth.$authService, Core.NG.$location, DriverDistance.Api.$driverDistanceManagerService, DriverDistance.Api.$driverDistanceEmployeeService, Core.Constants, Core.NG.$modal);
        Core.NG.WorkforceDriverDistanceModule.RegisterRouteController(":TripDate", "Templates/DriverDistance.html", DriverDistanceController, Core.NG.$typedScope(), Core.NG.$typedStateParams(), Core.$translation, Core.$popupMessageService, Core.Auth.$authService, Core.NG.$location, DriverDistance.Api.$driverDistanceManagerService, DriverDistance.Api.$driverDistanceEmployeeService, Core.Constants, Core.NG.$modal);
    })(DriverDistance = Workforce.DriverDistance || (Workforce.DriverDistance = {}));
})(Workforce || (Workforce = {}));
