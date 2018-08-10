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
        var ForecastSalesItemEvaluationServiceMock = (function (_super) {
            __extends(ForecastSalesItemEvaluationServiceMock, _super);
            function ForecastSalesItemEvaluationServiceMock($q) {
                var _this = this;
                _super.call(this, $q, _myDefaults);
                this.$q = $q;
                this.Object = {
                    Get: function (entityId, salesItemId, date, filterId) {
                        return _this.GetDataHttpPromise("Get");
                    }
                };
            }
            return ForecastSalesItemEvaluationServiceMock;
        }(Tests.DataMock));
        Tests.ForecastSalesItemEvaluationServiceMock = ForecastSalesItemEvaluationServiceMock;
        ;
    })(Tests = Forecasting.Tests || (Forecasting.Tests = {}));
})(Forecasting || (Forecasting = {}));
