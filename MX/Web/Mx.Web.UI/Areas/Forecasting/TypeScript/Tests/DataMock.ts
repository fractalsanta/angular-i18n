module Forecasting.Tests {
    "use strict";

    export class DataMock {
        private _helper: PromiseHelper;
        private _data: any;
        private _defaults: any;

        constructor($q: ng.IQService, defaults?: any) {
            this._helper = new PromiseHelper($q);
            this._data = defaults;
            this._defaults = defaults || {};
        }

        public SetData(key: string, value: any): DataMock {
            this._data[key] = value;
            return this;
        }

        public SetDataAll(value: any): DataMock {
            this._data = value || {};
            return this;
        }

        public SetDefault(key: string, value: any): DataMock {
            this._defaults[key] = value;
            return this;
        }

        public SetDefaultAll(value: any): DataMock {
            this._defaults = value || {};
            return this;
        }

        public GetData(key: string, params?: string): any {
            var nvp = [key, params].join(),
                first = params ? (this._data[nvp] != undefined ? this._data[nvp] : this._defaults[nvp]) : undefined,
                second = this._data[key] != undefined ? this._data[key] : this._defaults[key];

            return first || second;
        }

        public GetPromise(data: any): ng.IPromise<any> {
            return data ? this._helper.CreatePromise(data) : undefined;
        }

        public GetDataPromise(key: string, params?: string): ng.IPromise<any> {
            return this.GetPromise(this.GetData(key));
        }

        public GetHttpPromise(data: any): ng.IHttpPromise<any> {
            return data ? this._helper.CreateHttpPromise(data) : undefined;
        }

        public GetDataHttpPromise(key: string, params?: string): ng.IHttpPromise<any> {
            return this.GetHttpPromise(this.GetData(key));
        }
    };
} 