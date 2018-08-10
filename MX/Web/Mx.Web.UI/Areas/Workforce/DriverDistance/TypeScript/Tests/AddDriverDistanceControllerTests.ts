/// <reference path="../../../../Core/Tests/TestFramework.ts" />
/// <reference path="../../../../Core/TypeScript/Extensions.ts" />
/// <reference path="../../../../Core/TypeScript/Directives/mx-prevday-nextday-picker.directive.ts" />
/// <reference path="../../../../../Scripts/angular-ui/validate.ts" />
/// <reference path="../Interfaces/IAddDriverDistanceControllerScope.d.ts" />
/// <reference path="../../../../Core/Tests/Mocks/AuthServiceMock.ts" />
/// <reference path="../Controllers/AddDriverDistanceController.ts" />
/// <reference path="../../../../Core/Tests/Mocks/ModalServiceMock.ts" />
/// <reference path="../Tests/DriverDistanceEmployeeServiceMock.ts" />
/// <reference path="../Tests/DriverDistanceManagerServiceMock.ts" />

module Workforce.DriverDistance.Tests {
    "use strict";

    describe("AddDriverDistanceController", (): void => {
        var controllerScope: IAddDriverDistanceControllerScope,
            authorizationServiceMock: Core.Tests.AuthServiceMock,
            translationServiceMock: Core.Tests.TranslationServiceMock,
            modalInstanceMock: Core.Tests.ModalServiceInstanceMock,
            driverDistanceEmployeeService: DriverDistance.Tests.DriverDistanceEmployeeServiceMock,
            driverDistanceManagerService: DriverDistance.Tests.DriverDistanceManagerServiceMock,
            constants: Core.IConstants,
            date: Date;

        var createTestController = (): AddDriverDistanceController => {
            return new AddDriverDistanceController(
                controllerScope,
                authorizationServiceMock.Object,
                translationServiceMock.Object,
                modalInstanceMock.Object,
                driverDistanceEmployeeService.Object,
                driverDistanceManagerService.Object,
                constants,
                date
               );
        };

        beforeEach((): void => {

            inject(($rootScope: ng.IRootScopeService, $q: ng.IQService): void => {
                controllerScope = <IAddDriverDistanceControllerScope>$rootScope.$new();
                translationServiceMock = new Core.Tests.TranslationServiceMock($q);
                modalInstanceMock = new Core.Tests.ModalServiceInstanceMock($q);
                driverDistanceEmployeeService = new Tests.DriverDistanceEmployeeServiceMock($q);
                driverDistanceManagerService = new Tests.DriverDistanceManagerServiceMock($q);
            });

            authorizationServiceMock = new Core.Tests.AuthServiceMock();

        });

        it("defines all scope methods and non-promise models upon initialization", (): void => {
            createTestController();

            expect(controllerScope.Vm).toBeDefined();
            expect(controllerScope.Vm.AvailableUsers).toBeDefined();
            expect(controllerScope.Vm.SelectedUserId).toBeDefined();
            expect(controllerScope.Vm.StartOdomRead).toBeDefined();
            expect(controllerScope.Vm.EndOdomRead).toBeDefined();
            expect(controllerScope.Vm.Authorize).toBeDefined();
            expect(controllerScope.Vm.ShowAuthorization).toBeDefined();
            expect(controllerScope.Vm.AuthorizationIsValid).toBeDefined();
            expect(controllerScope.Vm.ValidationErrorMessage).toBeDefined();
            expect(controllerScope.Vm.ShowSelectUserPrompt).toBeDefined();

            expect(controllerScope.Cancel).toBeDefined();
            expect(controllerScope.Submit).toBeDefined();
        });

        it("loads translations upon initialization", (): void => {
            createTestController();

            expect(controllerScope.L10N).toBeUndefined();

            controllerScope.$digest();

            expect(controllerScope.L10N).toBeDefined();
        });

        it("denies access to user who can not authorize or view driver distance", (): void => {
            authorizationServiceMock.GrantAllPermissions(false);
            createTestController();

            expect(controllerScope.Vm.ShowAuthorization).toBeFalsy();
            expect(controllerScope.Vm.ShowSelectUserPrompt).toBeFalsy();
        });

        it("grants access to the user who can authorize and view driver distance", (): void => {
            authorizationServiceMock.GrantAllPermissions(true);
            createTestController();

            expect(controllerScope.Vm.ShowAuthorization).toBeTruthy();
            expect(controllerScope.Vm.ShowSelectUserPrompt).toBeTruthy();
        });

        it("dismisses the modal when cancelled", (): void => {
            var dismissSpy = spyOn(modalInstanceMock.Object, "dismiss");

            createTestController();

            controllerScope.Cancel();

            expect(dismissSpy).toHaveBeenCalled();
        });


    });
}