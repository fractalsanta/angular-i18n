/// <reference path="../DataMock.ts" />
/// <reference path="../../Interfaces/IMirrorings.d.ts" />
/// <reference path="../../Services/MirroringService.ts" />
/// <reference path="../Forecast/ForecastZoneServiceMock.ts" />
/// <reference path="./SalesItemMirrorIntervalsServiceMock.ts" />
/// <reference path="../Forecast/SalesItemServiceMock.ts" />
/// <reference path="./StoreMirrorIntervalServiceMock.ts" />

module Forecasting.Tests {
    "use strict";

    var _myDefaults: any = {
    };

    export class MirroringServiceMock extends DataMock implements Core.Tests.IMock<Services.IMirroringService> {
        public mirroringService: Services.IMirroringService;
        public salesItemMirrorIntervalsServiceMock: Forecasting.Tests.SalesItemMirrorIntervalsServiceMock;
        public forecastZoneServiceMock: Forecasting.Tests.ForecastZoneServiceMock;
        public salesItemServiceMock: Forecasting.Tests.SalesItemServiceMock;
        public storeMirrorIntervalsServiceMock: StoreMirrorIntervalsServiceMock;
        public constantsMock: ConstantsMock;

        constructor(public $q: ng.IQService, defaults?: any) {
            super($q, defaults || _myDefaults);

            this.salesItemMirrorIntervalsServiceMock = new SalesItemMirrorIntervalsServiceMock($q);
            this.forecastZoneServiceMock = new ForecastZoneServiceMock($q);
            this.salesItemServiceMock = new SalesItemServiceMock($q);
            this.storeMirrorIntervalsServiceMock = new StoreMirrorIntervalsServiceMock($q);
            this.constantsMock = new ConstantsMock();
            this.mirroringService = new Services.MirroringService(
                $q,
                this.salesItemMirrorIntervalsServiceMock.Object,
                this.forecastZoneServiceMock.Object,
                this.salesItemServiceMock.Object,
                this.storeMirrorIntervalsServiceMock.Object,
                this.constantsMock.Object);
        }
       
        public Object: Services.IMirroringService = {
            CalculateMaxSourceStart: (interval: IMirrorInterval): Date => {
                return this.mirroringService.CalculateMaxSourceStart(interval);
            },

            CalculateDates: (interval: IMirrorInterval): Date => {
                return this.mirroringService.CalculateDates(interval);
            },

            IsAllDay: (interval: IMirrorInterval): boolean => {
                return this.mirroringService.IsAllDay(interval);
            },

            Cast: (interval: IMirrorInterval): IMirrorInterval => {
                return this.mirroringService.Cast(interval);
            },

            CalculateAdjustment: (percentage: number): number => {
                return this.mirroringService.CalculateAdjustment(percentage);
            },

            GetSalesItemMirrorIntervals: (startDate: Date, endDate: Date): ng.IHttpPromise<Api.Models.ISalesItemMirrorInterval[]> => {
                return this.GetDataHttpPromise("GetSalesItemMirrorIntervals") || this.mirroringService.GetSalesItemMirrorIntervals(startDate, endDate);
            },

            GetForecastZones: (): ng.IHttpPromise<Api.Models.IZone[]> => {
                return this.GetDataHttpPromise("GetForecastZones") || this.mirroringService.GetForecastZones();
            },

            GetSalesItems: (searchText: string): ng.IHttpPromise<Api.Models.ISalesItem[]> => {
                return this.GetDataHttpPromise("GetSalesItems") || this.mirroringService.GetSalesItems(searchText);
            },

            SaveSalesItem: (interval: Api.Models.ISalesItemMirrorInterval): ng.IHttpPromise<{}> => {
                return this.GetDataHttpPromise("Save") || this.mirroringService.SaveSalesItem(interval);
            },

            Delete: (interval: Api.Models.ISalesItemMirrorInterval): ng.IHttpPromise<{}> => {
                return this.GetDataHttpPromise("Delete") || this.mirroringService.Delete(interval);
            },

            GetStoreMirrorIntervals: (entityId: number, group: any): ng.IHttpPromise<Forecasting.Api.Models.IStoreMirrorIntervalGroup[]> => {
                return this.GetDataHttpPromise("GetStoreMirrorIntervals") || this.mirroringService.GetStoreMirrorIntervals(entityId, group);
            },

            SaveStoreMirror: (interval: Api.Models.IStoreMirrorIntervalGroup): ng.IHttpPromise<{}> => {
                return this.GetDataHttpPromise("SaveStoreMirror") || this.mirroringService.SaveStoreMirror(interval);
            },

            DeleteStoreMirror: (entityId: number, userName: string, groupId: any, resetManagerForecasts: boolean): ng.IHttpPromise<{}> => {
                return this.GetDataHttpPromise("DeleteStoreMirror") || this.mirroringService.DeleteStoreMirror(entityId, userName, groupId, resetManagerForecasts);
            }
        };
    };
}