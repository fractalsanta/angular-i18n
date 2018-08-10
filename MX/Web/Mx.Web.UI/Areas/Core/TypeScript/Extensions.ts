interface String {
    format(...replacements: any[]): string;
}

if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, (match, number) => typeof args[number] !== "undefined"
            ? args[number]
            : match.ToString());
    };
}

interface Window {
    isIOSDevice(): boolean;
    hasInUserAgent(text: string): boolean;
}

if (!window.isIOSDevice) {
    window.isIOSDevice = () => {
        var userAgent = window.navigator.userAgent;
        return !!(userAgent.match(/iPad/i) || userAgent.match(/iPhone/i));
    };    
}

if (!window.hasInUserAgent) {
    window.hasInUserAgent = (text: string) => {
        var userAgent = window.navigator.userAgent;
        return !!(userAgent.match(text) || userAgent.match(text));
    };
}