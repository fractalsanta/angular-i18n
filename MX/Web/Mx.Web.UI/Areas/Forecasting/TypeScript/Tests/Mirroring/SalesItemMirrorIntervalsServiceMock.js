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
            "GetSalesItemMirrorIntervals": [
                { SourceDateStart: "4/18/15", TargetDateStart: "05/16/15", TargetDateEnd: "05/30/15",
                    SourceSalesItem: { Id: 1, ItemCode: "11025", Description: "Milkshake, Kit-Kat" },
                    TargetSalesItem: { Id: 2, ItemCode: "11025", Description: "Milkshake, Kit-Kat" },
                    Zone: { Id: 3, Name: "Test Market - Alpharetta", EntityCount: 0 },
                    Id: 4,
                    Adjustment: 2
                },
                { SourceDateStart: "6/19/15", TargetDateStart: "07/17/15", TargetDateEnd: "07/31/15",
                    SourceSalesItem: { Id: 6, ItemCode: "Code", Description: "Desc" },
                    TargetSalesItem: { Id: 7, ItemCode: "Code", Description: "Desc" },
                    Zone: { Id: 8, Name: "Zone", EntityCount: 3 },
                    Id: 9,
                    Adjustment: 1
                },
                { SourceDateStart: "9/17/15", TargetDateStart: "10/15/15", TargetDateEnd: "10/29/15",
                    SourceSalesItem: { Id: 11, ItemCode: "12903", Description: "Lemonade, Frosted" },
                    TargetSalesItem: { Id: 12, ItemCode: "12903", Description: "Lemonade, Frosted" },
                    Zone: { Id: 13, Name: "Zone All Restaurants", EntityCount: 111 },
                    Id: 14,
                    Adjustment: 0
                }
            ]
        };
        var SalesItemMirrorIntervalsServiceMock = (function (_super) {
            __extends(SalesItemMirrorIntervalsServiceMock, _super);
            function SalesItemMirrorIntervalsServiceMock($q, defaults) {
                var _this = this;
                _super.call(this, $q, defaults || _myDefaults);
                this.$q = $q;
                this.Object = {
                    GetSalesItemMirrorInterval: function (id) {
                        return _this.GetDataHttpPromise("GetSalesItemMirrorInterval");
                    },
                    GetSalesItemMirrorIntervals: function (startDate, endDate) {
                        return _this.GetDataHttpPromise("GetSalesItemMirrorIntervals");
                    },
                    PostSalesItemMirrorIntervals: function (salesItemMirrorInterval) {
                        return _this.GetDataHttpPromise("PostSalesItemMirrorIntervals");
                    },
                    DeleteSalesItemMirrorIntervals: function (intervalId, resetManagerForecast) {
                        return _this.GetDataHttpPromise("DeleteSalesItemMirrorIntervals");
                    }
                };
            }
            return SalesItemMirrorIntervalsServiceMock;
        }(Tests.DataMock));
        Tests.SalesItemMirrorIntervalsServiceMock = SalesItemMirrorIntervalsServiceMock;
        ;
    })(Tests = Forecasting.Tests || (Forecasting.Tests = {}));
})(Forecasting || (Forecasting = {}));
