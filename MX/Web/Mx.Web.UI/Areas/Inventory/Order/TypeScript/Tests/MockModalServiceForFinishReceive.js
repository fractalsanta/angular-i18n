var Inventory;
(function (Inventory) {
    (function (Order) {
        var ModalServiceInstanceMock = (function () {
            function ModalServiceInstanceMock($q, finishOrderData) {
                this.$q = $q;
                this._finishOrderData = finishOrderData;
                this._helper = new PromiseHelper($q);
                this.result = this._helper.CreatePromise(this._finishOrderData);
            }
            ModalServiceInstanceMock.prototype.close = function (reason) {
            };
            ModalServiceInstanceMock.prototype.dismiss = function (reason) {
            };
            return ModalServiceInstanceMock;
        })();
        Order.ModalServiceInstanceMock = ModalServiceInstanceMock;

        var ModalServiceMock = (function () {
            function ModalServiceMock($q) {
                this.$q = $q;
                this._helper = new PromiseHelper($q);
            }
            ModalServiceMock.prototype.SetFinishReceiveOrder = function (finishOrderData) {
                this._finishOrderData = finishOrderData;
                return this;
            };

            ModalServiceMock.prototype.open = function (options) {
                this._instance = new ModalServiceInstanceMock(this.$q, this._finishOrderData);
                return this._instance;
            };
            return ModalServiceMock;
        })();
        Order.ModalServiceMock = ModalServiceMock;
    })(Inventory.Order || (Inventory.Order = {}));
    var Order = Inventory.Order;
})(Inventory || (Inventory = {}));
//# sourceMappingURL=MockModalServiceForFinishReceive.js.map
