module Inventory.Transfer {
    export interface ITransferStoreServiceMock extends Core.Tests.IMock<Api.ITransferStoreService> {
        SetGetTransferableItemsBetweenStoresLimited(data: Api.Models.ITransferableItem[]): void;
    }

    export class TransferStoreServiceMock implements ITransferStoreServiceMock {
        private _data: any;
        private _helper: PromiseHelper;

        constructor(private $q: ng.IQService) {
            this._helper = new PromiseHelper($q);
        }

        Object: Api.ITransferStoreService = {
            GetNeighboringStores: (currentStoreId: number): 
                    ng.IHttpPromise<Api.Models.IStoreItem[]> => {
                return this._helper.CreateHttpPromise(this._data);
            },

            GetTransferableItemsBetweenStoresLimited: (fromEntityId: number, toEntityId: number, filter: string): 
                    ng.IHttpPromise<Api.Models.ITransferableItem[]> => {

                var items2 = [
                    <Api.Models.ITransferableItem>{
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
                    <Api.Models.ITransferableItem > {
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

                return this._helper.CreateHttpPromise(items2);
            }
        }

        SetGetTransferableItemsBetweenStoresLimited(data: Api.Models.ITransferableItem[]) {
            this._data = data;
            return this;
        }
    }
} 