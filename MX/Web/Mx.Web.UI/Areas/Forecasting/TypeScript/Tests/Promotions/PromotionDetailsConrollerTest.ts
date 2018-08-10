/// <reference path="../../../../Core/Tests/TestFramework.ts" />
/// <reference path="../../../../Core/Tests/Mocks/ConfirmationServiceMock.ts" />
/// <reference path="../../../../Core/Tests/Mocks/TranslationServiceMock.ts" />
/// <reference path="../../../../Core/Tests/Mocks/PopupMessageServiceMock.ts" />
/// <reference path="../../../../Core/Tests/Mocks/ModalServiceMock.ts" />
/// <reference path="../../../../Core/Tests/Mocks/StateServiceMock.ts" />

/// <reference path="../../../../Inventory/TypeScript/Models/IAddItem.d.ts" />
/// <reference path="../../../../Inventory/TypeScript/Interfaces/IAddItemService.d.ts" />
/// <reference path="../../../../Inventory/TypeScript/Models/IAddItemModel.d.ts" />
/// <reference path="../../../../Inventory/Count/TypeScript/Interfaces/IAddItemsTravelPathService.d.ts" />
/// <reference path="../../../../Inventory/Order/TypeScript/Interfaces/IAddItemsOrderVendorService.d.ts" />
/// <reference path="../../../../Inventory/TypeScript/Controllers/AddItemsController.ts" />
/// <reference path="../../../../Core/Typescript/Interfaces/IDateRangeOptions.d.ts" />
/// <reference path="../../../../../Scripts/typings/ngJsTree.d.ts" />

/// <reference path="../../Services/PromotionService.ts" />
/// <reference path="../../Interfaces/IPromotionRouteParams.ts" />
/// <reference path="../../Interfaces/IPromotionDetailsControllerScope.d.ts" />
/// <reference path="../../Controllers/PromotionDetailsController.ts" />

module Forecasting.Tests {
    "use strict";

