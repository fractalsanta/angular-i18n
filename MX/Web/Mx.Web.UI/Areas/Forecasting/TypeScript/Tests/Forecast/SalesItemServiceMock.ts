/// <reference path="../DataMock.ts" />

module Forecasting.Tests {
    "use strict";

    var _myDefaults: any = {
        "GetAll": 
            [{ "Id": 383, "ItemCode": "90002", "Description": "Waffle Fries, Large" }, { "Id": 384, "ItemCode": "90003", "Description": "Waffle Fries, Medium" }, { "Id": 385, "ItemCode": "90004", "Description": "Waffle Fries, Small" }, { "Id": 1316, "ItemCode": "4424", "Description": "WP - Waffle Fries, Small" }, { "Id": 1319, "ItemCode": "4422", "Description": "WP - Waffle Fries, Large" }, { "Id": 1324, "ItemCode": "4423", "Description": "WP - Waffle Fries, Medium" }, { "Id": 1951, "ItemCode": "DH275", "Description": "TG Chili Cheese Waffle Fries" }, { "Id": 2013, "ItemCode": "DH339", "Description": "TG Side - Home Fries" }, { "Id": 2160, "ItemCode": "230001", "Description": "Test MLM Med Fries & Sm Milkshake" }]
    };

    export class SalesItemServiceMock extends DataMock implements Core.Tests.IMock<Api.ISalesItemService> {
        constructor(public $q: ng.IQService, defaults?: any) {
            super($q, defaults || _myDefaults);
        }

        public Object: Api.ISalesItemService = {
            GetSalesItemsForForecast: (entityId: number, forecastId: number): ng.IHttpPromise<Forecasting.Api.Models.ISalesItem[]> => {
                return this.GetDataHttpPromise("GetSalesItemsForForecast");
            },

            Get: (entityId: number, forecastId: number, id: number): ng.IHttpPromise<string> => {
                return this.GetDataHttpPromise("Get");
            },

            GetAll: (searchText: string): ng.IHttpPromise<Forecasting.Api.Models.ISalesItem[]> => {
                return this.GetDataHttpPromise("GetAll");
            }
        };
    };
}  