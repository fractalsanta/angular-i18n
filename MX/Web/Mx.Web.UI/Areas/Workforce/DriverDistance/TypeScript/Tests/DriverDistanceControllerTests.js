var Workforce;
(function (Workforce) {
    var DriverDistance;
    (function (DriverDistance) {
        var Tests;
        (function (Tests) {
            "use strict";
            var DriverDistanceStatus = DriverDistance.Api.Models.Enums.DriverDistanceStatus;
            describe("DriverDistanceController", function () {
                var controllerScope, translationServiceMock, popupMessageServiceMock, authorizationServiceMock, locationService, driverDistanceManagerServiceMock, driverDistanceEmployeeServiceMock, modalServiceMock, constants, promiseHelper, qService;
                var createTestController = function (tripDate) {
                    return new DriverDistance.DriverDistanceController(controllerScope, { TripDate: tripDate }, translationServiceMock.Object, popupMessageServiceMock, authorizationServiceMock.Object, locationService, driverDistanceManagerServiceMock.Object, driverDistanceEmployeeServiceMock.Object, constants, modalServiceMock.Object);
                };
                beforeEach(function () {
                    angular.mock.module(Core.NG.WorkforceDriverDistanceModule.Module().name);
                    inject(function ($rootScope, $q, $location) {
                        locationService = $location;
                        controllerScope = $rootScope.$new();
                        translationServiceMock = new Core.Tests.TranslationServiceMock($q);
                        driverDistanceManagerServiceMock = new Tests.DriverDistanceManagerServiceMock($q);
                        driverDistanceEmployeeServiceMock = new Tests.DriverDistanceEmployeeServiceMock($q);
                        modalServiceMock = new Core.Tests.ModalServiceMock($q, {});
                        promiseHelper = new PromiseHelper($q);
                        qService = $q;
                    });
                    popupMessageServiceMock = new Core.Tests.PopupMessageServiceMock();
                    authorizationServiceMock = new Core.Tests.AuthServiceMock();
                    constants = {};
                });
                it("requires proper authorization to access", function () {
                    authorizationServiceMock.GrantAllPermissions(false);
                    createTestController();
                    expect(locationService.path()).toBe("/Core/Forbidden");
                    expect(controllerScope.L10N).toBeUndefined();
                    expect(controllerScope.Vm).toBeUndefined();
                    expect(controllerScope.OnDatePickerChange).toBeUndefined();
                    expect(controllerScope.CanActionRecord).toBeUndefined();
                    expect(controllerScope.DoRecordsExist).toBeUndefined();
                    expect(controllerScope.GetTotalDistance).toBeUndefined();
                    expect(controllerScope.GetStatusIconClass).toBeUndefined();
                    expect(controllerScope.GetDisplayStatus).toBeUndefined();
                    expect(controllerScope.AddDriveRecord).toBeUndefined();
                    expect(controllerScope.Approve).toBeUndefined();
                    expect(controllerScope.Deny).toBeUndefined();
                });
                it("defines all scope methods and non-promise models upon initialization", function () {
                    createTestController();
                    expect(controllerScope.Vm).toBeDefined();
                    expect(controllerScope.Vm.DatePickerOptions).toBeDefined();
                    expect(controllerScope.Vm.CanViewOthersRecords).toBeDefined();
                    expect(controllerScope.Vm.CanAuthoriseRecords).toBeDefined();
                    expect(controllerScope.Vm.DriverDistanceRecords).toBeDefined();
                    expect(controllerScope.OnDatePickerChange).toBeDefined();
                    expect(controllerScope.CanActionRecord).toBeDefined();
                    expect(controllerScope.DoRecordsExist).toBeDefined();
                    expect(controllerScope.GetTotalDistance).toBeDefined();
                    expect(controllerScope.GetStatusIconClass).toBeDefined();
                    expect(controllerScope.GetDisplayStatus).toBeDefined();
                    expect(controllerScope.AddDriveRecord).toBeDefined();
                    expect(controllerScope.Approve).toBeDefined();
                    expect(controllerScope.Deny).toBeDefined();
                });
                it("loads translations upon initialization", function () {
                    createTestController();
                    expect(controllerScope.L10N).toBeUndefined();
                    controllerScope.$digest();
                    expect(controllerScope.L10N).toBeDefined();
                });
                it("sets the page title upon initialization", function () {
                    var pageTitle = popupMessageServiceMock.GetPageTitle(), testTranslations = {
                        WorkforceDriverDistance: { DriverDistance: "Test Title" }
                    };
                    translationServiceMock.InjectTranslations(testTranslations);
                    createTestController();
                    expect(pageTitle).toBe("");
                    controllerScope.$digest();
                    pageTitle = popupMessageServiceMock.GetPageTitle();
                    expect(pageTitle).toMatch(testTranslations.WorkforceDriverDistance.DriverDistance);
                });
                it("loads data for the current day upon initialization", function () {
                    var passedMoment;
                    var loadSpy = spyOn(DriverDistance.DriverDistanceController.prototype, "LoadData");
                    loadSpy.and.callFake(function (date) {
                        passedMoment = date;
                    });
                    createTestController();
                    var expectedMoment = moment(controllerScope.Vm.DatePickerOptions.Date);
                    expect(loadSpy).toHaveBeenCalled();
                    expect(passedMoment).toBeDefined();
                    expect(expectedMoment.diff(passedMoment)).toBe(0);
                });
                it("configures the day picker control to have a max limit of  the current day", function () {
                    createTestController();
                    var configuredMaxDate = moment(controllerScope.Vm.DatePickerOptions.Max), currentDay = moment();
                    expect(configuredMaxDate.year()).toBe(currentDay.year());
                    expect(configuredMaxDate.month()).toBe(currentDay.month());
                    expect(configuredMaxDate.date()).toBe(currentDay.date());
                });
                it("can determine if there are records to display", function () {
                    createTestController();
                    var shouldNotExist = controllerScope.DoRecordsExist();
                    controllerScope.Vm.DriverDistanceRecords = [{}];
                    var shouldExist = controllerScope.DoRecordsExist();
                    expect(shouldNotExist).toBeFalsy();
                    expect(shouldExist).toBeTruthy();
                });
                it("considers a record un-actionable regardless of status if the user does not have proper permissions", function () {
                    createTestController();
                    controllerScope.Vm.CanAuthoriseRecords = false;
                    controllerScope.Vm.CanViewOthersRecords = false;
                    var pendingRecord = { Status: DriverDistanceStatus.Pending };
                    var approvedRecord = { Status: DriverDistanceStatus.Approved };
                    var deniedRecord = { Status: DriverDistanceStatus.Denied };
                    var pendingRecordResult = controllerScope.CanActionRecord(pendingRecord);
                    var approvedRecordResult = controllerScope.CanActionRecord(approvedRecord);
                    var deniedRecordResult = controllerScope.CanActionRecord(deniedRecord);
                    expect(pendingRecordResult).toBeFalsy();
                    expect(approvedRecordResult).toBeFalsy();
                    expect(deniedRecordResult).toBeFalsy();
                });
                it("considers a record actionable if the user has the proper permissions and the record is pending", function () {
                    createTestController();
                    controllerScope.Vm.CanAuthoriseRecords = true;
                    controllerScope.Vm.CanViewOthersRecords = true;
                    var pendingRecord = { Status: DriverDistanceStatus.Pending };
                    var approvedRecord = { Status: DriverDistanceStatus.Approved };
                    var deniedRecord = { Status: DriverDistanceStatus.Denied };
                    var pendingRecordResult = controllerScope.CanActionRecord(pendingRecord);
                    var approvedRecordResult = controllerScope.CanActionRecord(approvedRecord);
                    var deniedRecordResult = controllerScope.CanActionRecord(deniedRecord);
                    expect(pendingRecordResult).toBeTruthy();
                    expect(approvedRecordResult).toBeFalsy();
                    expect(deniedRecordResult).toBeFalsy();
                });
                it("can calculate the total distance for a driver distance record", function () {
                    createTestController();
                    var record = { StartDistance: 255, EndDistance: 374 };
                    var totalDistance = controllerScope.GetTotalDistance(record);
                    expect(totalDistance).toEqual(record.EndDistance - record.StartDistance);
                });
                it("returns the proper status translation for a record based on status", function () {
                    var translations = {
                        WorkforceDriverDistance: {
                            PendingApproval: "Test Pending Approval",
                            Approved: "Test Approved",
                            Denied: "Test Denied"
                        }
                    };
                    translationServiceMock.InjectTranslations(translations);
                    createTestController();
                    controllerScope.$digest();
                    var pendingRecord = { Status: DriverDistanceStatus.Pending };
                    var approvedRecord = { Status: DriverDistanceStatus.Approved };
                    var deniedRecord = { Status: DriverDistanceStatus.Denied };
                    var pendingRecordResult = controllerScope.GetDisplayStatus(pendingRecord);
                    var approvedRecordResult = controllerScope.GetDisplayStatus(approvedRecord);
                    var deniedRecordResult = controllerScope.GetDisplayStatus(deniedRecord);
                    expect(pendingRecordResult).toBe(translations.WorkforceDriverDistance.PendingApproval);
                    expect(approvedRecordResult).toBe(translations.WorkforceDriverDistance.Approved);
                    expect(deniedRecordResult).toBe(translations.WorkforceDriverDistance.Denied);
                });
                it("returns the proper icon class for a record based on status", function () {
                    createTestController();
                    var pendingRecord = { Status: DriverDistanceStatus.Pending };
                    var approvedRecord = { Status: DriverDistanceStatus.Approved };
                    var deniedRecord = { Status: DriverDistanceStatus.Denied };
                    var pendingRecordResult = controllerScope.GetStatusIconClass(pendingRecord);
                    var approvedRecordResult = controllerScope.GetStatusIconClass(approvedRecord);
                    var deniedRecordResult = controllerScope.GetStatusIconClass(deniedRecord);
                    expect(pendingRecordResult).toBe(DriverDistance.DriverDistanceController.PendingIconClass);
                    expect(approvedRecordResult).toBe(DriverDistance.DriverDistanceController.ApprovedIconClass);
                    expect(deniedRecordResult).toBe(DriverDistance.DriverDistanceController.DeniedIconClass);
                });
                it("can flatten a moment date to midnight", function () {
                    var controller = createTestController();
                    var testMoment = moment("2015-12-05T14:25:30.50");
                    var updatedMoment = controller.SetDateToMidnight(testMoment);
                    expect(updatedMoment.hours()).toBe(0);
                    expect(updatedMoment.minutes()).toBe(0);
                    expect(updatedMoment.seconds()).toBe(0);
                    expect(updatedMoment.milliseconds()).toBe(0);
                    expect(updatedMoment.year()).toBe(testMoment.year());
                    expect(updatedMoment.month()).toBe(testMoment.month());
                    expect(updatedMoment.date()).toBe(testMoment.date());
                });
                it("can compare two moment dates on date only", function () {
                    var controller = createTestController();
                    var testMomentOne = moment("2015-12-05T14:25:30.50");
                    var testMomentTwo = moment("2015-12-05T08:00:00");
                    var testMomentThree = moment("2015-12-04T08:00:00");
                    var shouldMatch = controller.AreTwoDatesSame(testMomentOne, testMomentTwo);
                    var shouldNotMatch = controller.AreTwoDatesSame(testMomentTwo, testMomentThree);
                    expect(shouldMatch).toBeTruthy();
                    expect(shouldNotMatch).toBeFalsy();
                });
                it("loads data by employee and entity for a given date when user cannot view other records", function () {
                    var testData = [{}];
                    driverDistanceEmployeeServiceMock.InjectRecordsToReturn(testData);
                    var controller = createTestController();
                    controllerScope.$digest();
                    expect(controllerScope.Vm.DriverDistanceRecords.length).toBe(0);
                    controllerScope.Vm.CanViewOthersRecords = false;
                    controller.LoadData(moment());
                    controllerScope.$digest();
                    expect(controllerScope.Vm.DriverDistanceRecords.length).toBe(1);
                });
                it("loads data by entity for a given date when user can view other records", function () {
                    var testData = [{}];
                    var controller = createTestController();
                    controllerScope.$digest();
                    expect(controllerScope.Vm.DriverDistanceRecords.length).toBe(0);
                    driverDistanceManagerServiceMock.InjectRecordsToReturn(testData);
                    controller.LoadData(moment());
                    controllerScope.$digest();
                    expect(controllerScope.Vm.DriverDistanceRecords.length).toBe(1);
                });
                it("formats the date to the constant internal date format when requesting data", function () {
                    var passedDateString;
                    var testMoment = moment("2015-12-05");
                    constants.InternalDateTimeFormat = "YYYY-MM-DD HH:mm:ss";
                    var serviceMethodSpy = spyOn(driverDistanceManagerServiceMock.Object, "GetRecordsForEntityByDate");
                    serviceMethodSpy.and.callFake(function (entityId, date) {
                        passedDateString = date;
                        return promiseHelper.CreateHttpPromise([]);
                    });
                    var controller = createTestController();
                    controller.LoadData(testMoment);
                    expect(passedDateString).toBeDefined();
                    expect(passedDateString).toBe(testMoment.format(constants.InternalDateTimeFormat));
                });
                it("orders the loaded records by submit time", function () {
                    var testRecords = [
                        { SubmitTime: "2015-12-05T08:00:00" },
                        { SubmitTime: "2015-12-05T05:30:00" },
                        { SubmitTime: "2015-12-05T12:30:00" },
                        { SubmitTime: "2015-12-05T07:15:00" }
                    ];
                    driverDistanceManagerServiceMock.InjectRecordsToReturn(testRecords);
                    createTestController();
                    controllerScope.$digest();
                    var orderedRecords = controllerScope.Vm.DriverDistanceRecords;
                    expect(orderedRecords.length).toBe(testRecords.length);
                    expect(orderedRecords[0]).toBe(testRecords[1]);
                    expect(orderedRecords[1]).toBe(testRecords[3]);
                    expect(orderedRecords[2]).toBe(testRecords[0]);
                    expect(orderedRecords[3]).toBe(testRecords[2]);
                });
                it("delegates record approval to a helper method with the approve status", function () {
                    var passedRecord, passedStatus, testRecord = {};
                    var methodSpy = spyOn(DriverDistance.DriverDistanceController.prototype, "OpenActionModalForRecordWithIntendedStatus");
                    methodSpy.and.callFake(function (record, status) {
                        passedRecord = record;
                        passedStatus = status;
                    });
                    createTestController();
                    controllerScope.Approve(testRecord);
                    expect(methodSpy).toHaveBeenCalled();
                    expect(passedRecord).toBe(testRecord);
                    expect(passedStatus).toBe(DriverDistanceStatus.Approved);
                });
                it("delegates record denial to a helper method with the denied status", function () {
                    var passedRecord, passedStatus, testRecord = {};
                    var methodSpy = spyOn(DriverDistance.DriverDistanceController.prototype, "OpenActionModalForRecordWithIntendedStatus");
                    methodSpy.and.callFake(function (record, status) {
                        passedRecord = record;
                        passedStatus = status;
                    });
                    createTestController();
                    controllerScope.Deny(testRecord);
                    expect(methodSpy).toHaveBeenCalled();
                    expect(passedRecord).toBe(testRecord);
                    expect(passedStatus).toBe(DriverDistanceStatus.Denied);
                });
                it("can open a modal to action a record with the new target status", function () {
                    var controller = createTestController(), testRecord = {}, testStatus = DriverDistanceStatus.Approved, passedOptions;
                    var modalSpy = spyOn(modalServiceMock.Object, "open");
                    modalSpy.and.callFake(function (options) {
                        var modalInstanceMock = new Core.Tests.ModalServiceInstanceMock(qService);
                        modalInstanceMock.Object.result = promiseHelper.CreatePromise("");
                        passedOptions = options;
                        expect(options.resolve).toBeDefined();
                        expect(options.resolve[DriverDistance.ActionDriverDistanceController.NewStatusResolveName]).toBeDefined();
                        expect(options.resolve[DriverDistance.ActionDriverDistanceController.RecordToActionResolveName]).toBeDefined();
                        expect(options.resolve[DriverDistance.ActionDriverDistanceController.NewStatusResolveName]()).toBe(testStatus);
                        expect(options.resolve[DriverDistance.ActionDriverDistanceController.RecordToActionResolveName]()).toBe(testRecord);
                        return modalInstanceMock.Object;
                    });
                    controller.OpenActionModalForRecordWithIntendedStatus(testRecord, testStatus);
                    expect(modalSpy).toHaveBeenCalled();
                    expect(passedOptions).toBeDefined();
                });
                it("uses the current date if the tripDate route parameter is not provided", function () {
                    var currentTime = moment.utc("2015-04-01 23:59:59");
                    var methodSpy = spyOn(window, "moment");
                    methodSpy.and.callFake(function () { return currentTime; });
                    createTestController();
                    expect(controllerScope.Vm.DatePickerOptions.Date).toBeDefined();
                    expect(controllerScope.Vm.DatePickerOptions.Date).toEqual(currentTime.toDate());
                });
                it("uses the current date if the tripDate route parameter is invalid", function () {
                    var currentTime = moment.utc("2015-04-02 23:59:59");
                    var methodSpy = spyOn(window, "moment");
                    methodSpy.and.callFake(function () { return currentTime; });
                    createTestController("bogus trip date");
                    expect(controllerScope.Vm.DatePickerOptions.Date).toBeDefined();
                    expect(controllerScope.Vm.DatePickerOptions.Date).toEqual(currentTime.toDate());
                });
                it("uses the specified date if the tripDate route parameter is valid", function () {
                    var tripDate = "2014-03-01";
                    var tripDateMoment = moment(tripDate);
                    createTestController(tripDate);
                    expect(controllerScope.Vm.DatePickerOptions.Date).toBeDefined();
                    expect(controllerScope.Vm.DatePickerOptions.Date).toEqual(tripDateMoment.toDate());
                });
            });
        })(Tests = DriverDistance.Tests || (DriverDistance.Tests = {}));
    })(DriverDistance = Workforce.DriverDistance || (Workforce.DriverDistance = {}));
})(Workforce || (Workforce = {}));
