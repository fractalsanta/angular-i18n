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
        var ForecastSalesEvaluationServiceMock = (function (_super) {
            __extends(ForecastSalesEvaluationServiceMock, _super);
            function ForecastSalesEvaluationServiceMock($q) {
                var _this = this;
                _super.call(this, $q, _myDefaults);
                this.$q = $q;
                this.Object = {
                    GetEvaluateSales: function (entityId, date, filterId) {
                        return _this.GetDataHttpPromise("GetEvaluateSales");
                    }
                };
            }
            return ForecastSalesEvaluationServiceMock;
        }(Tests.DataMock));
        Tests.ForecastSalesEvaluationServiceMock = ForecastSalesEvaluationServiceMock;
        ;
    })(Tests = Forecasting.Tests || (Forecasting.Tests = {}));
})(Forecasting || (Forecasting = {}));
