var Core;
(function (Core) {
    "use strict";
    var LocalTimeTracker = (function () {
        function LocalTimeTracker(localTime) {
            this.difference = moment.duration(moment().diff(localTime));
        }
        LocalTimeTracker.prototype.Get = function () {
            return moment().add(-this.difference);
        };
        return LocalTimeTracker;
    }());
    Core.LocalTimeTracker = LocalTimeTracker;
})(Core || (Core = {}));
