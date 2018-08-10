var PromiseHelper = (function () {
    function PromiseHelper($q) {
        this.$q = $q;
    }
    PromiseHelper.prototype.CreatePromise = function (value) {
        return this.$q.when(value);
    };
    PromiseHelper.prototype.CreateHttpPromise = function (value) {
        var model = { data: value, status: 200 };
        var promise = this.$q.when(model);
        promise.success = function (callback) {
            promise.then(function (response) {
                callback(response.data, response.status, response.headers, response.config);
            });
            return promise;
        };
        promise.error = function (callback) {
            promise.then(null, function (response) {
                callback(response.data, response.status, response.headers, response.config);
            });
            return promise;
        };
        return promise;
    };
    return PromiseHelper;
}());
var ConstantsMock = (function () {
    function ConstantsMock() {
        this.Object = {
            InternalDateFormat: "YYYY-MM-DD",
            InternalDateTimeFormat: "YYYY-MM-DDTHH:mm:ss",
            NumericalInputBoxPattern: ""
        };
    }
    return ConstantsMock;
}());
;
