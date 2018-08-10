var Inventory;
(function (Inventory) {
    var Transfer;
    (function (Transfer) {
        var ModalServiceInstanceMock = (function () {
            function ModalServiceInstanceMock($q, data) {
                this.$q = $q;
                this._data = data;
                this._helper = new PromiseHelper($q);
                this.result = this._helper.CreatePromise(this._data);
            }
            ModalServiceInstanceMock.prototype.close = function (reason) {
                return reason;
            };
            ModalServiceInstanceMock.prototype.dismiss = function (reason) {
            };
            return ModalServiceInstanceMock;
        }());
        Transfer.ModalServiceInstanceMock = ModalServiceInstanceMock;
        var ModalServiceMock = (function () {
            function ModalServiceMock($q) {
                this.$q = $q;
                this._helper = new PromiseHelper($q);
            }
            ModalServiceMock.prototype.SetAddNewItems = function (items) {
                this._data = items;
                return this;
            };
            ModalServiceMock.prototype.open = function (options) {
                this._instance = new ModalServiceInstanceMock(this.$q, this._data);
                return this._instance;
            };
            return ModalServiceMock;
        }());
        Transfer.ModalServiceMock = ModalServiceMock;
    })(Transfer = Inventory.Transfer || (Inventory.Transfer = {}));
})(Inventory || (Inventory = {}));
