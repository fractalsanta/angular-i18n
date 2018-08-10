var Forecasting;
(function (Forecasting) {
    var Tests;
    (function (Tests) {
        "use strict";
        var DataMock = (function () {
            function DataMock($q, defaults) {
                this._helper = new PromiseHelper($q);
                this._data = defaults;
                this._defaults = defaults || {};
            }
            DataMock.prototype.SetData = function (key, value) {
                this._data[key] = value;
                return this;
            };
            DataMock.prototype.SetDataAll = function (value) {
                this._data = value || {};
                return this;
            };
            DataMock.prototype.SetDefault = function (key, value) {
                this._defaults[key] = value;
                return this;
            };
            DataMock.prototype.SetDefaultAll = function (value) {
                this._defaults = value || {};
                return this;
            };
            DataMock.prototype.GetData = function (key, params) {
                var nvp = [key, params].join(), first = params ? (this._data[nvp] != undefined ? this._data[nvp] : this._defaults[nvp]) : undefined, second = this._data[key] != undefined ? this._data[key] : this._defaults[key];
                return first || second;
            };
            DataMock.prototype.GetPromise = function (data) {
                return data ? this._helper.CreatePromise(data) : undefined;
            };
            DataMock.prototype.GetDataPromise = function (key, params) {
                return this.GetPromise(this.GetData(key));
            };
            DataMock.prototype.GetHttpPromise = function (data) {
                return data ? this._helper.CreateHttpPromise(data) : undefined;
            };
            DataMock.prototype.GetDataHttpPromise = function (key, params) {
                return this.GetHttpPromise(this.GetData(key));
            };
            return DataMock;
        }());
        Tests.DataMock = DataMock;
        ;
    })(Tests = Forecasting.Tests || (Forecasting.Tests = {}));
})(Forecasting || (Forecasting = {}));
