var Workforce;
(function (Workforce) {
    var DriverDistance;
    (function (DriverDistance) {
        var Tests;
        (function (Tests) {
            "use strict";
            var DriverDistanceStatus = DriverDistance.Api.Models.Enums.DriverDistanceStatus;
            describe("@ts ActionDriverDistanceController", function () {
                var controllerScope, modalServiceInstanceMock, translationServiceMock, authMock, driverDistanceManagerServiceMock, recordToAction, promiseHelper;
                var createTestController = function (status) {
                    return new DriverDistance.ActionDriverDistanceController(controllerScope, modalServiceInstanceMock.Object, translationServiceMock.Object, authMock.Object, driverDistanceManagerServiceMock.Object, recordToAction, status);
                };
                var createApprovalTestController = function () {
                    return createTestController(DriverDistanceStatus.Approved);
                };
                var createDenialTestController = function () {
                    return createTestController(DriverDistanceStatus.Denied);
                };
                beforeEach(function () {
                    inject(function ($rootScope, $q) {
                        controllerScope = $rootScope.$new();
                        modalServiceInstanceMock = new Core.Tests.ModalServiceInstanceMock($q);
                        translationServiceMock = new Core.Tests.TranslationServiceMock($q);
                        authMock = new Core.Tests.AuthServiceMock();
                        driverDistanceManagerServiceMock = new Tests.DriverDistanceManagerServiceMock($q);
                        promiseHelper = new PromiseHelper($q);
                    });
                    recordToAction = {};
                });
                it("defines all scope methods and non-promise models upon initialization", function () {
                    createApprovalTestController();
                    expect(controllerScope.Vm).toBeDefined();
                    expect(controllerScope.Vm.ActionTitle).toBeDefined();
                    expect(controllerScope.Vm.ActionMessage).toBeDefined();
                    expect(controllerScope.Vm.Authorization).toBeDefined();
                    expect(controllerScope.Vm.AuthorizationIsValid).toBeDefined();
                    expect(controllerScope.Vm.ValidationErrorMessage).toBeDefined();
                    expect(controllerScope.Vm.SubmitButtonClass).toBeDefined();
                    expect(controllerScope.Vm.SubmitButtonText).toBeDefined();
                    expect(controllerScope.Submit).toBeDefined();
                    expect(controllerScope.Cancel).toBeDefined();
                });
                it("loads translations upon initialization", function () {
                    createApprovalTestController();
                    expect(controllerScope.L10N).toBeUndefined();
                    controllerScope.$digest();
                    expect(controllerScope.L10N).toBeDefined();
                });
                it("dismisses the modal when cancelled", function () {
                    var dismissSpy = spyOn(modalServiceInstanceMock.Object, "dismiss");
                    createApprovalTestController();
                    controllerScope.Cancel();
                    expect(dismissSpy).toHaveBeenCalled();
                });
                it("dismisses the modal when provided an unsupported pending driver distance status", function () {
                    var dismissSpy = spyOn(modalServiceInstanceMock.Object, "dismiss");
                    createTestController(DriverDistanceStatus.Pending);
                    expect(dismissSpy).toHaveBeenCalled();
                });
                it("sets the appropriate view model values for approvals", function () {
                    var testTranslations = {
                        ApproveTitle: "Test Appove Title",
                        ApproveMessage: "Test Approve Message",
                        Submit: "Test Submit"
                    };
                    recordToAction.EmployeeName = "Test Employee Name";
                    var controller = createApprovalTestController();
                    expect(controllerScope.Vm.ActionTitle).toBe("");
                    expect(controllerScope.Vm.ActionMessage).toBe("");
                    expect(controllerScope.Vm.SubmitButtonText).toBe("");
                    expect(controllerScope.Vm.SubmitButtonClass).toBe("");
                    controller.InitializeViewModelTranslations(testTranslations);
                    expect(controllerScope.Vm.ActionTitle).toBe(testTranslations.ApproveTitle);
                    expect(controllerScope.Vm.ActionMessage).toBe(testTranslations.ApproveMessage + " " + recordToAction.EmployeeName + "?");
                    expect(controllerScope.Vm.SubmitButtonText).toBe(testTranslations.Submit);
                    expect(controllerScope.Vm.SubmitButtonClass).toBe(DriverDistance.ActionDriverDistanceController.ApprovalSubmitButtonClass);
                });
                it("sets the appropriate view model values for denials", function () {
                    var testTranslations = {
                        DenyTitle: "Test Deny Title",
                        DenyMessage: "Test Deny Message",
                        Deny: "Test Deny"
                    };
                    recordToAction.EmployeeName = "Test Employee Name";
                    var controller = createDenialTestController();
                    expect(controllerScope.Vm.ActionTitle).toBe("");
                    expect(controllerScope.Vm.ActionMessage).toBe("");
                    expect(controllerScope.Vm.SubmitButtonText).toBe("");
                    expect(controllerScope.Vm.SubmitButtonClass).toBe("");
                    controller.InitializeViewModelTranslations(testTranslations);
                    expect(controllerScope.Vm.ActionTitle).toBe(testTranslations.DenyTitle);
                    expect(controllerScope.Vm.ActionMessage).toBe(testTranslations.DenyMessage + " " + recordToAction.EmployeeName + "?");
                    expect(controllerScope.Vm.SubmitButtonText).toBe(testTranslations.Deny);
                    expect(controllerScope.Vm.SubmitButtonClass).toBe(DriverDistance.ActionDriverDistanceController.DenySubmitButtonClass);
                });
                it("can check if required view model properties are set", function () {
                    createApprovalTestController();
                    var noValuesSet = controllerScope.AreRequiredFieldsSet();
                    controllerScope.Vm.Authorization.UserName = "Test UserName";
                    controllerScope.Vm.Authorization.Password = "Test Password";
                    var valuesSet = controllerScope.AreRequiredFieldsSet();
                    expect(noValuesSet).toBeFalsy();
                    expect(valuesSet).toBeTruthy();
                });
                it("does not take any action when attempting to submit if the required fields are not set", function () {
                    var methodSpy = spyOn(driverDistanceManagerServiceMock.Object, "PutActionDriverDistanceRecord");
                    methodSpy.and.callFake(function (request) {
                        return promiseHelper.CreateHttpPromise({});
                    });
                    createApprovalTestController();
                    controllerScope.Submit();
                    expect(methodSpy.wasCalled).toBeFalsy();
                });
                it("does take action when attempting to submit when the required fields are set", function () {
                    var methodSpy = spyOn(driverDistanceManagerServiceMock.Object, "PutActionDriverDistanceRecord");
                    methodSpy.and.callFake(function (request) {
                        return promiseHelper.CreateHttpPromise({});
                    });
                    createApprovalTestController();
                    controllerScope.Vm.Authorization.UserName = "Test UserName";
                    controllerScope.Vm.Authorization.Password = "Test Password";
                    controllerScope.Submit();
                    expect(methodSpy).toHaveBeenCalled();
                });
                it("builds a action request object during the submit made from the record to action, new status, and authorizer", function () {
                    var methodSpy = spyOn(driverDistanceManagerServiceMock.Object, "PutActionDriverDistanceRecord"), testStatus = DriverDistanceStatus.Approved, passedRequest;
                    methodSpy.and.callFake(function (entityId, request) {
                        passedRequest = request;
                        expect(passedRequest.DriverDistanceId).toBe(recordToAction.Id);
                        expect(passedRequest.Status).toBe(testStatus);
                        expect(passedRequest.Authorization).toBe(controllerScope.Vm.Authorization);
                        return promiseHelper.CreateHttpPromise({});
                    });
                    recordToAction = { Id: 101 };
                    createTestController(testStatus);
                    controllerScope.Vm.Authorization.UserName = "Test UserName";
                    controllerScope.Vm.Authorization.Password = "Test Password";
                    controllerScope.Submit();
                    expect(methodSpy).toHaveBeenCalled();
                    expect(passedRequest).toBeDefined();
                });
            });
        })(Tests = DriverDistance.Tests || (DriverDistance.Tests = {}));
    })(DriverDistance = Workforce.DriverDistance || (Workforce.DriverDistance = {}));
})(Workforce || (Workforce = {}));
