var Core;
(function (Core) {
    var Tests;
    (function (Tests) {
        var ConfirmationServiceMock = (function () {
            function ConfirmationServiceMock(q) {
                this.q = q;
                this._result = true;
                this._isCalled = false;
            }
            ConfirmationServiceMock.prototype.SetConfirm = function (value) {
                this._result = value;
            };
            ConfirmationServiceMock.prototype.IsCalled = function () {
                return this._isCalled;
            };
            ConfirmationServiceMock.prototype.Confirm = function (confirmationSettings) {
                this._isCalled = true;
                var deferred = this.q.defer();
                deferred.resolve(this._result);
                return deferred.promise;
            };
            ConfirmationServiceMock.prototype.ConfirmCheckbox = function (confirmationSettings) {
                return this.Confirm(confirmationSettings);
            };
            return ConfirmationServiceMock;
        }());
        Tests.ConfirmationServiceMock = ConfirmationServiceMock;
    })(Tests = Core.Tests || (Core.Tests = {}));
})(Core || (Core = {}));
