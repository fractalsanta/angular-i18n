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
            "GetAll": [{ "Id": 383, "ItemCode": "90002", "Description": "Waffle Fries, Large" }, { "Id": 384, "ItemCode": "90003", "Description": "Waffle Fries, Medium" }, { "Id": 385, "ItemCode": "90004", "Description": "Waffle Fries, Small" }, { "Id": 1316, "ItemCode": "4424", "Description": "WP - Waffle Fries, Small" }, { "Id": 1319, "ItemCode": "4422", "Description": "WP - Waffle Fries, Large" }, { "Id": 1324, "ItemCode": "4423", "Description": "WP - Waffle Fries, Medium" }, { "Id": 1951, "ItemCode": "DH275", "Description": "TG Chili Cheese Waffle Fries" }, { "Id": 2013, "ItemCode": "DH339", "Description": "TG Side - Home Fries" }, { "Id": 2160, "ItemCode": "230001", "Description": "Test MLM Med Fries & Sm Milkshake" }]
        };
        var SalesItemServiceMock = (function (_super) {
            __extends(SalesItemServiceMock, _super);
            function SalesItemServiceMock($q, defaults) {
                var _this = this;
                _super.call(this, $q, defaults || _myDefaults);
                this.$q = $q;
                this.Object = {
                    GetSalesItemsForForecast: function (entityId, forecastId) {
                        return _this.GetDataHttpPromise("GetSalesItemsForForecast");
                    },
                    Get: function (entityId, forecastId, id) {
                        return _this.GetDataHttpPromise("Get");
                    },
                    GetAll: function (searchText) {
                        return _this.GetDataHttpPromise("GetAll");
                    }
                };
            }
            return SalesItemServiceMock;
        }(Tests.DataMock));
        Tests.SalesItemServiceMock = SalesItemServiceMock;
        ;
    })(Tests = Forecasting.Tests || (Forecasting.Tests = {}));
})(Forecasting || (Forecasting = {}));
