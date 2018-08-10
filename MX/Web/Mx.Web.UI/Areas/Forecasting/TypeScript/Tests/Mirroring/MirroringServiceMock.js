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
        var MirroringServiceMock = (function (_super) {
            __extends(MirroringServiceMock, _super);
            function MirroringServiceMock($q, defaults) {
                var _this = this;
                _super.call(this, $q, defaults || _myDefaults);
                this.$q = $q;
                this.Object = {
                    CalculateMaxSourceStart: function (interval) {
                        return _this.mirroringService.CalculateMaxSourceStart(interval);
                    },
                    CalculateDates: function (interval) {
                        return _this.mirroringService.CalculateDates(interval);
                    },
                    IsAllDay: function (interval) {
                        return _this.mirroringService.IsAllDay(interval);
                    },
                    Cast: function (interval) {
                        return _this.mirroringService.Cast(interval);
                    },
                    CalculateAdjustment: function (percentage) {
                        return _this.mirroringService.CalculateAdjustment(percentage);
                    },
                    GetSalesItemMirrorIntervals: function (startDate, endDate) {
                        return _this.GetDataHttpPromise("GetSalesItemMirrorIntervals") || _this.mirroringService.GetSalesItemMirrorIntervals(startDate, endDate);
                    },
                    GetForecastZones: function () {
                        return _this.GetDataHttpPromise("GetForecastZones") || _this.mirroringService.GetForecastZones();
                    },
                    GetSalesItems: function (searchText) {
                        return _this.GetDataHttpPromise("GetSalesItems") || _this.mirroringService.GetSalesItems(searchText);
                    },
                    SaveSalesItem: function (interval) {
                        return _this.GetDataHttpPromise("Save") || _this.mirroringService.SaveSalesItem(interval);
                    },
                    Delete: function (interval) {
                        return _this.GetDataHttpPromise("Delete") || _this.mirroringService.Delete(interval);
                    },
                    GetStoreMirrorIntervals: function (entityId, group) {
                        return _this.GetDataHttpPromise("GetStoreMirrorIntervals") || _this.mirroringService.GetStoreMirrorIntervals(entityId, group);
                    },
                    SaveStoreMirror: function (interval) {
                        return _this.GetDataHttpPromise("SaveStoreMirror") || _this.mirroringService.SaveStoreMirror(interval);
                    },
                    DeleteStoreMirror: function (entityId, userName, groupId, resetManagerForecasts) {
                        return _this.GetDataHttpPromise("DeleteStoreMirror") || _this.mirroringService.DeleteStoreMirror(entityId, userName, groupId, resetManagerForecasts);
                    }
                };
                this.salesItemMirrorIntervalsServiceMock = new Tests.SalesItemMirrorIntervalsServiceMock($q);
                this.forecastZoneServiceMock = new Tests.ForecastZoneServiceMock($q);
                this.salesItemServiceMock = new Tests.SalesItemServiceMock($q);
                this.storeMirrorIntervalsServiceMock = new Tests.StoreMirrorIntervalsServiceMock($q);
                this.constantsMock = new ConstantsMock();
                this.mirroringService = new Forecasting.Services.MirroringService($q, this.salesItemMirrorIntervalsServiceMock.Object, this.forecastZoneServiceMock.Object, this.salesItemServiceMock.Object, this.storeMirrorIntervalsServiceMock.Object, this.constantsMock.Object);
            }
            return MirroringServiceMock;
        }(Tests.DataMock));
        Tests.MirroringServiceMock = MirroringServiceMock;
        ;
    })(Tests = Forecasting.Tests || (Forecasting.Tests = {}));
})(Forecasting || (Forecasting = {}));
