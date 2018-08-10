var Inventory;
(function (Inventory) {
    var Order;
    (function (Order) {
        var ModalServiceInstanceMock = (function () {
            function ModalServiceInstanceMock($q, data) {
                this.$q = $q;
                this._data = data;
                this._helper = new PromiseHelper($q);
                this.result = this._helper.CreatePromise(this._data);
            }
            ModalServiceInstanceMock.prototype.close = function (reason) {
            };
            ModalServiceInstanceMock.prototype.dismiss = function (reason) {
            };
            return ModalServiceInstanceMock;
        }());
        Order.ModalServiceInstanceMock = ModalServiceInstanceMock;
        var ModalServiceMock = (function () {
            function ModalServiceMock($q) {
                this.$q = $q;
                this._helper = new PromiseHelper($q);
            }
            ModalServiceMock.prototype.SetChangeApplyDate = function (changeApplyDateData) {
                this._data = changeApplyDateData;
                return this;
            };
            ModalServiceMock.prototype.SetFinishReceiveOrder = function (finishOrderData) {
                this._data = finishOrderData;
                return this;
            };
            ModalServiceMock.prototype.open = function (options) {
                this._instance = new ModalServiceInstanceMock(this.$q, this._data);
                return this._instance;
            };
            return ModalServiceMock;
        }());
        Order.ModalServiceMock = ModalServiceMock;
    })(Order = Inventory.Order || (Inventory.Order = {}));
})(Inventory || (Inventory = {}));
