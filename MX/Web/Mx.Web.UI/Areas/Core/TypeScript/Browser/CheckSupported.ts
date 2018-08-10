// Detects browser version and redirect browser if not supported
module Core.UnsupportedBrowser {
    "use strict";

    var minBrowserVersions = {
        "Chrome": 25,
        "MSIE": 9,
        "Trident": 5, // Also IE, based on a renderer version reporting
        "Safari": 5, // Desktop Safari only
        "Firefox": 20,
        "AndroidBrowser": 4,
        "iOS": 6
    };

    export var PageName = "/Areas/Core/Templates/UnsupportedBrowser.html";

    export function CheckIsSupported(): boolean {
        var details = Core.BrowserDetection.GetBrowserDetails();
        var match = minBrowserVersions[details.Browser];
        return match && match <= details.VersionNumber;
    }
}

// We don't bother waiting for document ready as we will be redirecting anyway
Core.UnsupportedBrowser.CheckIsSupported() || window.location.assign(Core.UnsupportedBrowser.PageName);