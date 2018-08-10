var Forecasting;
(function (Forecasting) {
    var Services;
    (function (Services) {
        "use strict";
        var PromotionService = (function () {
            function PromotionService(itemService, promotionService, constants) {
                this.itemService = itemService;
                this.promotionService = promotionService;
                this.constants = constants;
                this.EventPromotionUpserted = new Core.Events.Event();
                this.EventPromotionDeleted = new Core.Events.Event();
            }
            PromotionService.prototype.GetSearchItems = function (searchCriteria, vendorId) {
                return this.itemService.GetAll(searchCriteria).then(function (result) {
                    var items = [];
                    if (result.data != null) {
                        _.forEach(result.data, function (item) {
                            var addItem = {
                                Id: item.Id,
                                Name: item.Description,
                                Code: item.ItemCode,
                                EnabledForSelection: true
                            };
                            items.push(addItem);
                        });
                    }
                    return items;
                });
            };
            PromotionService.prototype.Get = function (startDate, endDate, status) {
                if (startDate === void 0) { startDate = null; }
                if (endDate === void 0) { endDate = null; }
                if (status === void 0) { status = null; }
                var promise = this.promotionService.Get(startDate ? moment(startDate).format(this.constants.InternalDateFormat) : null, endDate ? moment(endDate).format(this.constants.InternalDateFormat) : null, status);
                return promise;
            };
            PromotionService.prototype.GetFormData = function (id) {
                var promise = this.promotionService.GetFormData(id, true);
                return promise;
            };
            PromotionService.prototype.Upsert = function (promo, checkOverlap) {
                var _this = this;
                var promise = this.promotionService.Post(promo, checkOverlap);
                promise.success(function (result) {
                    if (!result.Overlaps || !result.Overlaps.length) {
                        _this.EventPromotionUpserted.Fire(null);
                    }
                });
                return promise;
            };
            PromotionService.prototype.Delete = function (id) {
                var _this = this;
                var promise = this.promotionService.Delete(id);
                promise.success(function () {
                    _this.EventPromotionDeleted.Fire(id);
                });
                return promise;
            };
            return PromotionService;
        }());
        Services.PromotionService = PromotionService;
        Services.$promotionService = Core.NG.ForecastingModule.RegisterService("PromotionService", PromotionService, Forecasting.Api.$salesItemService, Forecasting.Api.$promotionService, Core.Constants);
    })(Services = Forecasting.Services || (Forecasting.Services = {}));
})(Forecasting || (Forecasting = {}));
