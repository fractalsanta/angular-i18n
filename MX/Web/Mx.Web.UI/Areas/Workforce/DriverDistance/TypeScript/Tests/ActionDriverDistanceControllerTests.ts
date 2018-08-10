/// <reference path="../../../../Core/Tests/TestFramework.ts" />
/// <reference path="DriverDistanceManagerServiceMock.ts"/>
/// <reference path="../Interfaces/IActionDriverDistanceControllerScope.d.ts" />
/// <reference path="../Controllers/ActionDriverDistanceController.ts" />

module Workforce.DriverDistance.Tests {
    "use strict";

    import DriverDistanceStatus = Api.Models.Enums.DriverDistanceStatus;

    describe("@ts ActionDriverDistanceController", (): void => {
        var controllerScope: IActionDriverDistanceControllerScope,
            modalServiceInstanceMock: Core.Tests.ModalServiceInstanceMock,
            translationServiceMock: Core.Tests.TranslationServiceMock,
            authMock: Core.Tests.AuthServiceMock,
            driverDistanceManagerServiceMock: DriverDistanceManagerServiceMock,
            recordToAction: Api.Models.IDriverDistanceRecord,
            promiseHelper: PromiseHelper;

        var createTestController = (status: DriverDistanceStatus): ActionDriverDistanceController => {
            return new ActionDriverDistanceController(
                controllerScope,
                modalServiceInstanceMock.Object,
                translationServiceMock.Object,
                authMock.Object,
                driverDistanceManagerServiceMock.Object,
                recordToAction,
                status);
        };

        var createApprovalTestController = (): ActionDriverDistanceController => {
            return createTestController(DriverDistanceStatus.Approved);
        };

        var createDenialTestController = (): ActionDriverDistanceController => {
            return createTestController(DriverDistanceStatus.Denied);
        };

        beforeEach((): void => {

            inject(($rootScope: ng.IRootScopeService, $q: ng.IQService): void => {
                controllerScope = <IActionDriverDistanceControllerScope>$rootScope.$new();

                modalServiceInstanceMock = new Core.Tests.ModalServiceInstanceMock($q);
                translationServiceMock = new Core.Tests.TranslationServiceMock($q);
                authMock = new Core.Tests.AuthServiceMock();
                driverDistanceManagerServiceMock = new DriverDistanceManagerServiceMock($q);

                promiseHelper = new PromiseHelper($q);
            });

            recordToAction = <Api.Models.IDriverDistanceRecord>{};
        });

        it("defines all scope methods and non-promise models upon initialization", (): void => {
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

        it("loads translations upon initialization", (): void => {
            createApprovalTestController();

            expect(controllerScope.L10N).toBeUndefined();

            controllerScope.$digest();

            expect(controllerScope.L10N).toBeDefined();
        });

        it("dismisses the modal when cancelled", (): void => {
            var dismissSpy = spyOn(modalServiceInstanceMock.Object, "dismiss");

            createApprovalTestController();

            controllerScope.Cancel();

            expect(dismissSpy).toHaveBeenCalled();
        });

        it("dismisses the modal when provided an unsupported pending driver distance status", (): void => {
            var dismissSpy = spyOn(modalServiceInstanceMock.Object, "dismiss");

            createTestController(DriverDistanceStatus.Pending);

            expect(dismissSpy).toHaveBeenCalled();
        });

        it("sets the appropriate view model values for approvals", (): void => {
            var testTranslations = <Api.Models.IL10N>{
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
            expect(controllerScope.Vm.SubmitButtonClass).toBe(ActionDriverDistanceController.ApprovalSubmitButtonClass);
        });

        it("sets the appropriate view model values for denials", (): void => {
            var testTranslations = <Api.Models.IL10N>{
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
            expect(controllerScope.Vm.SubmitButtonClass).toBe(ActionDriverDistanceController.DenySubmitButtonClass);
        });

        it("can check if required view model properties are set", (): void => {
            createApprovalTestController();

            var noValuesSet = controllerScope.AreRequiredFieldsSet();

            controllerScope.Vm.Authorization.UserName = "Test UserName";
            controllerScope.Vm.Authorization.Password = "Test Password";

            var valuesSet = controllerScope.AreRequiredFieldsSet();

            expect(noValuesSet).toBeFalsy();
            expect(valuesSet).toBeTruthy();
        });

        it("does not take any action when attempting to submit if the required fields are not set", (): void => {
            var methodSpy = spyOn(driverDistanceManagerServiceMock.Object, "PutActionDriverDistanceRecord");

            methodSpy.and.callFake((request: Api.Models.IActionDriverDistanceRequest): ng.IHttpPromise<{}> => {
                return promiseHelper.CreateHttpPromise({});
            });

            createApprovalTestController();

            controllerScope.Submit();

            expect(methodSpy.wasCalled).toBeFalsy();
        });

        it("does take action when attempting to submit when the required fields are set", (): void => {
            var methodSpy = spyOn(driverDistanceManagerServiceMock.Object, "PutActionDriverDistanceRecord");

            

            methodSpy.and.callFake((request: Api.Models.IActionDriverDistanceRequest): ng.IHttpPromise<{}> => {
                return promiseHelper.CreateHttpPromise({});
            });

            createApprovalTestController();

            controllerScope.Vm.Authorization.UserName = "Test UserName";
            controllerScope.Vm.Authorization.Password = "Test Password";

            controllerScope.Submit();

            expect(methodSpy).toHaveBeenCalled();
        });

        it("builds a action request object during the submit made from the record to action, new status, and authorizer", (): void => {
            var methodSpy = spyOn(driverDistanceManagerServiceMock.Object, "PutActionDriverDistanceRecord"),
                testStatus = DriverDistanceStatus.Approved,
                passedRequest: Api.Models.IActionDriverDistanceRequest;

            methodSpy.and.callFake((entityId: number, request: Api.Models.IActionDriverDistanceRequest): ng.IHttpPromise<{}> => {
                passedRequest = request;

                expect(passedRequest.DriverDistanceId).toBe(recordToAction.Id);
                expect(passedRequest.Status).toBe(testStatus);
                expect(passedRequest.Authorization).toBe(controllerScope.Vm.Authorization);

                return promiseHelper.CreateHttpPromise({});
            });

            recordToAction = <Api.Models.IDriverDistanceRecord>{ Id: 101 };

            createTestController(testStatus);

            controllerScope.Vm.Authorization.UserName = "Test UserName";
            controllerScope.Vm.Authorization.Password = "Test Password";

            controllerScope.Submit();

            expect(methodSpy).toHaveBeenCalled();
            expect(passedRequest).toBeDefined();
        });
    });
}