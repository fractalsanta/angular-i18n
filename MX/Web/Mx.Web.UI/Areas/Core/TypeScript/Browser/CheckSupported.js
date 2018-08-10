var Core;
(function (Core) {
    var UnsupportedBrowser;
    (function (UnsupportedBrowser) {
        "use strict";
        var minBrowserVersions = {
            "Chrome": 25,
            "MSIE": 9,
            "Trident": 5,
            "Safari": 5,
            "Firefox": 20,
            "AndroidBrowser": 4,
            "iOS": 6
        };
        UnsupportedBrowser.PageName = "/Areas/Core/Templates/UnsupportedBrowser.html";
        function CheckIsSupported() {
            var details = Core.BrowserDetection.GetBrowserDetails();
            var match = minBrowserVersions[details.Browser];
            return match && match <= details.VersionNumber;
        }
        UnsupportedBrowser.CheckIsSupported = CheckIsSupported;
    })(UnsupportedBrowser = Core.UnsupportedBrowser || (Core.UnsupportedBrowser = {}));
})(Core || (Core = {}));
Core.UnsupportedBrowser.CheckIsSupported() || window.location.assign(Core.UnsupportedBrowser.PageName);
