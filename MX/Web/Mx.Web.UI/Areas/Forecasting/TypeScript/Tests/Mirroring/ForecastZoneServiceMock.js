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

        var ForecastZoneServiceMock = (function (_super) {
            __extends(ForecastZoneServiceMock, _super);
            function ForecastZoneServiceMock($q, defaults) {
                _super.call(this, $q, defaults || _myDefaults);
                this.$q = $q;
                this.Object = {
                    GetForecastZones: function () {
                        return this.GetDataHttpPromise("GetForecastZones");
                    }
                };
            }
            return ForecastZoneServiceMock;
        })(Tests.DataMock);
        Tests.ForecastZoneServiceMock = ForecastZoneServiceMock;
        ;
    })(Forecasting.Tests || (Forecasting.Tests = {}));
    var Tests = Forecasting.Tests;
})(Forecasting || (Forecasting = {}));
//# sourceMappingURL=ForecastZoneServiceMock.js.map
