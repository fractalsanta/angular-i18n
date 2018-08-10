var Core;
(function (Core) {
    var SignalRHub = (function () {
        function SignalRHub(hubName, parentObject, entityId, connectedCallback, disconnectedCallback, reconnectedCallback, events, rootScope) {
            var _this = this;
            this.hubName = hubName;
            this.parentObject = parentObject;
            this.entityId = entityId;
            this.connectedCallback = connectedCallback;
            this.disconnectedCallback = disconnectedCallback;
            this.reconnectedCallback = reconnectedCallback;
            this.events = events;
            this.rootScope = rootScope;
            this.Start = function () {
                _this._connection.start({ transport: ['webSockets', 'serverSentEvents', 'longPolling'], waitForPageLoad: false }).done(function () {
                    _this._connectionId = _this._proxy.connection.id;
                    _this._connection.disconnectTimeout = 15000;
                    _this.Subscribe(_this.entityId);
                }).fail(function () {
                });
            };
            this.Stop = function () {
                _this.UnSubscribe(_this.entityId);
                _this.disconnectedCallback = null;
                _this.reconnectedCallback = null;
                _this.connectedCallback = null;
                _this._connection.stop(false, false);
            };
            this.GetConnectionStatusId = function () {
                return _this._connection.state;
            };
            this.GetConnectionStatus = function () {
                return Core.SignalRConnectionState[_this._connection.state];
            };
            this.GetName = function () {
                return _this.hubName;
            };
            this._connection = $.hubConnection();
            this._proxy = this._connection.createHubProxy(hubName);
            this.reconnectedCallback = reconnectedCallback;
            this._connection.disconnected(function () {
                if (_this.disconnectedCallback != null) {
                    _this.rootScope.$apply(function () { return _this.disconnectedCallback(); });
                }
            });
            this._connection.reconnecting(function () {
            });
            this._connection.reconnected(function () {
                if (_this.reconnectedCallback != null) {
                    _this.rootScope.$apply(function () { return _this.reconnectedCallback(); });
                }
            });
            this._connection.error(function () {
            });
            this._connection.stateChanged(function () {
                if (_this._connection.state === Core.SignalRConnectionState.Connected) {
                    if (_this.connectedCallback != null) {
                        _this.rootScope.$apply(function () { return _this.connectedCallback(); });
                    }
                }
            });
            this.SetListeneres(events);
            this.Start();
        }
        SignalRHub.prototype.SetEntityId = function (entityId) {
            this.Subscribe(entityId);
        };
        SignalRHub.prototype.SetListeneres = function (events) {
            for (var propertyName in events) {
                this.AngularRegisterCallback(events[propertyName], propertyName);
            }
        };
        SignalRHub.prototype.AngularRegisterCallback = function (callback, name) {
            var _this = this;
            if (angular.isFunction(callback)) {
                this.events[name] = callback;
                this._proxy.on(name, function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i - 0] = arguments[_i];
                    }
                    _this.rootScope.$apply(function () {
                        _this.events[name].apply(_this.parentObject, args);
                    });
                });
            }
            else if (Array.isArray(callback)) {
                this.events[name] = callback;
                this._proxy.on(name, function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i - 0] = arguments[_i];
                    }
                    _this.rootScope.$apply(function () {
                        angular.forEach(_this.events[name], function (onecallback) { return onecallback.apply(_this.parentObject, args); });
                    });
                });
            }
        };
        SignalRHub.prototype.Subscribe = function (entityId) {
            if (this._connection.state === Core.SignalRConnectionState.Connected) {
                this._proxy.invoke(Core.SignalRServerMethods.Subscribe, entityId);
            }
        };
        SignalRHub.prototype.UnSubscribe = function (entityId) {
            if (this._connection.state === Core.SignalRConnectionState.Connected) {
                this._proxy.invoke(Core.SignalRServerMethods.Unsubscribe, entityId);
            }
        };
        SignalRHub.prototype.ConnectionId = function () {
            return this._connectionId;
        };
        return SignalRHub;
    }());
    Core.SignalRHub = SignalRHub;
})(Core || (Core = {}));
