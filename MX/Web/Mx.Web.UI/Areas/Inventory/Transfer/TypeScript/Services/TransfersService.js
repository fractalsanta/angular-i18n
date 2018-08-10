var Inventory;
(function (Inventory) {
    var Transfer;
    (function (Transfer) {
        var TransfersService = (function () {
            function TransfersService($authService, transferApiService) {
                this.$authService = $authService;
                this.transferApiService = transferApiService;
            }
            TransfersService.prototype.GetCurrentTransfer = function () {
                return this._currentTransfer;
            };
            TransfersService.prototype.SetCurrentTransfer = function (transfer) {
                this._currentTransfer = transfer;
            };
            TransfersService.prototype.GetByTransferIdAndEntityId = function (transferId, entityId) {
                var promise = this.transferApiService.GetByTransferIdAndEntityId(transferId, entityId).then(function (result) { return result.data; });
                return promise;
            };
            TransfersService.prototype.PutTransferDetailWithUpdatedCostAndQuantity = function (transferDetail) {
                return this.transferApiService.PutTransferDetailWithUpdatedCostAndQuantity(transferDetail).then(function (result) { return result.data; });
            };
            TransfersService.prototype.IsNoCostItem = function (item) {
                return !item.ZeroCostItem && (item.TransferCost === 0 || item.UnitCost === 0 || item.TransferCost == null || item.UnitCost == null);
            };
            TransfersService.prototype.HasNoCostItems = function () {
                var _this = this;
                if (this._currentTransfer != null && this._currentTransfer.Details) {
                    return _.any(this._currentTransfer.Details, function (item) { return _this.IsNoCostItem(item) && _this.ItemIsBeingTransfered(item); });
                }
                return false;
            };
            TransfersService.prototype.UpdateNoCostItems = function (items) {
                var promise = {};
                if (this._currentTransfer != null && items != null && items.length > 0) {
                    var user = this.$authService.GetUser();
                    if (user != null && user.BusinessUser != null && user.BusinessUser.MobileSettings != null) {
                        var entityId = user.BusinessUser.MobileSettings.EntityId;
                        promise = this.transferApiService.PutUpdateNoCostItems(this._currentTransfer.Id, entityId, items);
                    }
                }
                return promise;
            };
            TransfersService.prototype.GetNoCostValues = function () {
                var _this = this;
                if (this._currentTransfer != null && this._currentTransfer.Details) {
                    var noCostItems = _.where(this._currentTransfer.Details, function (item) { return _this.IsNoCostItem(item) && _this.ItemIsBeingTransfered(item); });
                    var items = _.map(noCostItems, function (item) {
                        var countItem = {
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
            };
            TransfersService.prototype.ItemIsBeingTransfered = function (item) {
                return (item.TransferQty1 > 0 || item.TransferQty2 > 0 || item.TransferQty3 > 0 || item.TransferQty4 > 0);
            };
            return TransfersService;
        }());
        Transfer.TransfersService = TransfersService;
        Transfer.transfersService = Core.NG.InventoryTransferModule.RegisterService("TransfersService", TransfersService, Core.Auth.$authService, Transfer.Api.$transferService, Inventory.Count.Api.$updateCostService);
    })(Transfer = Inventory.Transfer || (Inventory.Transfer = {}));
})(Inventory || (Inventory = {}));
