var Inventory;
(function (Inventory) {
    var Transfer;
    (function (Transfer) {
        var Tests;
        (function (Tests) {
            "use strict";
            var TransferApiServiceMock = (function () {
                function TransferApiServiceMock($q) {
                    var _this = this;
                    this.$q = $q;
                    this.Object = {
                        GetByTransferIdAndEntityId: function (transferId, entityId) {
                            return _this._helper.CreateHttpPromise(_this._data);
                        },
                        GetPendingTransfersFromStoreByEntityId: function (transferFromEntityId) {
                            return _this._helper.CreateHttpPromise(_this._data);
                        },
                        GetTransfersByStoreAndDateRange: function (entityId, startTime, endTime) {
                            return _this._helper.CreateHttpPromise({});
                        },
                        PostCreateInventoryTransfer: function (transferFromEntityId, transferToEntityId, body) {
                            return _this._helper.CreateHttpPromise({});
                        },
                        PutUpdateTransferQuantities: function (transfer, isApproved, reason) {
                            return _this._helper.CreateHttpPromise({});
                        },
                        PutTransferDetailWithUpdatedCostAndQuantity: function (transferDetail) {
                            return _this._helper.CreateHttpPromise(_this._putTransferDetailData);
                        },
                        PutUpdateNoCostItems: function (transferId, entityId, updateCostItems) {
                            return _this._helper.CreateHttpPromise({});
                        }
                    };
                    this._helper = new PromiseHelper($q);
                }
                TransferApiServiceMock.prototype.SetGetByTransferId = function (data) {
                    this._data = data;
                    return this;
                };
                TransferApiServiceMock.prototype.SetGetPendingTransfersFromStoreByEntityId = function (data) {
                    this._data = data;
                    return this;
                };
                TransferApiServiceMock.prototype.SetPutTransferDetailWithUpdatedCostAndQuantity = function (data) {
                    this._putTransferDetailData = data;
                    return this;
                };
                return TransferApiServiceMock;
            }());
            Tests.TransferApiServiceMock = TransferApiServiceMock;
        })(Tests = Transfer.Tests || (Transfer.Tests = {}));
    })(Transfer = Inventory.Transfer || (Inventory.Transfer = {}));
})(Inventory || (Inventory = {}));
