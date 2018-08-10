var Inventory;
(function (Inventory) {
    var Transfer;
    (function (Transfer) {
        var TransferStoreServiceMock = (function () {
            function TransferStoreServiceMock($q) {
                var _this = this;
                this.$q = $q;
                this.Object = {
                    GetNeighboringStores: function (currentStoreId) {
                        return _this._helper.CreateHttpPromise(_this._data);
                    },
                    GetTransferableItemsBetweenStoresLimited: function (fromEntityId, toEntityId, filter) {
                        var items2 = [
                            {
                                Code: "3",
                                Conversion: 1,
                                Description: "Description.3",
                                Id: 1,
                                InventoryIndicator: "InventoryIndicator.3",
                                TransferUnit1: "Unit1.3",
                                TransferUnit2: "Unit2.3",
                                TransferUnit3: "Unit3.3",
                                TransferUnit4: "Unit4.3",
                                InventoryUnitCost: 3,
                                PurchaseUnit: "PurchaseUnit.3",
                                Suggested: false,
                                OnHandQuantity: 4,
                                TransferQty1: 5,
                                TransferQty2: 6,
                                TransferQty3: 7,
                                TransferQty4: 8,
                                VendorItemId: 9
                            },
                            {
                                Code: "4",
                                Conversion: 2,
                                Description: "Description.4",
                                Id: 2,
                                InventoryIndicator: "InventoryIndicator.4",
                                TransferUnit1: "Unit1.4",
                                TransferUnit2: "Unit2.4",
                                TransferUnit3: "Unit3.4",
                                TransferUnit4: "Unit4.4",
                                InventoryUnitCost: 10,
                                PurchaseUnit: "PurchaseUnit.4",
                                Suggested: false,
                                OnHandQuantity: 11,
                                TransferQty1: 12,
                                TransferQty2: 13,
                                TransferQty3: 14,
                                TransferQty4: 15,
                                VendorItemId: 16
                            }
                        ];
                        return _this._helper.CreateHttpPromise(items2);
                    }
                };
                this._helper = new PromiseHelper($q);
            }
            TransferStoreServiceMock.prototype.SetGetTransferableItemsBetweenStoresLimited = function (data) {
                this._data = data;
                return this;
            };
            return TransferStoreServiceMock;
        }());
        Transfer.TransferStoreServiceMock = TransferStoreServiceMock;
    })(Transfer = Inventory.Transfer || (Inventory.Transfer = {}));
})(Inventory || (Inventory = {}));
