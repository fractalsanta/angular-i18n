var Core;
(function (Core) {
    (function (Tests) {
        var ModalMessageServiceMock = (function () {
            function ModalMessageServiceMock($q, result) {
                var _this = this;
                this.$q = $q;
                this.Object = {
                    CreateConfirmationModal: function (confirmMessage) {
                        var instance = new Tests.ModalServiceInstanceMock(_this.$q);
                        instance.SetResult(_this._data);

                        _this._instance = instance.Object;
                        return _this._instance;
                    },
                    CreateNotificationModal: function (modalMessage) {
                        var instance = new Tests.ModalServiceInstanceMock(_this.$q);
                        instance.SetResult(_this._data);

                        _this._instance = instance.Object;
                        return _this._instance;
                    }
                };
                this._helper = new PromiseHelper($q);
                this._data = result;
            }
            return ModalMessageServiceMock;
        })();
        Tests.ModalMessageServiceMock = ModalMessageServiceMock;
    })(Core.Tests || (Core.Tests = {}));
    var Tests = Core.Tests;
})(Core || (Core = {}));
//# sourceMappingURL=ModalMessageServiceMock.js.map
