var Forecasting;
(function (Forecasting) {
    var Tests;
    (function (Tests) {
        "use strict";
        var TranslatedPosServiceTypeServiceMock = (function () {
            function TranslatedPosServiceTypeServiceMock($q) {
                var _this = this;
                this.$q = $q;
                this.Object = {
                    GetPosServiceTypeEnumTranslations: function () {
                        return _this._promiseHelper.CreateHttpPromise(_this._records);
                    }
                };
                this._promiseHelper = new PromiseHelper($q);
                this._records = [];
            }
            TranslatedPosServiceTypeServiceMock.prototype.InjectRecordsToReturn = function (records) {
                this._records = records;
            };
            return TranslatedPosServiceTypeServiceMock;
        }());
        Tests.TranslatedPosServiceTypeServiceMock = TranslatedPosServiceTypeServiceMock;
    })(Tests = Forecasting.Tests || (Forecasting.Tests = {}));
})(Forecasting || (Forecasting = {}));
