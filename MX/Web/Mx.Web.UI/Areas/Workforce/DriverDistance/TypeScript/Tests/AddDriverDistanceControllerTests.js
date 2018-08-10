var Workforce;
(function (Workforce) {
    var DriverDistance;
    (function (DriverDistance) {
        var Tests;
        (function (Tests) {
            "use strict";
            describe("AddDriverDistanceController", function () {
                var controllerScope, authorizationServiceMock, translationServiceMock, modalInstanceMock, driverDistanceEmployeeService, driverDistanceManagerService, constants, date;
                var createTestController = function () {
                    return new DriverDistance.AddDriverDistanceController(controllerScope, authorizationServiceMock.Object, translationServiceMock.Object, modalInstanceMock.Object, driverDistanceEmployeeService.Object, driverDistanceManagerService.Object, constants, date);
                };
                beforeEach(function () {
                    inject(function ($rootScope, $q) {
                        controllerScope = $rootScope.$new();
                        translationServiceMock = new Core.Tests.TranslationServiceMock($q);
                        modalInstanceMock = new Core.Tests.ModalServiceInstanceMock($q);
                        driverDistanceEmployeeService = new Tests.DriverDistanceEmployeeServiceMock($q);
                        driverDistanceManagerService = new Tests.DriverDistanceManagerServiceMock($q);
                    });
                    authorizationServiceMock = new Core.Tests.AuthServiceMock();
                });
                it("defines all scope methods and non-promise models upon initialization", function () {
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
                it("loads translations upon initialization", function () {
                    createTestController();
                    expect(controllerScope.L10N).toBeUndefined();
                    controllerScope.$digest();
                    expect(controllerScope.L10N).toBeDefined();
                });
                it("denies access to user who can not authorize or view driver distance", function () {
                    authorizationServiceMock.GrantAllPermissions(false);
                    createTestController();
                    expect(controllerScope.Vm.ShowAuthorization).toBeFalsy();
                    expect(controllerScope.Vm.ShowSelectUserPrompt).toBeFalsy();
                });
                it("grants access to the user who can authorize and view driver distance", function () {
                    authorizationServiceMock.GrantAllPermissions(true);
                    createTestController();
                    expect(controllerScope.Vm.ShowAuthorization).toBeTruthy();
                    expect(controllerScope.Vm.ShowSelectUserPrompt).toBeTruthy();
                });
                it("dismisses the modal when cancelled", function () {
                    var dismissSpy = spyOn(modalInstanceMock.Object, "dismiss");
                    createTestController();
                    controllerScope.Cancel();
                    expect(dismissSpy).toHaveBeenCalled();
                });
            });
        })(Tests = DriverDistance.Tests || (DriverDistance.Tests = {}));
    })(DriverDistance = Workforce.DriverDistance || (Workforce.DriverDistance = {}));
})(Workforce || (Workforce = {}));
