var Inventory;
(function (Inventory) {
    var Transfer;
    (function (Transfer) {
        var Tests;
        (function (Tests) {
            "use strict";
            var TransferHistoryServiceMock = (function () {
                function TransferHistoryServiceMock($q) {
                    var _this = this;
                    this.$q = $q;
                    this.Object = {
                        GetTransfersWithEntitiesByStoreAndDateRange: function (entityId, startTime, endTime) {
                            return _this._helper.CreateHttpPromise(_this._data);
                        },
                        GetByTransferIdWithReportingUnits: function (transferId, entityId) {
                            return _this._helper.CreateHttpPromise(_this._transferReporting);
                        }
                    };
                    this._helper = new PromiseHelper($q);
                }
                TransferHistoryServiceMock.prototype.SetGetTransfersWithEntitiesByStoreAndDateRange = function (data) {
                    this._data = data;
                    return this;
                };
                TransferHistoryServiceMock.prototype.SetGetByTransferIdWithReportingUnits = function (data) {
                    this._transferReporting = data;
                    return this;
                };
                return TransferHistoryServiceMock;
            }());
            Tests.TransferHistoryServiceMock = TransferHistoryServiceMock;
        })(Tests = Transfer.Tests || (Transfer.Tests = {}));
    })(Transfer = Inventory.Transfer || (Inventory.Transfer = {}));
})(Inventory || (Inventory = {}));
