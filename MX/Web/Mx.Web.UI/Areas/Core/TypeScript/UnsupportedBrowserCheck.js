var Core;
(function (Core) {
    (function (UnsupportedBrowser) {
        var minBrowserVersions = {
            Chrome: 25,
            MSIE: 9,
            Safari: 5,
            Firefox: 20,
            AndroidBrowser: 4
        };
        UnsupportedBrowser.PageName = "/Areas/Core/Templates/UnsupportedBrowser.html";

        function CheckIsSupported() {
            var supported = false, browserDetails = _getBrowserDetails();
            var version = _getVersion(browserDetails[1]);
            switch (browserDetails[0]) {
                case "MSIE":
                case "rv:":
                    supported = version >= minBrowserVersions.MSIE;
                    break;

                case "Chrome":
                    supported = version >= minBrowserVersions.Chrome;
                    break;

                case "Safari":
                    supported = version >= minBrowserVersions.Safari;
                    break;

                case "Firefox":
                    supported = version >= minBrowserVersions.Firefox;
                    break;

                case "AndroidBrowser":
                    supported = version >= minBrowserVersions.AndroidBrowser;
            }
            return supported;
        }
        UnsupportedBrowser.CheckIsSupported = CheckIsSupported;

        function _getBrowserDetails() {
            var userAgent = navigator.userAgent;
            if (-1 != userAgent.indexOf("OPR") || -1 != userAgent.indexOf("Opera"))
                alert("opera??"), browserDetails = ["Opera", "???"];
            else if (-1 != userAgent.indexOf("Android")) {
                browserDetails = ["AndroidBrowser", "???"];
                var temp = userAgent.match(/version\/(.)\./i);
                browserDetails && null != temp && (browserDetails[1] = temp[1]), temp = userAgent.match(/chrome\/(.+?)\./i), null != temp && (browserDetails[0] = "Chrome", browserDetails[1] = temp[1]);
            } else {
                var temp2, browserDetails = userAgent.match(/(opera|chrome|safari|firefox|msie|rv:)\/?\s*(\.?\d+(\.\d+)*)/i);
                browserDetails && null != (temp2 = userAgent.match(/version\/([\.\d]+)/i)) && (browserDetails[2] = temp2[1]), browserDetails = browserDetails ? [browserDetails[1], browserDetails[2]] : [navigator.appName, navigator.appVersion, "-?"];
            }
            return browserDetails;
        }

        function _getVersion(versionString) {
            var versionInfo = ("" + versionString).split(".");
            return versionInfo.length > 0 ? parseInt(versionInfo[0]) : 0;
        }
    })(Core.UnsupportedBrowser || (Core.UnsupportedBrowser = {}));
    var UnsupportedBrowser = Core.UnsupportedBrowser;
})(Core || (Core = {}));

Core.UnsupportedBrowser.CheckIsSupported() || window.location.assign(Core.UnsupportedBrowser.PageName);
//# sourceMappingURL=UnsupportedBrowserCheck.js.map
