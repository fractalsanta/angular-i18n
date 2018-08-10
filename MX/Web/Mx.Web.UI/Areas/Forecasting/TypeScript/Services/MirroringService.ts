module Forecasting.Services {
    "use strict";

    export interface IMirroringService {
        CalculateMaxSourceStart(interval: IMirrorInterval): Date;
        CalculateDates(interval: IMirrorInterval): Date;
        IsAllDay(item: IMirrorInterval): boolean;
        Cast(interval: IMirrorInterval): IMirrorInterval;
        CalculateAdjustment(percentage: number): number;
        GetSalesItemMirrorIntervals(startDate: Date, endDate: Date): ng.IHttpPromise<Forecasting.Api.Models.ISalesItemMirrorInterval[]>;
        GetForecastZones(): ng.IHttpPromise<Api.Models.IZone[]>;
        GetSalesItems(searchText: string): ng.IHttpPromise<Api.Models.ISalesItem[]>;
        SaveSalesItem(interval: Api.Models.ISalesItemMirrorInterval): ng.IHttpPromise<{}>;
        Delete(interval: Api.Models.ISalesItemMirrorInterval): ng.IHttpPromise<{}>;
        GetStoreMirrorIntervals(entityId: number, group: any): ng.IHttpPromise<Forecasting.Api.Models.IStoreMirrorIntervalGroup[]>;
        SaveStoreMirror(interval: Api.Models.IStoreMirrorIntervalGroup): ng.IHttpPromise<{}>;
        DeleteStoreMirror(entityId: number, userName: string, groupId: any, resetManagerForecasts: boolean): ng.IHttpPromise<{}>;
    }

    export class MirroringService implements IMirroringService {
        constructor(
            private $q: ng.IQService,
            private $salesItemMirrorIntervalsService: Api.ISalesItemMirrorIntervalsService,
            private $forecastZoneService: Api.IForecastZoneService,
            private $salesItemsService: Api.ISalesItemService,
            private $storeMirrorIntervalsService: Api.IStoreMirrorIntervalsService,
            private constants: Core.IConstants
            ) { }

        public CalculateMaxSourceStart(interval: IMirrorInterval): Date {
            var max: Date = moment().subtract({ days: 1 }).toDate(),
                targetDateEnd: Moment,
                targetDateStart: Moment,
                days: number;

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
        }

        public CalculateDates(interval: IMirrorInterval): Date {
            var sourceDateStart: Moment,
                targetDateEnd: Moment,
                targetDateStart: Moment,
                days: number;

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
        }

        public IsAllDay(item: IMirrorInterval): boolean {
            var targetStartDate = moment(item.TargetDateStart);
            var targetEndDate = moment(item.TargetDateEnd);
            var isAllDay = targetEndDate.diff(targetStartDate, "hours") >= 24;

            return isAllDay;
        }

        public Cast(item: IMirrorInterval): IMirrorInterval {
            var sourceDateStart: Moment = moment(item.SourceDateStart).startOf("day"),
                targetDateStart: Moment = moment(item.TargetDateStart).startOf("day"),
                targetDateEnd: Moment,
                days: number;

            if (this.IsAllDay(item)) {
                targetDateEnd = moment(item.TargetDateEnd).subtract({ days: 1 }).endOf("day");
            } else {
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
        }

        public CalculateAdjustment(percentage: number): number {
            var adjustment = (Math.round((1 + percentage / 100) * 100) / 100);
            return adjustment;
        }

        public GetSalesItemMirrorIntervals(startDate: Date, endDate: Date): ng.IHttpPromise<Api.Models.ISalesItemMirrorInterval[]> {
            return this.$salesItemMirrorIntervalsService.GetSalesItemMirrorIntervals(
                    startDate.toDateString(), endDate.toDateString());
        }

        public GetForecastZones(): ng.IHttpPromise<Api.Models.IZone[]> {
            return this.$forecastZoneService.GetForecastZones();
        }

        public GetSalesItems(searchText: string): ng.IHttpPromise<Api.Models.ISalesItem[]> {
            return this.$salesItemsService.GetAll(searchText);
        }

        public SaveSalesItem(interval: Api.Models.ISalesItemMirrorInterval): ng.IHttpPromise<{}> {
            return this.$salesItemMirrorIntervalsService.PostSalesItemMirrorIntervals(interval);
        }

        public Delete(interval: Api.Models.ISalesItemMirrorInterval): ng.IHttpPromise<{}> {
            return this.$salesItemMirrorIntervalsService.DeleteSalesItemMirrorIntervals(interval.Id, interval.OverwriteManager);
        }

        public GetStoreMirrorIntervals(entityId: number, group: any): ng.IHttpPromise<Forecasting.Api.Models.IStoreMirrorIntervalGroup[]> {
            return this.$storeMirrorIntervalsService.GetStoreMirrorIntervals(entityId, group, "All");
        }

        public SaveStoreMirror(interval: Api.Models.IStoreMirrorIntervalGroup): ng.IHttpPromise<{}> {
            return this.$storeMirrorIntervalsService.PostStoreMirrorIntervals(interval);
        }

        public DeleteStoreMirror(entityId: number, userName: string, groupId: any, resetManagerForecasts: boolean): ng.IHttpPromise<{}> {
            return this.$storeMirrorIntervalsService.DeleteStoreMirrorInterval(entityId, userName, groupId, resetManagerForecasts);
        }
    }

    export var $mirroringService: Core.NG.INamedService<IMirroringService> = Core.NG.ForecastingModule.RegisterService("MirroringService", MirroringService,
        Core.NG.$q,
        Api.$salesItemMirrorIntervalsService,
        Api.$forecastZoneService,
        Api.$salesItemService,
        Api.$storeMirrorIntervalsService,
        Core.Constants
        );
}