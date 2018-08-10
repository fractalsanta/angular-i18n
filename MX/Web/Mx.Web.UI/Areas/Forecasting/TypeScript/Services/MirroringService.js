var Forecasting;
(function (Forecasting) {
    var Services;
    (function (Services) {
        "use strict";
        var MirroringService = (function () {
            function MirroringService($q, $salesItemMirrorIntervalsService, $forecastZoneService, $salesItemsService, $storeMirrorIntervalsService, constants) {
                this.$q = $q;
                this.$salesItemMirrorIntervalsService = $salesItemMirrorIntervalsService;
                this.$forecastZoneService = $forecastZoneService;
                this.$salesItemsService = $salesItemsService;
                this.$storeMirrorIntervalsService = $storeMirrorIntervalsService;
                this.constants = constants;
            }
            MirroringService.prototype.CalculateMaxSourceStart = function (interval) {
                var max = moment().subtract({ days: 1 }).toDate(), targetDateEnd, targetDateStart, days;
                if (interval.TargetDateStartDate) {
                    targetDateEnd = moment(interval.TargetDateEndDate).endOf("day");
                    targetDateStart = moment(interval.TargetDateStartDate).startOf("day");
                    days = targetDateEnd.diff(targetDateStart, "days");
                    if (days > 14) {
                        days = 14;
                    }
                    max = targetDateStart.subtract({ days: days + 1 }).toDate();
                }
                return max;
            };
            MirroringService.prototype.CalculateDates = function (interval) {
                var sourceDateStart, targetDateEnd, targetDateStart, days;
                if (interval.TargetDateStartDate) {
                    targetDateEnd = moment(interval.TargetDateEndDate).endOf("day");
                    targetDateStart = moment(interval.TargetDateStartDate).startOf("day");
                    days = targetDateEnd.diff(targetDateStart, "days");
                    interval.TargetDateStart = targetDateStart.format(this.constants.InternalDateFormat);
                    interval.TargetDateEnd = targetDateEnd.add({ days: 1 }).format(this.constants.InternalDateFormat);
                }
                if (interval.SourceDateStartDate && interval.TargetDateStartDate) {
                    sourceDateStart = moment(interval.SourceDateStartDate).startOf("day");
                    interval.SourceDateStart = sourceDateStart.format(this.constants.InternalDateFormat);
                    interval.SourceDateEndDate = sourceDateStart.clone().add({ days: days }).toDate();
                }
                return this.CalculateMaxSourceStart(interval);
            };
            MirroringService.prototype.IsAllDay = function (item) {
                var targetStartDate = moment(item.TargetDateStart);
                var targetEndDate = moment(item.TargetDateEnd);
                var isAllDay = targetEndDate.diff(targetStartDate, "hours") >= 24;
                return isAllDay;
            };
            MirroringService.prototype.Cast = function (item) {
                var sourceDateStart = moment(item.SourceDateStart).startOf("day"), targetDateStart = moment(item.TargetDateStart).startOf("day"), targetDateEnd, days;
                if (this.IsAllDay(item)) {
                    targetDateEnd = moment(item.TargetDateEnd).subtract({ days: 1 }).endOf("day");
                }
                else {
                    targetDateEnd = moment(item.TargetDateEnd).endOf("day");
                }
                days = targetDateEnd.diff(targetDateStart, "days");
                item.SourceDateStartDate = sourceDateStart.toDate();
                item.TargetDateEndDate = targetDateEnd.toDate();
                item.TargetDateStartDate = targetDateStart.toDate();
                item.SourceDateEndDate = sourceDateStart.clone().add({ days: days }).toDate();
                item.Adjustment = item.Adjustment || 0;
                item.AdjustmentPercent = "" + Math.round((item.Adjustment - 1) * 100);
                return item;
            };
            MirroringService.prototype.CalculateAdjustment = function (percentage) {
                var adjustment = (Math.round((1 + percentage / 100) * 100) / 100);
                return adjustment;
            };
            MirroringService.prototype.GetSalesItemMirrorIntervals = function (startDate, endDate) {
                return this.$salesItemMirrorIntervalsService.GetSalesItemMirrorIntervals(startDate.toDateString(), endDate.toDateString());
            };
            MirroringService.prototype.GetForecastZones = function () {
                return this.$forecastZoneService.GetForecastZones();
            };
            MirroringService.prototype.GetSalesItems = function (searchText) {
                return this.$salesItemsService.GetAll(searchText);
            };
            MirroringService.prototype.SaveSalesItem = function (interval) {
                return this.$salesItemMirrorIntervalsService.PostSalesItemMirrorIntervals(interval);
            };
            MirroringService.prototype.Delete = function (interval) {
                return this.$salesItemMirrorIntervalsService.DeleteSalesItemMirrorIntervals(interval.Id, interval.OverwriteManager);
            };
            MirroringService.prototype.GetStoreMirrorIntervals = function (entityId, group) {
                return this.$storeMirrorIntervalsService.GetStoreMirrorIntervals(entityId, group, "All");
            };
            MirroringService.prototype.SaveStoreMirror = function (interval) {
                return this.$storeMirrorIntervalsService.PostStoreMirrorIntervals(interval);
            };
            MirroringService.prototype.DeleteStoreMirror = function (entityId, userName, groupId, resetManagerForecasts) {
                return this.$storeMirrorIntervalsService.DeleteStoreMirrorInterval(entityId, userName, groupId, resetManagerForecasts);
            };
            return MirroringService;
        }());
        Services.MirroringService = MirroringService;
        Services.$mirroringService = Core.NG.ForecastingModule.RegisterService("MirroringService", MirroringService, Core.NG.$q, Forecasting.Api.$salesItemMirrorIntervalsService, Forecasting.Api.$forecastZoneService, Forecasting.Api.$salesItemService, Forecasting.Api.$storeMirrorIntervalsService, Core.Constants);
    })(Services = Forecasting.Services || (Forecasting.Services = {}));
})(Forecasting || (Forecasting = {}));
