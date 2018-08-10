module Inventory.Transfer.Tests {
    "use strict";

    export class TransferHistoryServiceMock implements Core.Tests.IMock<Api.ITransferHistoryService> {
        private _data: Api.Models.ITransferHeaderWithEntities[];
        private _transferReporting: Api.Models.ITransferReporting;
        private _helper: PromiseHelper;

        constructor(private $q: ng.IQService) {
            this._helper = new PromiseHelper($q);
        }

        public Object: Api.ITransferHistoryService = {
            GetTransfersWithEntitiesByStoreAndDateRange: (entityId: number, startTime: string, endTime: string): ng.IHttpPromise<Inventory.Transfer.Api.Models.ITransferHeaderWithEntities[]> => {
                return this._helper.CreateHttpPromise(this._data);
            },

            GetByTransferIdWithReportingUnits: (transferId: number, entityId: number): ng.IHttpPromise<Inventory.Transfer.Api.Models.ITransferReporting> => {
                return this._helper.CreateHttpPromise(this._transferReporting);
            }
        }

        public SetGetTransfersWithEntitiesByStoreAndDateRange(data: Api.Models.ITransferHeaderWithEntities[]) {
            this._data = data;
            return this;
        }

        public SetGetByTransferIdWithReportingUnits(data: Api.Models.ITransferReporting) {
            this._transferReporting = data;
            return this;
        }
    }
}