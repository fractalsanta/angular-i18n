var Core;
(function (Core) {
    var Tests;
    (function (Tests) {
        var ModalServiceMock = (function () {
            function ModalServiceMock($q, result) {
                var _this = this;
                this.$q = $q;
                this.Object = {
                    open: function (options) {
                        var instance = new Tests.ModalServiceInstanceMock(_this.$q);
                        instance.SetResult(_this._data);
                        _this._instance = instance.Object;
                        return _this._instance;
                    }
                };
                this._helper = new PromiseHelper($q);
                this._data = result;
            }
            return ModalServiceMock;
        }());
        Tests.ModalServiceMock = ModalServiceMock;
    })(Tests = Core.Tests || (Core.Tests = {}));
})(Core || (Core = {}));
