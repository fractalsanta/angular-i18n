/// <reference path="../../../../Core/Tests/TestFramework.ts" />
/// <reference path="../../../../Core/TypeScript/Extensions.ts" />
/// <reference path="../../../../../Scripts/angular-ui/validate.ts" />
/// <reference path="../../Typescript/Interfaces/IForecastFilterDialogControllerScope.d.ts" />
/// <reference path="../../../../Core/Tests/Mocks/ModalServiceInstanceMock.ts" />
/// <reference path="../../../../Core/Tests/Mocks/AuthServiceMock.ts" />
/// <reference path="../../../../Forecasting/Typescript/Tests/TranslatedPosServiceTypeServiceMock.ts"/>
/// <reference path="../../../../Forecasting/Typescript/Tests/ForecastFilterDialogServiceMock.ts"/>
/// <reference path="../../Typescript/Controllers/ForecastFilterDialogController.ts" />

module Forecasting.Tests {
    "use strict";

    describe("ForecastFilterDialogController", (): void => {
        var controllerScope: Administration.Settings.IForecastFilterDialogControllerScope,
            modalServiceInstanceMock: Core.Tests.ModalServiceInstanceMock,
            translationServiceMock: Core.Tests.TranslationServiceMock,
            translatedPosServiceTypeServiceMock: Tests.TranslatedPosServiceTypeServiceMock,
            filters: Api.Models.IForecastFilterRecord[],
            filter: Api.Models.IForecastFilterRecord,
            authorizationServiceMock: Core.Tests.AuthServiceMock,
            forecastFilterDialogServiceMock: Tests.ForecastFilterDialogServiceMock,
            promiseHelper: PromiseHelper, 
            testFilters: Api.Models.IForecastFilterRecord[] = [
                <Api.Models.IForecastFilterRecord>{
                    Id: 1,
                    Name: "test1",
                    IsForecastEditableViaGroup: false,
                    ForecastFilterGroupTypes: [1, 2, 3]
                },
                <Api.Models.IForecastFilterRecord>{
                    Id: 2,
                    Name: "test2",
                    IsForecastEditableViaGroup: false,
                    ForecastFilterGroupTypes: [4, 5, 6]
                }
            ];

        var createTestController = (): Administration.Settings.ForecastFilterDialogController => {
            return new Administration.Settings.ForecastFilterDialogController(
                controllerScope,
                modalServiceInstanceMock.Object,
                translationServiceMock.Object,
                translatedPosServiceTypeServiceMock.Object,
                filters,
                filter,
                false,
                forecastFilterDialogServiceMock.Object);
        };

        beforeEach((): void => {
            angular.mock.module(Core.NG.ForecastingModule.Module().name);

            inject(($rootScope: ng.IRootScopeService, $q: ng.IQService): void => {

                controllerScope = <Administration.Settings.IForecastFilterDialogControllerScope>$rootScope.$new();

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

        it("dismisses the modal when cancelled", (): void => {
            var dismissSpy = spyOn(modalServiceInstanceMock.Object, "dismiss");

            createTestController();

            controllerScope.Cancel();

            expect(dismissSpy).toHaveBeenCalled();
        });

        it("loads translations upon initialization", (): void => {
            createTestController();

            expect(controllerScope.Translations).toBeUndefined();

            controllerScope.$digest();

            expect(controllerScope.Translations).toBeDefined();
        });

        it("returns boolean indicating if id of forecast filter group type was found associated with filter", (): void => {
            createTestController();

            controllerScope.Vm.Filter.ForecastFilterGroupTypes = [23, 45, 16];

            var shouldBeTrue = controllerScope.HasType(23);

            controllerScope.Vm.Filter.ForecastFilterGroupTypes = [36, 45, 16];

            var shouldBeFalse = controllerScope.HasType(23);

            expect(shouldBeTrue).toBeTruthy();
            expect(shouldBeFalse).toBeFalsy();
        });

        it("returns boolean indicating if forecast filter has any group types associated with it", (): void => {
            createTestController();

            controllerScope.Vm.Filter.ForecastFilterGroupTypes = [23, 45, 16];

            var shouldBeTrue = controllerScope.HasTypes();

            controllerScope.Vm.Filter.ForecastFilterGroupTypes = [];

            var shouldBeFalse = controllerScope.HasTypes();

            expect(shouldBeTrue).toBeTruthy();
            expect(shouldBeFalse).toBeFalsy();
        });

        it("removes a group type from the filter's group type array", (): void => {
            createTestController();

            controllerScope.Vm.Filter.ForecastFilterGroupTypes = [23, 45, 16];

            controllerScope.ToggleType(23);

            var shouldBeFalse = controllerScope.HasType(23);

            expect(shouldBeFalse).toBeFalsy();
        });

        it("adds a group type from the filter's group type array", (): void => {
            createTestController();

            controllerScope.Vm.Filter.ForecastFilterGroupTypes = [45, 16];

            controllerScope.ToggleType(23);

            var shouldBeTrue = controllerScope.HasType(23);

            expect(shouldBeTrue).toBeTruthy();
        });

        it("posts in the correct filter", (): void => {
            var methodSpy = spyOn(forecastFilterDialogServiceMock.Object, "PostInsertOrUpdateForecastFilter");
            var passedInFilter: Api.Models.IForecastFilterRecord;

            methodSpy.and.callFake((request: Api.Models.IForecastFilterRecord): ng.IHttpPromise<{}> => {
                passedInFilter = request;

                expect(passedInFilter).toBe(controllerScope.Vm.Filter);

                return promiseHelper.CreateHttpPromise({});
            });

            createTestController();

            controllerScope.SaveFilter();

            expect(passedInFilter).toBeDefined();
            expect(methodSpy).toHaveBeenCalled();
        });

        it("maps filter service types used", (): void => {
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
}