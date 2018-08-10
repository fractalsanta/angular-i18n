var Forecasting;
(function (Forecasting) {
    var Tests;
    (function (Tests) {
        "use strict";
        function CreatePromotion() {
            return {
                Id: 0,
                Name: "Promo",
                StartDate: null,
                EndDate: null,
                UseZones: true,
                LimitedTimeOffer: false,
                Status: Forecasting.Api.Enums.PromotionStatus.Active,
                Timeline: Forecasting.Api.Enums.PromotionTimeline.Pending,
                Items: [],
                Entities: [],
                Zones: []
            };
        }
        describe("@ts PromotionService", function () {
            var promiseHelper;
            var rootScope;
            var apiItemServiceMock;
            var apiPromotionServiceMock;
            var constantsMock;
            var promotionService;
            var promotionResult;
            beforeEach(function () {
                inject(function ($q, $rootScope) {
                    promiseHelper = new PromiseHelper($q);
                    rootScope = $rootScope;
                    apiItemServiceMock = new Tests.SalesItemServiceMock($q);
                });
                apiPromotionServiceMock = {
                    Delete: function (id, overrideManager) {
                        return promiseHelper.CreateHttpPromise({});
                    },
                    Post: function (promo, checkOverlap, overrideManager) {
                        return promiseHelper.CreateHttpPromise(promotionResult);
                    }
                };
                constantsMock = new ConstantsMock();
                promotionService = new Forecasting.Services.PromotionService(apiItemServiceMock.Object, apiPromotionServiceMock, constantsMock.Object);
            });
            it("initialises event members when constructed", function () {
                expect(promotionService.EventPromotionDeleted).toBeDefined();
                expect(promotionService.EventPromotionUpserted).toBeDefined();
            });
            it("fires EventPromotionDeleted event on successful delete", function () {
                spyOn(promotionService.EventPromotionDeleted, "Fire");
                var id = 13;
                promotionService.Delete(id);
                rootScope.$digest();
                expect(promotionService.EventPromotionDeleted.Fire).toHaveBeenCalledWith(id);
            });
            it("fires EventPromotionUpserted event on successful Upsert when no overlaps returned", function () {
                spyOn(promotionService.EventPromotionUpserted, "Fire");
                var promo = CreatePromotion();
                promotionResult = { Id: promo.Id, Overlaps: null };
                promotionService.Upsert(promo, true);
                rootScope.$digest();
                expect(promotionService.EventPromotionUpserted.Fire).toHaveBeenCalled();
            });
            it("doesn't fire EventPromotionUpserted event on successful Upsert when overlaps returned", function () {
                spyOn(promotionService.EventPromotionUpserted, "Fire");
                var promo = CreatePromotion();
                promotionResult = {
                    Id: promo.Id,
                    Overlaps: [{
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
    })(Tests = Forecasting.Tests || (Forecasting.Tests = {}));
})(Forecasting || (Forecasting = {}));
