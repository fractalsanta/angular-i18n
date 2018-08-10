 module Forecasting.Services {
     "use strict";

     export interface IPromotionService extends
            Inventory.IAddItemService {
        EventPromotionUpserted: Core.Events.IEvent<void>;
        EventPromotionDeleted: Core.Events.IEvent<number>;
        
        Get(startDate: Date, endDate: Date, status: Api.Enums.PromotionStatus): ng.IHttpPromise<Api.Models.IPromotionListItem[]>;
        GetFormData(id: number): ng.IHttpPromise<Api.Models.IPromotionFormData>;
        Upsert(promo: Api.Models.IPromotion, checkOverlap: boolean): ng.IHttpPromise<Api.Models.IPromotionResult>;
        Delete(id: number): ng.IHttpPromise<{}>;
    }

    export class PromotionService implements IPromotionService {
        public EventPromotionUpserted: Core.Events.IEvent<void>;
        public EventPromotionDeleted: Core.Events.IEvent<number>;

        constructor(private itemService: Api.ISalesItemService
            , private promotionService: Api.IPromotionService
            , private constants: Core.IConstants
        ) {
            this.EventPromotionUpserted = new Core.Events.Event<void>();
            this.EventPromotionDeleted = new Core.Events.Event<number>();
        }

        public GetSearchItems(searchCriteria: string, vendorId?: number): ng.IPromise<Inventory.IAddItem[]> {
            return this.itemService.GetAll(searchCriteria).then((result) => {
                var items = <Inventory.IAddItem[]>[];
                if (result.data != null) {
                    _.forEach(result.data, (item) => {
                        var addItem = <Inventory.IAddItem>{
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
        }

        public Get(startDate: Date = null, endDate: Date = null, status: Api.Enums.PromotionStatus = null): ng.IHttpPromise<Api.Models.IPromotionListItem[]> {
            var promise = this.promotionService.Get(startDate ? moment(startDate).format(this.constants.InternalDateFormat) : null,
                endDate ? moment(endDate).format(this.constants.InternalDateFormat) : null, status);
            return promise;
        }

        public GetFormData(id: number): ng.IHttpPromise<Api.Models.IPromotionFormData> {
            var promise = this.promotionService.GetFormData(id, true);
            return promise;
        }

        public Upsert(promo: Api.Models.IPromotion, checkOverlap: boolean): ng.IHttpPromise<Api.Models.IPromotionResult> {
            var promise = this.promotionService.Post(promo, checkOverlap);
            promise.success((result: Api.Models.IPromotionResult) => {
                if (!result.Overlaps || !result.Overlaps.length) {
                    // no overlaps returned means upsert went through
                    this.EventPromotionUpserted.Fire(null);
                }
            });
            return promise;
        }

        public Delete(id: number): ng.IHttpPromise<{}> {
            var promise = this.promotionService.Delete(id);
            promise.success(() => {
                this.EventPromotionDeleted.Fire(id);
            });
            return promise;
        }
    }

    export var $promotionService: Core.NG.INamedService<IPromotionService> = Core.NG.ForecastingModule.RegisterService("PromotionService"
        , PromotionService
        , Api.$salesItemService
        , Api.$promotionService
        , Core.Constants
        );
}