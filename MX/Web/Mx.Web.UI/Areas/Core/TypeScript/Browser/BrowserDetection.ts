module Core.BrowserDetection {
    "use strict";

    var browserDetailsCache: IBrowserDetails;

    export interface IBrowserDetails {
        Browser: string;
        Version: string;
        VersionNumber?: number;
    }

    export class Browsers {
        static Chrome: string = "Chrome";
        static MSIE: string = "MSIE";
        static Trident: string = "Trident";
        static Opera: string = "Opera";
        static Safari: string = "Safari";
        static Firefox: string = "Firefox";
        static AndroidBrowser: string = "AndroidBrowser";
        static iOS: string = "iOS";
    }

    export function GetBrowserDetails(): IBrowserDetails {
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

    export function BrowserIs(browser: Browsers): boolean {
        var details = GetBrowserDetails();

        return details.Browser === browser;
    }

    export function VersionIs(version: string): boolean {
        var details = GetBrowserDetails();

        return details.Version === version;
    }

    export function VersionNumberIs(versionNumber: number): boolean {
        var details = GetBrowserDetails();

        return details.VersionNumber === versionNumber;
    }

    function getBrowserDetails(): IBrowserDetails {
        // http://stackoverflow.com/questions/8348139/detect-ios-version-less-than-5-with-javascript
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

    function getTridentDetails(userAgent: string): IBrowserDetails {
        var match = userAgent.match(/trident\/(.+?)\./i);
        return { Browser: Browsers.Trident, Version: match ? match[1] : "???" };
    }

    function getAndroidDetails(userAgent: string): IBrowserDetails {
        var chromeVersion = userAgent.match(/chrome\/(.+?)\./i);
        if (chromeVersion != null) {
            return { Browser: Browsers.Chrome, Version: chromeVersion[1] };
        }
        var androidVersion = userAgent.match(/version\/(.)\./i);
        return { Browser: Browsers.AndroidBrowser, Version: androidVersion ? androidVersion[1] : "???" };
    }

    function getVersionNumber(versionString: string): number {
        var versionInfo = ("" + versionString).split(".");
        return versionInfo.length > 0 ? parseInt(versionInfo[0]) : 0;
    }
} 