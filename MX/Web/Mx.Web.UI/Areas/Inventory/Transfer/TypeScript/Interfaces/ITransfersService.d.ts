declare module Inventory.Transfer {
    export interface ITransfersService extends IUpdateNoCostItemService {
        SetCurrentTransfer(transfer: Api.Models.ITransfer);
        GetByTransferIdAndEntityId(transferId: number, entityId: number): ng.IPromise<Api.Models.ITransfer>;
        PutTransferDetailWithUpdatedCostAndQuantity(transferDetail: Api.Models.ITransferDetail): ng.IPromise<Api.Models.ITransferDetail>;
        GetCurrentTransfer(): Api.Models.ITransfer;
    }

    export var transfersService: Core.NG.INamedService<ITransfersService>;
}
