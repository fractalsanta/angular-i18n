module Inventory.Transfer.Tests {
    "use strict";
    
    export class TransferApiServiceMock implements Core.Tests.IMock<Api.ITransferService> {
        private _data: any;
        private _putTransferDetailData: any;
        private _helper: PromiseHelper;

        constructor(private $q: ng.IQService) {
            this._helper = new PromiseHelper($q);
        }

        public Object: Api.ITransferService = {
            GetByTransferIdAndEntityId: (transferId: number, entityId: number): ng.IHttpPromise<Api.Models.ITransfer> => {
                return this._helper.CreateHttpPromise(this._data);
            },

            GetPendingTransfersFromStoreByEntityId: (transferFromEntityId: number): ng.IHttpPromise<Api.Models.ITransferHeader[]> => {
                return this._helper.CreateHttpPromise(this._data);
            },

            GetTransfersByStoreAndDateRange: (entityId: number, startTime: string, endTime: string): ng.IHttpPromise<Api.Models.ITransferHeader[]> => {
                return this._helper.CreateHttpPromise({});
            },

            PostCreateInventoryTransfer: (transferFromEntityId: number, transferToEntityId: number, /*[FromBody]*/ body: Inventory.Transfer.Api.Models.ITransferItemsRequest): ng.IHttpPromise<{}> => {
                return this._helper.CreateHttpPromise({});
            },

            PutUpdateTransferQuantities: (transfer: Api.Models.ITransfer, isApproved: boolean, reason: string) => {
                return this._helper.CreateHttpPromise({});
            },

            PutTransferDetailWithUpdatedCostAndQuantity: (transferDetail: Inventory.Transfer.Api.Models.ITransferDetail) => {
                return this._helper.CreateHttpPromise(this._putTransferDetailData);
            },
            PutUpdateNoCostItems: (transferId: number, entityId: number, /*[FromBody]*/ updateCostItems: Inventory.Count.Api.Models.IUpdateCostViewModel[]) => {
                return this._helper.CreateHttpPromise({});
            }
        }

      public SetGetByTransferId(data: Api.Models.ITransfer) {
            this._data = data;
            return this;
        }

        public SetGetPendingTransfersFromStoreByEntityId(data: Api.Models.ITransferHeader[]) {
            this._data = data;
            return this;
        }

        public SetPutTransferDetailWithUpdatedCostAndQuantity(data: Api.Models.ITransferDetail) {
            this._putTransferDetailData = data;
            return this;
        }
    }
}