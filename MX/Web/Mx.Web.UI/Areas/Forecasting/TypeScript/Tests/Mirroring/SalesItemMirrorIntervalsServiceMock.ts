/// <reference path="../DataMock.ts" />

module Forecasting.Tests {
    "use strict";

    var _myDefaults: any = {
        "GetSalesItemMirrorIntervals": [
            <Forecasting.Api.Models.ISalesItemMirrorInterval>{ SourceDateStart: "4/18/15", TargetDateStart: "05/16/15", TargetDateEnd: "05/30/15",
                SourceSalesItem: <Api.Models.ISalesItem> { Id: 1, ItemCode: "11025", Description: "Milkshake, Kit-Kat" },
                TargetSalesItem: <Api.Models.ISalesItem> { Id: 2, ItemCode: "11025", Description: "Milkshake, Kit-Kat" },
                Zone: <Api.Models.IZone> { Id: 3, Name: "Test Market - Alpharetta", EntityCount: 0 },
                Id: 4,
                Adjustment: 2
            },
            <Forecasting.Api.Models.ISalesItemMirrorInterval> { SourceDateStart: "6/19/15", TargetDateStart: "07/17/15", TargetDateEnd: "07/31/15",
                SourceSalesItem: <Api.Models.ISalesItem> { Id: 6, ItemCode: "Code", Description: "Desc" },
                TargetSalesItem: <Api.Models.ISalesItem> { Id: 7, ItemCode: "Code", Description: "Desc" },
                Zone: <Api.Models.IZone> { Id: 8, Name: "Zone", EntityCount: 3 },
                Id: 9,
                Adjustment: 1
            },
            <Forecasting.Api.Models.ISalesItemMirrorInterval> { SourceDateStart: "9/17/15", TargetDateStart: "10/15/15", TargetDateEnd: "10/29/15",
                SourceSalesItem: <Api.Models.ISalesItem> { Id: 11, ItemCode: "12903", Description: "Lemonade, Frosted" },
                TargetSalesItem: <Api.Models.ISalesItem> { Id: 12, ItemCode: "12903", Description: "Lemonade, Frosted" },
                Zone: <Api.Models.IZone> { Id: 13, Name: "Zone All Restaurants", EntityCount: 111 },
                Id: 14,
                Adjustment: 0
            }
        ]
    };

    export class SalesItemMirrorIntervalsServiceMock extends DataMock implements Core.Tests.IMock<Api.ISalesItemMirrorIntervalsService> {
        constructor(public $q: ng.IQService, defaults?: any) {
            super($q, defaults || _myDefaults);
        }

        public Object: Api.ISalesItemMirrorIntervalsService = {
            GetSalesItemMirrorInterval: (id: number): ng.IHttpPromise<Forecasting.Api.Models.ISalesItemMirrorInterval> => {
                return this.GetDataHttpPromise("GetSalesItemMirrorInterval");
            },

            GetSalesItemMirrorIntervals: (startDate: string, endDate: string): ng.IHttpPromise<Forecasting.Api.Models.ISalesItemMirrorInterval[]> => {
                return this.GetDataHttpPromise("GetSalesItemMirrorIntervals");
            },

            PostSalesItemMirrorIntervals: (/*[FromBody]*/ salesItemMirrorInterval: Forecasting.Api.Models.ISalesItemMirrorInterval): ng.IHttpPromise<{}> => {
                return this.GetDataHttpPromise("PostSalesItemMirrorIntervals");
            },
            
            DeleteSalesItemMirrorIntervals: (intervalId: number, resetManagerForecast: boolean): ng.IHttpPromise<{}> => {
                return this.GetDataHttpPromise("DeleteSalesItemMirrorIntervals");
            }
        };
    };
}  