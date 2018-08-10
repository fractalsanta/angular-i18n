var Core;
(function (Core) {
    var BrowserDetection;
    (function (BrowserDetection) {
        "use strict";
        var browserDetailsCache;
        var Browsers = (function () {
            function Browsers() {
            }
            Browsers.Chrome = "Chrome";
            Browsers.MSIE = "MSIE";
            Browsers.Trident = "Trident";
            Browsers.Opera = "Opera";
            Browsers.Safari = "Safari";
            Browsers.Firefox = "Firefox";
            Browsers.AndroidBrowser = "AndroidBrowser";
            Browsers.iOS = "iOS";
            return Browsers;
        }());
        BrowserDetection.Browsers = Browsers;
        function GetBrowserDetails() {
            if (!browserDetailsCache) {
                browserDetailsCache = getBrowserDetails();
                browserDetailsCache.VersionNumber = getVersionNumber(browserDetailsCache.Version);
            }
            return {
                Browser: browserDetailsCache.Browser,
                Version: browserDetailsCache.Version,
                VersionNumber: browserDetailsCache.VersionNumber
            };
        }
        BrowserDetection.GetBrowserDetails = GetBrowserDetails;
        function BrowserIs(browser) {
            var details = GetBrowserDetails();
            return details.Browser === browser;
        }
        BrowserDetection.BrowserIs = BrowserIs;
        function VersionIs(version) {
            var details = GetBrowserDetails();
            return details.Version === version;
        }
        BrowserDetection.VersionIs = VersionIs;
        function VersionNumberIs(versionNumber) {
            var details = GetBrowserDetails();
            return details.VersionNumber === versionNumber;
        }
        BrowserDetection.VersionNumberIs = VersionNumberIs;
        function getBrowserDetails() {
            if (/iP(hone|od|ad)/.test(navigator.platform)) {
                var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
                return { Browser: Browsers.iOS, Version: parseInt(v[1], 10) + "." + parseInt(v[2], 10) };
            }
            var userAgent = navigator.userAgent;
            if (userAgent.indexOf("OPR") != -1 || userAgent.indexOf("Opera") != -1) {
                return { Browser: Browsers.Opera, Version: "???" };
            }
            if (userAgent.indexOf("Android") != -1) {
                return getAndroidDetails(userAgent);
            }
            if (userAgent.indexOf("Trident") != -1) {
                return getTridentDetails(userAgent);
            }
            var browserMatch = userAgent.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
            if (!browserMatch) {
                return { Browser: navigator.appName, Version: navigator.appVersion };
            }
            var browser = browserMatch[1];
            var version = browserMatch[2];
            if (!version) {
                var version2 = userAgent.match(/version\/([\.\d]+)/i);
                version = version2 ? version2[1] : "???";
            }
            return { Browser: browser, Version: version };
        }
        function getTridentDetails(userAgent) {
            var match = userAgent.match(/trident\/(.+?)\./i);
            return { Browser: Browsers.Trident, Version: match ? match[1] : "???" };
        }
        function getAndroidDetails(userAgent) {
            var chromeVersion = userAgent.match(/chrome\/(.+?)\./i);
            if (chromeVersion != null) {
                return { Browser: Browsers.Chrome, Version: chromeVersion[1] };
            }
            var androidVersion = userAgent.match(/version\/(.)\./i);
            return { Browser: Browsers.AndroidBrowser, Version: androidVersion ? androidVersion[1] : "???" };
        }
        function getVersionNumber(versionString) {
            var versionInfo = ("" + versionString).split(".");
            return versionInfo.length > 0 ? parseInt(versionInfo[0]) : 0;
        }
    })(BrowserDetection = Core.BrowserDetection || (Core.BrowserDetection = {}));
})(Core || (Core = {}));
