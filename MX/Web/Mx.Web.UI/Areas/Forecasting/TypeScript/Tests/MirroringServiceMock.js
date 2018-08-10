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

        var MirroringServiceMock = (function (_super) {
            __extends(MirroringServiceMock, _super);
            function MirroringServiceMock($q, defaults) {
                var _this = this;
                _super.call(this, $q, defaults || _myDefaults);
                this.$q = $q;
                this.Object = {
                    GetSalesItemMirrorIntervals: function (startDate, endDate) {
                        return _this.GetDataHttpPromise("GetSalesItemMirrorIntervals");
                    },
                    GetForecastZones: function () {
                        return _this.GetDataHttpPromise("GetForecastZones");
                    },
                    GetSalesItems: function (searchText) {
                        return _this.GetDataHttpPromise("GetSalesItems");
                    },
                    Save: function (interval) {
                        return _this.GetDataHttpPromise("Save");
                    },
                    Delete: function (interval) {
                        return _this.GetDataHttpPromise("Delete");
                    },
                    CalculateMaxSourceStart: function (interval) {
                        return _this.mirroringService.CalculateMaxSourceStart(interval);
                    },
                    CalculateDates: function (interval) {
                        return _this.mirroringService.CalculateDates(interval);
                    },
                    Cast: function (interval) {
                        return _this.mirroringService.Cast(interval);
                    },
                    CalculateAdjustment: function (percentage) {
                        return _this.mirroringService.CalculateAdjustment(percentage);
                    }
                };

                this.constantsMock = new ConstantsMock();
                this.mirroringService = new Forecasting.Services.MirroringService($q, null, null, null, this.constantsMock.Object);
            }
            return MirroringServiceMock;
        })(Tests.DataMock);
        Tests.MirroringServiceMock = MirroringServiceMock;
        ;
    })(Forecasting.Tests || (Forecasting.Tests = {}));
    var Tests = Forecasting.Tests;
})(Forecasting || (Forecasting = {}));
//# sourceMappingURL=MirroringServiceMock.js.map
