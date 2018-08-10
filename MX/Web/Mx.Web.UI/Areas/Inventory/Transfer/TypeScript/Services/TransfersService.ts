module Inventory.Transfer {

    export class TransfersService implements ITransfersService {

        private _currentTransfer: Api.Models.ITransfer;

        constructor(private $authService: Core.Auth.IAuthService
            , private transferApiService: Api.ITransferService) {

        }

        GetCurrentTransfer(): Api.Models.ITransfer {
            return this._currentTransfer;
        }

        SetCurrentTransfer(transfer: Api.Models.ITransfer) {
            this._currentTransfer = transfer;
        }

        GetByTransferIdAndEntityId(transferId: number, entityId: number) {
            var promise = this.transferApiService.GetByTransferIdAndEntityId(transferId, entityId).then((result) => result.data);
            return promise;
        }

        PutTransferDetailWithUpdatedCostAndQuantity(transferDetail: Api.Models.ITransferDetail) {
            return this.transferApiService.PutTransferDetailWithUpdatedCostAndQuantity(transferDetail).then((result) => result.data);
        }

        IsNoCostItem(item: Api.Models.ITransferDetail) {
            return !item.ZeroCostItem && (item.TransferCost === 0 || item.UnitCost === 0 || item.TransferCost == null || item.UnitCost == null);
        }

        HasNoCostItems() {            
            if (this._currentTransfer != null && this._currentTransfer.Details) {
                return _.any(this._currentTransfer.Details, (item: Api.Models.ITransferDetail) => this.IsNoCostItem(item) && this.ItemIsBeingTransfered(item));
            }
            return false;
        }

        UpdateNoCostItems(items: Inventory.Count.Api.Models.IUpdateCostViewModel[]) {
            var promise = <ng.IHttpPromise<{}>> {};

            if (this._currentTransfer != null && items != null && items.length > 0) {
                var user = this.$authService.GetUser();
                if (user != null && user.BusinessUser != null && user.BusinessUser.MobileSettings != null) {
                    var entityId = user.BusinessUser.MobileSettings.EntityId;
                    promise = this.transferApiService.PutUpdateNoCostItems(this._currentTransfer.Id, entityId, items);
                }
            }
            return promise;
        }

        GetNoCostValues() {
            if (this._currentTransfer != null && this._currentTransfer.Details) {
                var noCostItems = _.where(this._currentTransfer.Details, (item) => this.IsNoCostItem(item) && this.ItemIsBeingTransfered(item));
                var items = _.map(noCostItems, (item: Api.Models.ITransferDetail) => {
                        var countItem = <Inventory.Count.Api.Models.ICountItem>{
                            Description: item.Description,
                            OuterUnit: item.OuterUom,
                            InventoryUnit: item.InventoryUnit,
                            ItemCost: item.UnitCost,
                            ItemId: item.ItemId
                        };
                        return countItem;
                });

                return items;
            }
            return null;
        }

        private ItemIsBeingTransfered(item: Api.Models.ITransferDetail) {
            return (item.TransferQty1 > 0 || item.TransferQty2 > 0 || item.TransferQty3 > 0 || item.TransferQty4 > 0);
        }
    }

    transfersService = Core.NG.InventoryTransferModule.RegisterService("TransfersService"
        , TransfersService
        , Core.Auth.$authService
        , Api.$transferService
        , Inventory.Count.Api.$updateCostService);
} 