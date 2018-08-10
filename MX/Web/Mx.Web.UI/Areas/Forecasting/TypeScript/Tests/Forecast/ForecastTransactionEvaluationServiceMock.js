var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Forecasting;
(function (Forecasting) {
    var Tests;
    (function (Tests) {
        "use strict";
        var _myDefaults = {};
        var ForecastTransactionEvaluationServiceMock = (function (_super) {
            __extends(ForecastTransactionEvaluationServiceMock, _super);
            function ForecastTransactionEvaluationServiceMock($q) {
                var _this = this;
                _super.call(this, $q, _myDefaults);
                this.$q = $q;
                this.Object = {
                    GetEvaluateTransactions: function (entityId, date, filterId) {
                        return _this.GetDataHttpPromise("GetEvaluateTransactions");
                    }
                };
            }
            return ForecastTransactionEvaluationServiceMock;
        }(Tests.DataMock));
        Tests.ForecastTransactionEvaluationServiceMock = ForecastTransactionEvaluationServiceMock;
        ;
    })(Tests = Forecasting.Tests || (Forecasting.Tests = {}));
})(Forecasting || (Forecasting = {}));
