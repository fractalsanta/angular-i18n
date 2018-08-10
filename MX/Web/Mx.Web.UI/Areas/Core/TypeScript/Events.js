var Core;
(function (Core) {
    var Events;
    (function (Events) {
        var Event = (function () {
            function Event() {
                this._callbacks = [];
            }
            Event.prototype.Subscribe = function (callback) {
                this._callbacks.push(callback);
            };
            Event.prototype.Fire = function (arg) {
                var copy = this._callbacks.slice();
                _.each(copy, function (c) { return c(arg); });
            };
            Event.prototype.Unsubscribe = function (callback) {
                var found = this._callbacks.indexOf(callback);
                if (found > -1) {
                    this._callbacks.splice(found, 1);
                }
            };
            Event.prototype.SubscribeController = function (scope, callback) {
                var _this = this;
                this.Subscribe(callback);
                scope.$on("$destroy", function () { return _this.Unsubscribe(callback); });
            };
            return Event;
        }());
        Events.Event = Event;
    })(Events = Core.Events || (Core.Events = {}));
})(Core || (Core = {}));
