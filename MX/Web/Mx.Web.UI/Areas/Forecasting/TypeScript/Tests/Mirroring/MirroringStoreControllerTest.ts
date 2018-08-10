/// <reference path="../../../../Core/Tests/TestFramework.ts" />
/// <reference path="../../../../Core/Tests/Mocks/TranslationServiceMock.ts" />
/// <reference path="../../../../Core/Tests/Mocks/PopupMessageServiceMock.ts" />
/// <reference path="../../../../Core/Tests/Mocks/ModalServiceMock.ts" />
/// <reference path="../../Services/DataService.ts" />
/// <reference path="../../Services/ForcastingObjectService.ts" />
/// <reference path="MirroringServiceMock.ts"/>

/// <reference path="../../Interfaces/IMirrorings.d.ts" />
/// <reference path="../../Controllers/MirroringStoreController.ts" />
/// <reference path="../../Services/MirroringService.ts" />

/// <reference path="../../../../Core/Typescript/Directives/mx-grid-header-directive.ts" />
/// <reference path="../../../../Core/Typescript/Models/IConfirmation.ts" />
/// <reference path="../../Interfaces/IMirroringChangeEndDateResult.d.ts" />
/// <reference path="../../../../Core/Typescript/Interfaces/IDateRangeOptions.d.ts" />

module Forecasting.Tests {
    "use strict";

    describe("@ts mirroring store Controller", (): void => {
        var q: ng.IQService,
            scope: IMirroringStoreControllerScope,
            translationServiceMock: Core.Tests.TranslationServiceMock,
            popupMessageServiceMock: Core.Tests.PopupMessageServiceMock,
            modalServiceMock: Core.Tests.ModalServiceMock,
            mirrorServiceMock: Forecasting.Tests.MirroringServiceMock,
            authenticationServiceMock: Core.Tests.AuthServiceMock,
            testTranslationsForecasting: Forecasting.Api.Models.ITranslations = <Forecasting.Api.Models.ITranslations>{
                TargetSalesItem: "TargetSalesItem",
                Status: "Status",
                MirrorDates: "MirrorDates",
                Zone: "Zone"
            },
            testTranslations: Core.Api.Models.ITranslations = <Core.Api.Models.ITranslations>{
                Forecasting: testTranslationsForecasting
            };

        var createTestController = (): Forecasting.MirroringStoreController => {
            return new Forecasting.MirroringStoreController(
                scope,
                null,
                authenticationServiceMock.Object,
                translationServiceMock.Object,
                popupMessageServiceMock,
                modalServiceMock.Object,
                mirrorServiceMock.Object
            );
        };

        beforeEach((): void => {
            inject(($rootScope: IMirroringStoreControllerScope, $q: ng.IQService): void => {
                q = $q;
                scope = $rootScope;
                authenticationServiceMock = new Core.Tests.AuthServiceMock();
                translationServiceMock = new Core.Tests.TranslationServiceMock(q);
                modalServiceMock = new Core.Tests.ModalServiceMock(q, null);
                mirrorServiceMock = new MirroringServiceMock(q);
            });

            popupMessageServiceMock = new Core.Tests.PopupMessageServiceMock();
        });

        it("defines all scope methods and models upon initialization", (): void => {
            createTestController();

            expect(scope.Vm).toBeDefined();
            expect(scope.Vm.L10N).toBeDefined();
            expect(scope.Vm.Dates).toBeUndefined();
            expect(scope.Vm.FilterStatus).toBe(1);
            expect(scope.Vm.StoreGroupIntervals).toBeUndefined();
            expect(scope.Vm.SelectedStoreGroupInterval).toBeUndefined();

            expect(scope.NavigateTo).toBeDefined();
            expect(scope.NavigateToParam).toBeDefined();
            expect(scope.Cancel).toBeDefined();
            expect(scope.OpenDateRangeDialog).toBeDefined();
            expect(scope.AddMirror).toBeDefined();
            expect(scope.ViewMirrorDetails).toBeDefined();
            expect(scope.Save).toBeDefined();
        });

        it("loads translations correctly and sets correct title", (): void => {
            var testTranslations = <Core.Api.Models.ITranslations>{
                Forecasting: {
                    TitleMirroring: "TitleMirroring",
                    SalesItems: "SalesItems"
                }
            };
            translationServiceMock.InjectTranslations(testTranslations);

            spyOn(translationServiceMock.Object, "GetTranslations").and.callThrough();
            spyOn(popupMessageServiceMock, "SetPageTitle").and.callThrough();

            createTestController();

            scope.$digest();
            scope.$digest();

            expect(scope.Vm.L10N).toBe(testTranslations.Forecasting);

            expect(popupMessageServiceMock.SetPageTitle).toHaveBeenCalled();
            scope.$digest();
            expect(popupMessageServiceMock.GetPageTitle()).toBe(""); // todo need $state
        });
  });
} 