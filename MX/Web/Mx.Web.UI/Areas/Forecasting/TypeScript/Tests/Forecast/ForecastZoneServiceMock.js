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
            "GetForecastZones": [{ "Id": 68, "Name": "15 Minute Stores", "EntityCount": 0 }, { "Id": 22, "Name": "Active", "EntityCount": 12 }, { "Id": 4, "Name": "ARTS POSLog", "EntityCount": 12 }, { "Id": 7, "Name": "Basket Analysis Stores", "EntityCount": 5 }, { "Id": 16, "Name": "Cash Management", "EntityCount": 0 }, { "Id": 9, "Name": "Cash Management Export", "EntityCount": 12 }, { "Id": 12, "Name": "CFA", "EntityCount": 12 }, { "Id": 18, "Name": "Combined", "EntityCount": 12 }, { "Id": 3, "Name": "Default", "EntityCount": 16 }, { "Id": 8, "Name": "Default Cash Rules", "EntityCount": 15 }, { "Id": 29, "Name": "DLPS Deviations", "EntityCount": 5 }, { "Id": 19, "Name": "DLPS Stores", "EntityCount": 12 }, { "Id": 11, "Name": "Dwarf House", "EntityCount": 0 }, { "Id": 13, "Name": "Dwarf House", "EntityCount": 0 }, { "Id": 26, "Name": "ESB1100", "EntityCount": 0 }, { "Id": 38, "Name": "Forecast Group 1", "EntityCount": 0 }, { "Id": 47, "Name": "Forecast Group 10", "EntityCount": 2 }, { "Id": 48, "Name": "Forecast Group 11", "EntityCount": 0 }, { "Id": 49, "Name": "Forecast Group 12", "EntityCount": 2 }, { "Id": 52, "Name": "Forecast Group 13", "EntityCount": 2 }, { "Id": 53, "Name": "Forecast Group 14", "EntityCount": 1 }, { "Id": 54, "Name": "Forecast Group 15", "EntityCount": 0 }, { "Id": 55, "Name": "Forecast Group 16", "EntityCount": 0 }, { "Id": 56, "Name": "Forecast Group 17", "EntityCount": 0 }, { "Id": 57, "Name": "Forecast Group 18", "EntityCount": 0 }, { "Id": 58, "Name": "Forecast Group 19", "EntityCount": 0 }, { "Id": 39, "Name": "Forecast Group 2", "EntityCount": 0 }, { "Id": 59, "Name": "Forecast Group 20", "EntityCount": 2 }, { "Id": 60, "Name": "Forecast Group 21", "EntityCount": 1 }, { "Id": 61, "Name": "Forecast Group 22", "EntityCount": 0 }, { "Id": 62, "Name": "Forecast Group 23", "EntityCount": 0 }, { "Id": 63, "Name": "Forecast Group 24", "EntityCount": 0 }, { "Id": 64, "Name": "Forecast Group 25", "EntityCount": 0 }, { "Id": 65, "Name": "Forecast Group 26", "EntityCount": 0 }, { "Id": 50, "Name": "Forecast Group 27", "EntityCount": 0 }, { "Id": 51, "Name": "Forecast Group 28", "EntityCount": 0 }, { "Id": 40, "Name": "Forecast Group 3", "EntityCount": 1 }, { "Id": 41, "Name": "Forecast Group 4", "EntityCount": 0 }, { "Id": 42, "Name": "Forecast Group 5", "EntityCount": 0 }, { "Id": 43, "Name": "Forecast Group 6", "EntityCount": 0 }, { "Id": 44, "Name": "Forecast Group 7", "EntityCount": 0 }, { "Id": 45, "Name": "Forecast Group 8", "EntityCount": 0 }, { "Id": 46, "Name": "Forecast Group 9", "EntityCount": 1 }, { "Id": 31, "Name": "GCP1", "EntityCount": 1 }, { "Id": 33, "Name": "GCP2", "EntityCount": 0 }, { "Id": 34, "Name": "Generate Forecast", "EntityCount": 12 }, { "Id": 23, "Name": "Inactive", "EntityCount": 0 }, { "Id": 71, "Name": "MD Test Sales Item Mirror", "EntityCount": 1 }, { "Id": 70, "Name": "MJ Zone", "EntityCount": 1 }, { "Id": 36, "Name": "MMS Forecasting", "EntityCount": 0 }, { "Id": 67, "Name": "MxConnect Forecasting", "EntityCount": 0 }, { "Id": 21, "Name": "Non-Smart Safe", "EntityCount": 0 }, { "Id": 30, "Name": "Recipes", "EntityCount": 12 }, { "Id": 66, "Name": "Riverside DC temp", "EntityCount": 1 }, { "Id": 28, "Name": "Salad Market Test", "EntityCount": 0 }, { "Id": 72, "Name": "SD Test Zone", "EntityCount": 1 }, { "Id": 6, "Name": "ShiftValidation", "EntityCount": 12 }, { "Id": 20, "Name": "Smart Safe", "EntityCount": 12 }, { "Id": 10, "Name": "SmartSafe Stores", "EntityCount": 12 }, { "Id": 5, "Name": "SortingRules", "EntityCount": 3 }, { "Id": 15, "Name": "Suggested Ordering", "EntityCount": 2 }, { "Id": 17, "Name": "Supply Chain", "EntityCount": 0 }, { "Id": 69, "Name": "Test Group", "EntityCount": 1 }, { "Id": 14, "Name": "Usage Ordering", "EntityCount": 10 }, { "Id": 35, "Name": "Use Forecast", "EntityCount": 12 }]
        };
        var ForecastZoneServiceMock = (function (_super) {
            __extends(ForecastZoneServiceMock, _super);
            function ForecastZoneServiceMock($q, defaults) {
                var _this = this;
                _super.call(this, $q, defaults || _myDefaults);
                this.$q = $q;
                this.Object = {
                    GetForecastZones: function () {
                        return _this.GetDataHttpPromise("GetForecastZones");
                    }
                };
            }
            return ForecastZoneServiceMock;
        }(Tests.DataMock));
        Tests.ForecastZoneServiceMock = ForecastZoneServiceMock;
        ;
    })(Tests = Forecasting.Tests || (Forecasting.Tests = {}));
})(Forecasting || (Forecasting = {}));
