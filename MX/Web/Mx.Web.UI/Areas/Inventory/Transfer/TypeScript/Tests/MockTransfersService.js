var Inventory;
(function (Inventory) {
    var Transfer;
    (function (Transfer) {
        var Tests;
        (function (Tests) {
            "use strict";
            var TransfersServiceMock = (function () {
                function TransfersServiceMock($q) {
                    var _this = this;
                    this.$q = $q;
                    this.Object = {
                        GetCurrentTransfer: function () {
                            return _this._transfer;
                        },
                        SetCurrentTransfer: function (transfer) {
                            _this._transfer = transfer;
                        },
                        GetByTransferIdAndEntityId: function (transferId, entityId) {
                            return _this._helper.CreatePromise(_this._transfer);
                        },
                        PutTransferDetailWithUpdatedCostAndQuantity: function (transferDetail) {
                            return _this._helper.CreatePromise(_this._putTransferDetailData);
                        },
                        HasNoCostItems: function () {
                            return true;
                        },
                        UpdateNoCostItems: function (items) {
                            return _this._helper.CreateHttpPromise({});
                        },
                        GetNoCostValues: function () {
                            return [];
                        }
                    };
                    this._helper = new PromiseHelper($q);
                    this._putTransferDetailData = {};
                    this._transfer = {};
                }
                TransfersServiceMock.prototype.SetPutTransferDetailWithUpdatedCostAndQuantity = function (data) {
                    this._putTransferDetailData = data;
                };
                return TransfersServiceMock;
            }());
            Tests.TransfersServiceMock = TransfersServiceMock;
        })(Tests = Transfer.Tests || (Transfer.Tests = {}));
    })(Transfer = Inventory.Transfer || (Inventory.Transfer = {}));
})(Inventory || (Inventory = {}));
