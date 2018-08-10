var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Forecasting;
(function (Forecasting) {
    (function (Tests) {
        "use strict";

        var _myDefaults = {};

        var SalesItemServiceMock = (function (_super) {
            __extends(SalesItemServiceMock, _super);
            function SalesItemServiceMock($q, defaults) {
                _super.call(this, $q, defaults || _myDefaults);
                this.$q = $q;
                this.Object = {
                    GetSalesItemsForForecast: function (entityId, forecastId) {
                        return this.GetDataHttpPromise("GetSalesItemsForForecast");
                    },
                    Get: function (entityId, forecastId, id) {
                        return this.GetDataHttpPromise("Get");
                    },
                    GetAll: function (searchText) {
                        return this.GetDataHttpPromise("GetAll");
                    }
                };
            }
            return SalesItemServiceMock;
        })(Tests.DataMock);
        Tests.SalesItemServiceMock = SalesItemServiceMock;
        ;
    })(Forecasting.Tests || (Forecasting.Tests = {}));
    var Tests = Forecasting.Tests;
})(Forecasting || (Forecasting = {}));
//# sourceMappingURL=SalesItemServiceMock.js.map
