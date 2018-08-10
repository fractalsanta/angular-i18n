/// <reference path="../../../../Core/Tests/TestFramework.ts" />
/// <reference path="../Forecast/SalesItemServiceMock.ts" />
/// <reference path="../../Services/PromotionService.ts" />
/// <reference path="../../../../Inventory/TypeScript/Interfaces/IAddItemService.d.ts" />
/// <reference path="../../../../Inventory/TypeScript/Models/IAddItem.d.ts" />

module Forecasting.Tests {
    "use strict";

    function CreatePromotion(): Api.Models.IPromotion {
        return <Api.Models.IPromotion> {
            Id: 0,
            Name: "Promo",
            StartDate: null,
            EndDate: null,
            UseZones: true,
            LimitedTimeOffer: false,
            Status: Api.Enums.PromotionStatus.Active,
            Timeline: Api.Enums.PromotionTimeline.Pending,
            Items: [],
            Entities: [],
            Zones: []
        };
    }

    describe("@ts PromotionService", (): void => {
        var promiseHelper: PromiseHelper;
        var rootScope: ng.IRootScopeService;

        var apiItemServiceMock: Tests.SalesItemServiceMock;
        var apiPromotionServiceMock: Api.IPromotionService;
        var constantsMock: ConstantsMock;

        var promotionService: Services.PromotionService;
        var promotionResult: Api.Models.IPromotionResult;

        beforeEach(() => {
            inject(($q: ng.IQService, $rootScope: ng.IRootScopeService): void => {
                promiseHelper = new PromiseHelper($q);
                rootScope = $rootScope;
                apiItemServiceMock = new Tests.SalesItemServiceMock($q);
            });

            apiPromotionServiceMock = <Api.IPromotionService> {
                Delete: (id: number, overrideManager: boolean): ng.IHttpPromise<{}> => {
                    return promiseHelper.CreateHttpPromise({});
                },
                Post: (promo: Api.Models.IPromotion, checkOverlap: boolean, overrideManager: boolean): ng.IHttpPromise<Api.Models.IPromotionResult> => {
                    return promiseHelper.CreateHttpPromise(promotionResult);
                }
            };
            constantsMock = new ConstantsMock();

            promotionService = new Services.PromotionService(apiItemServiceMock.Object,
                apiPromotionServiceMock,
                constantsMock.Object);
        });

        it("initialises event members when constructed", (): void => {
            expect(promotionService.EventPromotionDeleted).toBeDefined();
            expect(promotionService.EventPromotionUpserted).toBeDefined();
        });

        it("fires EventPromotionDeleted event on successful delete", (): void => {
            spyOn(promotionService.EventPromotionDeleted, "Fire");

            var id = 13;
            promotionService.Delete(id);
            rootScope.$digest();

            expect(promotionService.EventPromotionDeleted.Fire).toHaveBeenCalledWith(id);
        });

        it("fires EventPromotionUpserted event on successful Upsert when no overlaps returned", (): void => {
            spyOn(promotionService.EventPromotionUpserted, "Fire");

            var promo = CreatePromotion();
            promotionResult = <Api.Models.IPromotionResult> { Id: promo.Id, Overlaps: null };

            promotionService.Upsert(promo, true);
            rootScope.$digest();

            expect(promotionService.EventPromotionUpserted.Fire).toHaveBeenCalled();
        });

        it("doesn't fire EventPromotionUpserted event on successful Upsert when overlaps returned", (): void => {
            spyOn(promotionService.EventPromotionUpserted, "Fire");

            var promo = CreatePromotion();
            promotionResult = <Api.Models.IPromotionResult> {
                Id: promo.Id,
                Overlaps: [<Api.Models.IPromotionOverlap> {
                    Description: "Desc",
                    ItemCode: "Code",
                    Promotions: ["Promo1"]
                }]
            };

            promotionService.Upsert(promo, true);
            rootScope.$digest();

            expect(promotionService.EventPromotionUpserted.Fire).not.toHaveBeenCalled();
        });
    });
 }