    describe("@ts PromotionDetailsController", (): void => {
        var promiseHelper: PromiseHelper,
            scope: IPromotionDetailsControllerScope,
            routeParams: IPromotionRouteParams,
            modalServiceMock: Core.Tests.ModalServiceMock,
            stateServiceMock: Core.Tests.StateServiceMock,
            promotionServiceMock: Services.IPromotionService,
            translationServiceMock: Core.Tests.TranslationServiceMock,
            popupMessageServiceMock: Core.Tests.PopupMessageServiceMock,
            confirmationServiceMock: Core.Tests.ConfirmationServiceMock,
            constantsMock: ConstantsMock,
            today: Moment,
            zones: Api.Models.IZone[],
            promotion: Api.Models.IPromotion,
            promotionResult: Api.Models.IPromotionResult;

        var createController = (): PromotionDetailsController => {
            return new PromotionDetailsController(
                scope,
                routeParams,
                modalServiceMock.Object,
                stateServiceMock,
                promotionServiceMock,
                translationServiceMock.Object,
                popupMessageServiceMock,
                confirmationServiceMock,
                constantsMock.Object);
        }

        beforeEach(() => {
            inject(($q: ng.IQService, $rootScope: ng.IRootScopeService) => {
                promiseHelper = new PromiseHelper($q);
                scope = <IPromotionDetailsControllerScope>$rootScope.$new(false);
                modalServiceMock = new Core.Tests.ModalServiceMock($q, {});
                stateServiceMock = new Core.Tests.StateServiceMock($q);
                translationServiceMock = new Core.Tests.TranslationServiceMock($q);
                confirmationServiceMock = new Core.Tests.ConfirmationServiceMock($q);
            });

            popupMessageServiceMock = new Core.Tests.PopupMessageServiceMock();
            constantsMock = new ConstantsMock();
            today = moment("2016-05-20"),
            zones = [{ Id: 13, Name: "Zone1", EntityCount: 0 }, { Id: 14, Name: "Zone2", EntityCount: 0 }];
            promotion = {
                Id: 22,
                Name: "Promo name",
                StartDate: moment(today).add({ days: -1 }).format(constantsMock.Object.InternalDateFormat),
                EndDate: moment(today).add({ days: 1 }).format(constantsMock.Object.InternalDateFormat),
                UseZones: true,
                LimitedTimeOffer: true,
                OverwriteManager: false,
                Status: Api.Enums.PromotionStatus.Active,
                Timeline: Api.Enums.PromotionTimeline.InProgress,
                Items: [{Id: 123, ItemCode: "Code", Description: "Desc", Impacted: false, AdjustmentPercent: 1 }],
                Entities: [],
                Zones: [13]
            };
            promotionResult = {
                Id: promotion.Id,
                Overlaps: null
            };
            routeParams = <IPromotionRouteParams> { Id: promotion.Id.toString() };

            promotionServiceMock = <Services.IPromotionService> {
                GetFormData: (id: number): ng.IHttpPromise<Api.Models.IPromotionFormData> => {
                    return promiseHelper.CreateHttpPromise({
                        Promotion: id === 0 ? null : promotion,
                        Today: today.format(constantsMock.Object.InternalDateFormat),
                        Zones: zones
                    });
                },
                Delete: (id: number, overrideManager: boolean): ng.IHttpPromise<{}> => {
                    return promiseHelper.CreateHttpPromise({});
                },
                Upsert: (promo: Api.Models.IPromotion, checkOverlap: boolean, overrideManager: boolean): ng.IHttpPromise<Api.Models.IPromotionResult> => {
                    return promiseHelper.CreateHttpPromise(promotionResult);
                }
            };
        });

        it("initializes new promotion", () => {
            routeParams = <IPromotionRouteParams> { Id: "" };
            createController();
            scope.$digest();

            expect(scope.Vm).toBeDefined();
            expect(scope.Vm.Promotion).toBeDefined();
            expect(scope.Vm.Promotion.Id).toEqual(0);
            expect(moment(scope.Vm.Promotion.StartDate).isSame(moment(today).add({ days: 1 }))).toEqual(true);
            expect(moment(scope.Vm.Promotion.EndDate).isSame(moment(today).add({ days: 2 }))).toEqual(true);
            expect(scope.Vm.Promotion.UseZones).toEqual(true);
            expect(scope.Vm.Promotion.Status).toEqual(Api.Enums.PromotionStatus.Active);
            expect(scope.Vm.Promotion.Timeline).toEqual(Api.Enums.PromotionTimeline.Pending);
        });

        it("loads promotion and form data", () => {
            var ctrl = createController();
            scope.$digest();

            expect(scope.Vm).toBeDefined();
            expect(scope.Vm.Promotion).toEqual(promotion);

            expect(ctrl.Today().isSame(today)).toEqual(true);

            expect(scope.Vm.Zones).toBeDefined();
            expect(scope.Vm.Zones.length).toEqual(2);
            expect(scope.Vm.Zones[0].Id).toEqual(13);
            expect(scope.Vm.Zones[0].Name).toEqual("Zone1");
        });

        it("when deleted goes back and shows a toaster", () => {
            createController();

            spyOn(confirmationServiceMock, "Confirm").and.callThrough();
            spyOn(promotionServiceMock, "Delete").and.callThrough();
            spyOn(stateServiceMock, "go");
            spyOn(popupMessageServiceMock, "ShowSuccess");

            scope.$digest(); // load translations
            scope.Delete();

            expect(confirmationServiceMock.Confirm).toHaveBeenCalled();

            scope.$digest();

            expect(promotionServiceMock.Delete).toHaveBeenCalledWith(promotion.Id);
            expect(stateServiceMock.go).toHaveBeenCalledWith("^");
            expect(popupMessageServiceMock.ShowSuccess).toHaveBeenCalledWith(scope.L10N.PromotionDeleted);
        });

        it("when saved without overlaps goes back and shows a toaster", () => {
            createController();

            scope.Vm.Form = <ng.IFormController> {
                $setPristine: () => { }
            };

            spyOn(confirmationServiceMock, "Confirm").and.callThrough();
            spyOn(promotionServiceMock, "Upsert").and.callThrough();
            spyOn(stateServiceMock, "go");
            spyOn(popupMessageServiceMock, "ShowSuccess");

            scope.$digest(); // load translations
            scope.Save();

            expect(confirmationServiceMock.Confirm).toHaveBeenCalled();

            scope.$digest();

            expect(promotionServiceMock.Upsert).toHaveBeenCalledWith(promotion, true);
            expect(stateServiceMock.go).toHaveBeenCalledWith("^");
            expect(popupMessageServiceMock.ShowSuccess).toHaveBeenCalledWith(scope.L10N.PromotionUpdated);
        });
    });
}