var Core;
(function (Core) {
    var Tests;
    (function (Tests) {
        var ModalServiceInstanceMock = (function () {
            function ModalServiceInstanceMock($q) {
                var _this = this;
                this.$q = $q;
                this.Object = {
                    close: function () { },
                    dismiss: function () { },
                    result: this._result,
                    opened: this._opened,
                    rendered: this._rendered,
                    SetResult: function (result) { _this.SetResult(result); }
                };
                this._helper = new PromiseHelper($q);
            }
            ModalServiceInstanceMock.prototype.SetResult = function (result) {
                this._result = this._helper.CreatePromise(result);
            };
            return ModalServiceInstanceMock;
        }());
        Tests.ModalServiceInstanceMock = ModalServiceInstanceMock;
    })(Tests = Core.Tests || (Core.Tests = {}));
})(Core || (Core = {}));
