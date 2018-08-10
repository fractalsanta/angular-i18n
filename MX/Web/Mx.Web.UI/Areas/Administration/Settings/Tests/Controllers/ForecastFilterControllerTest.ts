/// <reference path="../../../../Core/Tests/TestFramework.ts" />
/// <reference path="../../../../Core/TypeScript/Extensions.ts" />
/// <reference path="../../../../../Scripts/angular-ui/validate.ts" />
/// <reference path="../../Typescript/Interfaces/IForecastFilterControllerScope.d.ts" />
/// <reference path="../../../../Core/Tests/Mocks/AuthServiceMock.ts" />
/// <reference path="../../../../Forecasting/Typescript/Tests/ForecastFilterServiceMock.ts"/>
/// <reference path="../../../../Forecasting/TypeScript/Tests/ForecastFilterAssignServiceMock.ts"/>
/// <reference path="../../Typescript/Controllers/ForecastFilterController.ts" />

module Core.Tests {
    "use strict";

    import FApi = Forecasting.Api;

    describe("ForecastFilterController", (): void => {
        var controllerScope: Administration.Settings.IForecastFilterControllerScope,
            translationServiceMock: Core.Tests.TranslationServiceMock,
            popupMessageServiceMock: Core.IPopupMessageService,
            authorizationServiceMock: Core.Tests.AuthServiceMock,
            locationService: ng.ILocationService,
            forecastFilterServiceMock: Forecasting.Tests.ForecastFilterServiceMock,
            forecastFilterAssignServiceMock: Forecasting.Tests.ForecastFilterAssignServiceMock,
            promiseHelper: PromiseHelper,
            filters: FApi.Models.IForecastFilterRecord[] = [
                <FApi.Models.IForecastFilterRecord>{ Id: 1, Name: "Test 1" },
                <FApi.Models.IForecastFilterRecord>{ Id: 2, Name: "Test 2" },
                <FApi.Models.IForecastFilterRecord>{ Id: 3, Name: "Test 3" },
                <FApi.Models.IForecastFilterRecord>{ Id: 4, Name: "Test 4" },
                <FApi.Models.IForecastFilterRecord>{ Id: 5, Name: "Test 5" },
                <FApi.Models.IForecastFilterRecord>{ Id: 6, Name: "Test 6" },
                <FApi.Models.IForecastFilterRecord>{ Id: 7, Name: "Test 7" },
                <FApi.Models.IForecastFilterRecord>{ Id: 8, Name: "Test 8" },
                <FApi.Models.IForecastFilterRecord>{ Id: 9, Name: "Test 9" }
            ],
            functions: FApi.Models.IForecastFilterAssignRecord[] = [
                <FApi.Models.IForecastFilterAssignRecord>{ Id: 1, Name: "FTest1", FunctionId: 1, ServiceGroupId: 3, IsActive: true },
                <FApi.Models.IForecastFilterAssignRecord>{ Id: 2, Name: "FTest2", FunctionId: 2, ServiceGroupId: 5, IsActive: true },
                <FApi.Models.IForecastFilterAssignRecord>{ Id: 3, Name: "FTest3", FunctionId: 3, ServiceGroupId: 8, IsActive: true }
            ],
            functionsTranslations: any = {
                FTest1: "Function Test 1",
                FTest2: "Function Test 2",
                FTest3: "Function Test 3"
            };

        var createTestController = (): Administration.Settings.ForecastFilterController => {

            var confirmationService = new Core.Tests.ConfirmationServiceMock(null);
            return new Administration.Settings.ForecastFilterController(
                controllerScope,
                translationServiceMock.Object,
                popupMessageServiceMock,
                null,
                confirmationService,
                authorizationServiceMock.Object,
                locationService,
                forecastFilterServiceMock.Object,
                forecastFilterAssignServiceMock.Object);
        };

        beforeEach((): void => {
            angular.mock.module(Core.NG.ForecastingModule.Module().name);

            inject(($rootScope: ng.IRootScopeService, $q: ng.IQService, $location: ng.ILocationService): void => {
                locationService = $location;

                controllerScope = <Administration.Settings.IForecastFilterControllerScope>$rootScope.$new();

                translationServiceMock = new Core.Tests.TranslationServiceMock($q);
                forecastFilterServiceMock = new Forecasting.Tests.ForecastFilterServiceMock($q);                
                forecastFilterAssignServiceMock = new Forecasting.Tests.ForecastFilterAssignServiceMock($q);                

                promiseHelper = new PromiseHelper($q);
            });

            popupMessageServiceMock = new Core.Tests.PopupMessageServiceMock();
            authorizationServiceMock = new Core.Tests.AuthServiceMock();
        });

        it("requires proper authorization to access", (): void => {
            authorizationServiceMock.GrantAllPermissions(false);

            createTestController();

            expect(locationService.path()).toBe("/Core/Forbidden");

            expect(controllerScope.Vm).toBeUndefined();
            expect(controllerScope.AddForecastFilter).toBeUndefined();
            expect(controllerScope.ViewForecastFilter).toBeUndefined();
            expect(controllerScope.CanEditForecastViaFilter).toBeUndefined();
            expect(controllerScope.UsedByForecastFilter).toBeUndefined();
            expect(controllerScope.InUseForecastFilter).toBeUndefined();
            expect(controllerScope.DeleteForecastFilter).toBeUndefined();
            expect(controllerScope.DoRecordsExist).toBeUndefined();
        });

        it("defines all scope methods and non-promise models upon initialization", (): void => {
            createTestController();

            expect(controllerScope.Vm).toBeDefined();
            expect(controllerScope.AddForecastFilter).toBeDefined();
            expect(controllerScope.ViewForecastFilter).toBeDefined();
            expect(controllerScope.CanEditForecastViaFilter).toBeDefined();
            expect(controllerScope.UsedByForecastFilter).toBeDefined();
            expect(controllerScope.InUseForecastFilter).toBeDefined();
            expect(controllerScope.DeleteForecastFilter).toBeDefined();
            expect(controllerScope.DoRecordsExist).toBeDefined();
        });

        it("loads translations upon initialization", (): void => {
            createTestController();

            expect(controllerScope.Translations).toBeUndefined();

            controllerScope.$digest();

            expect(controllerScope.Translations).toBeDefined();
        });

        it("sets the page title upon initialization", (): void => {
            var pageTitle = popupMessageServiceMock.GetPageTitle(),
                testTranslations = <Core.Api.Models.ITranslations>{
                    Settings: { ForecastFilters: "Test Title" }
                };

            translationServiceMock.InjectTranslations(testTranslations);

            createTestController();

            expect(pageTitle).toBe("");

            controllerScope.$digest();

            pageTitle = popupMessageServiceMock.GetPageTitle();

            expect(pageTitle).toMatch(testTranslations.Settings.ForecastFilters);
        });

        it("loads forecast filter data upon initialization", (): void => {
            var loadSpy = spyOn(Administration.Settings.ForecastFilterController.prototype, "LoadData");

            loadSpy.and.callFake((): void => {});

            createTestController();

            expect(loadSpy).toHaveBeenCalled();
        });

        it("can determine if there are records to display", (): void => {
            createTestController();

            var shouldNotExist = controllerScope.DoRecordsExist();

            controllerScope.Vm.ForecastFilters = [<FApi.Models.IForecastFilterRecord>{}];

            var shouldExist = controllerScope.DoRecordsExist();

            expect(shouldNotExist).toBeFalsy();
            expect(shouldExist).toBeTruthy();
        });

        it("can determine if forecast can be edited", (): void => {
            createTestController();

            var forecastFilter = <FApi.Models.IForecastFilterRecord>{ IsForecastEditableViaGroup: false };

            var shouldNotBeAbleToEdit = controllerScope.CanEditForecastViaFilter(forecastFilter);

            forecastFilter = <FApi.Models.IForecastFilterRecord>{ IsForecastEditableViaGroup: true };

            var shouldBeAbleToEdit = controllerScope.CanEditForecastViaFilter(forecastFilter);

            expect(shouldNotBeAbleToEdit).toBeFalsy();
            expect(shouldBeAbleToEdit).toBeTruthy();
        });      

        it("functions and function's map", (): void => {
            createTestController();

            controllerScope.$digest();

            var map = Administration.Settings.ForecastFilterController.prototype.GetMap(functions, functionsTranslations);

            expect(map["1"]).toBeUndefined();
            expect(map["2"]).toBeUndefined();
            expect(map["3"]).toBe("Function Test 1");
            expect(map["4"]).toBeUndefined();
            expect(map["5"]).toBe("Function Test 2");
            expect(map["6"]).toBeUndefined();
            expect(map["7"]).toBeUndefined();
            expect(map["8"]).toBe("Function Test 3");
            expect(map["9"]).toBeUndefined();

            controllerScope.Vm = {
                ForecastFilters: filters,
                Functions: functions,
                FunctionsMap: map
            };

            expect(controllerScope.UsedByForecastFilter(filters[0])).toBe("");
            expect(controllerScope.UsedByForecastFilter(filters[1])).toBe("");
            expect(controllerScope.UsedByForecastFilter(filters[2])).toBe("Function Test 1");
            expect(controllerScope.UsedByForecastFilter(filters[3])).toBe("");
            expect(controllerScope.UsedByForecastFilter(filters[4])).toBe("Function Test 2");
            expect(controllerScope.UsedByForecastFilter(filters[5])).toBe("");
            expect(controllerScope.UsedByForecastFilter(filters[6])).toBe("");
            expect(controllerScope.UsedByForecastFilter(filters[7])).toBe("Function Test 3");
            expect(controllerScope.UsedByForecastFilter(filters[8])).toBe("");

            expect(controllerScope.InUseForecastFilter(filters[0])).toBe(false);
            expect(controllerScope.InUseForecastFilter(filters[1])).toBe(false);
            expect(controllerScope.InUseForecastFilter(filters[2])).toBe(true);
            expect(controllerScope.InUseForecastFilter(filters[3])).toBe(false);
            expect(controllerScope.InUseForecastFilter(filters[4])).toBe(true);
            expect(controllerScope.InUseForecastFilter(filters[5])).toBe(false);
            expect(controllerScope.InUseForecastFilter(filters[6])).toBe(false);
            expect(controllerScope.InUseForecastFilter(filters[7])).toBe(true);
            expect(controllerScope.InUseForecastFilter(filters[8])).toBe(false);
        });
    });
} 