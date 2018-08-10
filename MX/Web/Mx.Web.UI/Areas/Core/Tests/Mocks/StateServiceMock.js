var Core;
(function (Core) {
    var Tests;
    (function (Tests) {
        var StateServiceMock = (function () {
            function StateServiceMock($q) {
                this.$q = $q;
                this._helper = new PromiseHelper($q);
                this.current = {};
                this.current = {
                    name: "",
                    template: "",
                    templateUrl: "",
                    controller: "",
                    url: "",
                    params: []
                };
            }
            StateServiceMock.prototype.go = function (to, params, options) {
                this.current.name = to;
                return this._helper.CreateHttpPromise(null);
            };
            StateServiceMock.prototype.transitionTo = function (state, params, updateLocation) {
            };
            StateServiceMock.prototype.includes = function (state, params) {
                return true;
            };
            StateServiceMock.prototype.is = function (state, params) {
                return true;
            };
            StateServiceMock.prototype.href = function (state, params, options) {
                return "";
            };
            StateServiceMock.prototype.get = function () {
                return null;
            };
            StateServiceMock.prototype.reload = function () {
            };
            return StateServiceMock;
        }());
        Tests.StateServiceMock = StateServiceMock;
    })(Tests = Core.Tests || (Core.Tests = {}));
})(Core || (Core = {}));
