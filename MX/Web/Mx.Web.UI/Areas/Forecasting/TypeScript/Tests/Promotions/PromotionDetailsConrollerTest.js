var Forecasting;
(function (Forecasting) {
    var Tests;
    (function (Tests) {
        "use strict";
        describe("@ts PromotionDetailsController", function () {
            var promiseHelper, scope, routeParams, modalServiceMock, stateServiceMock, promotionServiceMock, translationServiceMock, popupMessageServiceMock, confirmationServiceMock, constantsMock, today, zones, promotion, promotionResult;
            var createController = function () {
                return new Forecasting.PromotionDetailsController(scope, routeParams, modalServiceMock.Object, stateServiceMock, promotionServiceMock, translationServiceMock.Object, popupMessageServiceMock, confirmationServiceMock, constantsMock.Object);
            };
            beforeEach(function () {
                inject(function ($q, $rootScope) {
                    promiseHelper = new PromiseHelper($q);
                    scope = $rootScope.$new(false);
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
                    Status: Forecasting.Api.Enums.PromotionStatus.Active,
                    Timeline: Forecasting.Api.Enums.PromotionTimeline.InProgress,
                    Items: [{ Id: 123, ItemCode: "Code", Description: "Desc", Impacted: false, AdjustmentPercent: 1 }],
                    Entities: [],
                    Zones: [13]
                };
                promotionResult = {
                    Id: promotion.Id,
                    Overlaps: null
                };
                routeParams = { Id: promotion.Id.toString() };
                promotionServiceMock = {
                    GetFormData: function (id) {
                        return promiseHelper.CreateHttpPromise({
                            Promotion: id === 0 ? null : promotion,
                            Today: today.format(constantsMock.Object.InternalDateFormat),
                            Zones: zones
                        });
                    },
                    Delete: function (id, overrideManager) {
                        return promiseHelper.CreateHttpPromise({});
                    },
                    Upsert: function (promo, checkOverlap, overrideManager) {
                        return promiseHelper.CreateHttpPromise(promotionResult);
                    }
                };
            });
            it("initializes new promotion", function () {
                routeParams = { Id: "" };
                createController();
                scope.$digest();
                expect(scope.Vm).toBeDefined();
                expect(scope.Vm.Promotion).toBeDefined();
                expect(scope.Vm.Promotion.Id).toEqual(0);
                expect(moment(scope.Vm.Promotion.StartDate).isSame(moment(today).add({ days: 1 }))).toEqual(true);
                expect(moment(scope.Vm.Promotion.EndDate).isSame(moment(today).add({ days: 2 }))).toEqual(true);
                expect(scope.Vm.Promotion.UseZones).toEqual(true);
                expect(scope.Vm.Promotion.Status).toEqual(Forecasting.Api.Enums.PromotionStatus.Active);
                expect(scope.Vm.Promotion.Timeline).toEqual(Forecasting.Api.Enums.PromotionTimeline.Pending);
            });
            it("loads promotion and form data", function () {
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
            it("when deleted goes back and shows a toaster", function () {
                createController();
                spyOn(confirmationServiceMock, "Confirm").and.callThrough();
                spyOn(promotionServiceMock, "Delete").and.callThrough();
                spyOn(stateServiceMock, "go");
                spyOn(popupMessageServiceMock, "ShowSuccess");
                scope.$digest();
                scope.Delete();
                expect(confirmationServiceMock.Confirm).toHaveBeenCalled();
                scope.$digest();
                expect(promotionServiceMock.Delete).toHaveBeenCalledWith(promotion.Id);
                expect(stateServiceMock.go).toHaveBeenCalledWith("^");
                expect(popupMessageServiceMock.ShowSuccess).toHaveBeenCalledWith(scope.L10N.PromotionDeleted);
            });
            it("when saved without overlaps goes back and shows a toaster", function () {
                createController();
                scope.Vm.Form = {
                    $setPristine: function () { }
                };
                spyOn(confirmationServiceMock, "Confirm").and.callThrough();
                spyOn(promotionServiceMock, "Upsert").and.callThrough();
                spyOn(stateServiceMock, "go");
                spyOn(popupMessageServiceMock, "ShowSuccess");
                scope.$digest();
                scope.Save();
                expect(confirmationServiceMock.Confirm).toHaveBeenCalled();
                scope.$digest();
                expect(promotionServiceMock.Upsert).toHaveBeenCalledWith(promotion, true);
                expect(stateServiceMock.go).toHaveBeenCalledWith("^");
                expect(popupMessageServiceMock.ShowSuccess).toHaveBeenCalledWith(scope.L10N.PromotionUpdated);
            });
        });
    })(Tests = Forecasting.Tests || (Forecasting.Tests = {}));
})(Forecasting || (Forecasting = {}));
