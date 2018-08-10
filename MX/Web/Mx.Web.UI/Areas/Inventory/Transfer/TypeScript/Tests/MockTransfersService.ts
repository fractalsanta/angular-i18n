module Inventory.Transfer.Tests {
    "use strict";

    export class TransfersServiceMock implements Core.Tests.IMock<ITransfersService> {
        private _transfer: Api.Models.ITransfer;
        private _putTransferDetailData: any;
        private _helper: PromiseHelper;

        constructor(private $q: ng.IQService) {
            this._helper = new PromiseHelper($q);
            this._putTransferDetailData = {};
            this._transfer = <Api.Models.ITransfer>{};
        }

        public Object: ITransfersService = {
            GetCurrentTransfer: (): Api.Models.ITransfer => {
                return this._transfer;
            },

            SetCurrentTransfer: (transfer: Api.Models.ITransfer) => {
                this._transfer = transfer;                
            },

            GetByTransferIdAndEntityId: (transferId: number, entityId: number): ng.IPromise<Api.Models.ITransfer> => {
                return this._helper.CreatePromise(this._transfer);
            },

            PutTransferDetailWithUpdatedCostAndQuantity: (transferDetail: Api.Models.ITransferDetail) => {
                return this._helper.CreatePromise(this._putTransferDetailData);
            },
            HasNoCostItems: () => {
                return true;
            },
            UpdateNoCostItems: (items: Inventory.Count.Api.Models.IUpdateCostViewModel[]) => {
                return this._helper.CreateHttpPromise({});   
            },
            GetNoCostValues: () => {
                return [];
            }
        }     

        public SetPutTransferDetailWithUpdatedCostAndQuantity(data: Api.Models.ITransferDetail) {
            this._putTransferDetailData = data;
        }
    }
}