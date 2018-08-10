if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) { return typeof args[number] !== "undefined"
            ? args[number]
            : match.ToString(); });
    };
}
if (!window.isIOSDevice) {
    window.isIOSDevice = function () {
        var userAgent = window.navigator.userAgent;
        return !!(userAgent.match(/iPad/i) || userAgent.match(/iPhone/i));
    };
}
if (!window.hasInUserAgent) {
    window.hasInUserAgent = function (text) {
        var userAgent = window.navigator.userAgent;
        return !!(userAgent.match(text) || userAgent.match(text));
    };
}
