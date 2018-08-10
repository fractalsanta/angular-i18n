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
        var DaySegmentServiceMock = (function (_super) {
            __extends(DaySegmentServiceMock, _super);
            function DaySegmentServiceMock($q) {
                var _this = this;
                _super.call(this, $q, _myDefaults);
                this.$q = $q;
                this.Object = {
                    GetDaysegments: function (entityId) {
                        return _this.GetDataHttpPromise("GetDaysegments");
                    }
                };
            }
            return DaySegmentServiceMock;
        }(Tests.DataMock));
        Tests.DaySegmentServiceMock = DaySegmentServiceMock;
        ;
    })(Tests = Forecasting.Tests || (Forecasting.Tests = {}));
})(Forecasting || (Forecasting = {}));
