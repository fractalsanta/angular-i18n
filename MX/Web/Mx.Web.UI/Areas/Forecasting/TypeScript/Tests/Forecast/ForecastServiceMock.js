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
        var _myDefaults = {
            GetForecastForBusinessDay: { "Id": 485544, "EntityId": 386, "ForecastStatus": 0, "BusinessDay": "2015-07-01T00:00:00", "GenerationDate": "2015-07-01T22:03:06", "LastYearSales": 14785.0, "ManagerSales": 12930.0, "LastYearTransactionCount": 1896.0, "ManagerTransactionCount": 1793.0, "Version": 0, "IsDayLocked": false, "HasBeenEdited": false }
        };
        var ForecastServiceMock = (function (_super) {
            __extends(ForecastServiceMock, _super);
            function ForecastServiceMock($q, defaults) {
                var _this = this;
                _super.call(this, $q, defaults || _myDefaults);
                this.$q = $q;
                this.Object = {
                    GetForecastById: function (entityId, id, filterId) {
                        return _this.GetDataHttpPromise("GetForecastById");
                    },
                    GetForecastForBusinessDay: function (entityId, businessDay) {
                        return _this.GetDataHttpPromise("GetForecastForBusinessDay");
                    },
                    GetForecastsForBusinessDateRange: function (entityId, startDate, endDate) {
                        return _this.GetDataHttpPromise("GetForecastsForBusinessDateRange");
                    },
                    GetForecasts: function (entityId) {
                        return _this.GetDataHttpPromise("GetForecasts");
                    },
                    PatchRevertForecast: function (entityId, forecastId, opcollection) {
                        return _this.GetDataHttpPromise("PatchRevertForecast");
                    }
                };
            }
            return ForecastServiceMock;
        }(Tests.DataMock));
        Tests.ForecastServiceMock = ForecastServiceMock;
        ;
    })(Tests = Forecasting.Tests || (Forecasting.Tests = {}));
})(Forecasting || (Forecasting = {}));
