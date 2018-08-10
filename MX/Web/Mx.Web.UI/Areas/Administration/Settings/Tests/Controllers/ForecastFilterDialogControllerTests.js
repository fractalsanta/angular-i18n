var Forecasting;
(function (Forecasting) {
    var Tests;
    (function (Tests) {
        "use strict";
        describe("ForecastFilterDialogController", function () {
            var controllerScope, modalServiceInstanceMock, translationServiceMock, translatedPosServiceTypeServiceMock, filters, filter, authorizationServiceMock, forecastFilterDialogServiceMock, promiseHelper, testFilters = [
                {
                    Id: 1,
                    Name: "test1",
                    IsForecastEditableViaGroup: false,
                    ForecastFilterGroupTypes: [1, 2, 3]
                },
                {
                    Id: 2,
                    Name: "test2",
                    IsForecastEditableViaGroup: false,
                    ForecastFilterGroupTypes: [4, 5, 6]
                }
            ];
            var createTestController = function () {
                return new Administration.Settings.ForecastFilterDialogController(controllerScope, modalServiceInstanceMock.Object, translationServiceMock.Object, translatedPosServiceTypeServiceMock.Object, filters, filter, false, forecastFilterDialogServiceMock.Object);
            };
            beforeEach(function () {
                angular.mock.module(Core.NG.ForecastingModule.Module().name);
                inject(function ($rootScope, $q) {
                    controllerScope = $rootScope.$new();
                    translationServiceMock = new Core.Tests.TranslationServiceMock($q);
                    forecastFilterDialogServiceMock = new Tests.ForecastFilterDialogServiceMock($q);
                    translatedPosServiceTypeServiceMock = new Tests.TranslatedPosServiceTypeServiceMock($q);
                    modalServiceInstanceMock = new Core.Tests.ModalServiceInstanceMock($q);
                    promiseHelper = new PromiseHelper($q);
                });
                filter = {
                    Id: 1,
                    Name: "Test name",
                    IsForecastEditableViaGroup: false,
                    ForecastFilterGroupTypes: []
                };
                authorizationServiceMock = new Core.Tests.AuthServiceMock();
            });
            it("dismisses the modal when cancelled", function () {
                var dismissSpy = spyOn(modalServiceInstanceMock.Object, "dismiss");
                createTestController();
                controllerScope.Cancel();
                expect(dismissSpy).toHaveBeenCalled();
            });
            it("loads translations upon initialization", function () {
                createTestController();
                expect(controllerScope.Translations).toBeUndefined();
                controllerScope.$digest();
                expect(controllerScope.Translations).toBeDefined();
            });
            it("returns boolean indicating if id of forecast filter group type was found associated with filter", function () {
                createTestController();
                controllerScope.Vm.Filter.ForecastFilterGroupTypes = [23, 45, 16];
                var shouldBeTrue = controllerScope.HasType(23);
                controllerScope.Vm.Filter.ForecastFilterGroupTypes = [36, 45, 16];
                var shouldBeFalse = controllerScope.HasType(23);
                expect(shouldBeTrue).toBeTruthy();
                expect(shouldBeFalse).toBeFalsy();
            });
            it("returns boolean indicating if forecast filter has any group types associated with it", function () {
                createTestController();
                controllerScope.Vm.Filter.ForecastFilterGroupTypes = [23, 45, 16];
                var shouldBeTrue = controllerScope.HasTypes();
                controllerScope.Vm.Filter.ForecastFilterGroupTypes = [];
                var shouldBeFalse = controllerScope.HasTypes();
                expect(shouldBeTrue).toBeTruthy();
                expect(shouldBeFalse).toBeFalsy();
            });
            it("removes a group type from the filter's group type array", function () {
                createTestController();
                controllerScope.Vm.Filter.ForecastFilterGroupTypes = [23, 45, 16];
                controllerScope.ToggleType(23);
                var shouldBeFalse = controllerScope.HasType(23);
                expect(shouldBeFalse).toBeFalsy();
            });
            it("adds a group type from the filter's group type array", function () {
                createTestController();
                controllerScope.Vm.Filter.ForecastFilterGroupTypes = [45, 16];
                controllerScope.ToggleType(23);
                var shouldBeTrue = controllerScope.HasType(23);
                expect(shouldBeTrue).toBeTruthy();
            });
            it("posts in the correct filter", function () {
                var methodSpy = spyOn(forecastFilterDialogServiceMock.Object, "PostInsertOrUpdateForecastFilter");
                var passedInFilter;
                methodSpy.and.callFake(function (request) {
                    passedInFilter = request;
                    expect(passedInFilter).toBe(controllerScope.Vm.Filter);
                    return promiseHelper.CreateHttpPromise({});
                });
                createTestController();
                controllerScope.SaveFilter();
                expect(passedInFilter).toBeDefined();
                expect(methodSpy).toHaveBeenCalled();
            });
            it("maps filter service types used", function () {
                createTestController();
                var map = Administration.Settings.ForecastFilterDialogController.prototype.GetUsedMap(testFilters, null);
                expect(map[0]).toBeFalsy();
                expect(map[1]).toBeTruthy();
                expect(map[2]).toBeTruthy();
                expect(map[3]).toBeTruthy();
                expect(map[4]).toBeTruthy();
                expect(map[5]).toBeTruthy();
                expect(map[6]).toBeTruthy();
                expect(map[7]).toBeFalsy();
                expect(map[8]).toBeFalsy();
                expect(map[9]).toBeFalsy();
                expect(map[10]).toBeFalsy();
                map = Administration.Settings.ForecastFilterDialogController.prototype.GetUsedMap(testFilters, testFilters[1]);
                expect(map[0]).toBeFalsy();
                expect(map[1]).toBeTruthy();
                expect(map[2]).toBeTruthy();
                expect(map[3]).toBeTruthy();
                expect(map[4]).toBeFalsy();
                expect(map[5]).toBeFalsy();
                expect(map[6]).toBeFalsy();
                expect(map[7]).toBeFalsy();
                expect(map[8]).toBeFalsy();
                expect(map[9]).toBeFalsy();
                expect(map[10]).toBeFalsy();
            });
        });
    })(Tests = Forecasting.Tests || (Forecasting.Tests = {}));
})(Forecasting || (Forecasting = {}));
