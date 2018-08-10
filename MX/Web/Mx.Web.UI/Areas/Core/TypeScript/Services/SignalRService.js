var Core;
(function (Core) {
    "use strict";
    (function (SignalRConnectionState) {
        SignalRConnectionState[SignalRConnectionState["Connecting"] = 0] = "Connecting";
        SignalRConnectionState[SignalRConnectionState["Connected"] = 1] = "Connected";
        SignalRConnectionState[SignalRConnectionState["Reconnecting"] = 2] = "Reconnecting";
        SignalRConnectionState[SignalRConnectionState["Disconnected"] = 4] = "Disconnected";
    })(Core.SignalRConnectionState || (Core.SignalRConnectionState = {}));
    var SignalRConnectionState = Core.SignalRConnectionState;
    var SignalRService = (function () {
        function SignalRService($rootScope, intervalService, timeoutService, $q, authService, rootScope, backplaneService, constants) {
            var _this = this;
            this.$rootScope = $rootScope;
            this.intervalService = intervalService;
            this.timeoutService = timeoutService;
            this.$q = $q;
            this.authService = authService;
            this.rootScope = rootScope;
            this.backplaneService = backplaneService;
            this.constants = constants;
            this._hubConnectedListeners = [];
            this._hubDisconnectedListeners = [];
            this._hubReconnectedListeners = [];
            this._isOffline = false;
            this._isSimpleMode = false;
            $rootScope.$on(Core.ApplicationEvent.ChangeStore, function (event) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                if (args && args.length) {
                    var eventArgs = args[0];
                    _this.UnSubscribe(eventArgs.previousEntityId);
                    _this.Subscribe(eventArgs.currentEntityId);
                }
            });
            $rootScope.$on(Core.ApplicationEvent.Login, function () {
                _this.Start();
            });
            $rootScope.$on(Core.ApplicationEvent.Logout, function () {
                _this.Stop();
            });
            rootScope.$on(Core.ApplicationEvent.HttpSuccess, function (event) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                if (args != null && args.length > 0) {
                    var response = args[0];
                    if (response.headers(SignalRService.SIMPLE_MODE_HEADER) != null) {
                        if (!_this._isSimpleMode) {
                            console.log('SignalR simple mode is on!');
                            _this.Stop();
                            _this._isSimpleMode = true;
                        }
                    }
                    else {
                        if (_this._isSimpleMode && response.headers('Content-Type')) {
                            console.log('SignalR switching from simple mode to normal!');
                            _this._isSimpleMode = false;
                            var rndSeconds = Math.floor(Math.random() * 10 + 1);
                            console.log('Back to normal in ', rndSeconds, ' sec.', moment().toISOString());
                            _this.timeoutService(function () {
                                console.log('Stop / Start SignalR', moment().toISOString());
                                _this.HubDisconnectedCallback();
                                _this.Start();
                            }, rndSeconds * 1000);
                        }
                    }
                }
            });
            this._signalREvents = {
                ItemUpdated: angular.noop,
                ItemsOfflineUpdated: angular.noop,
                CountDeleted: angular.noop,
                CountStateChanged: angular.noop,
                CountSubmitted: angular.noop,
                TravelPathDataUpdated: [],
                TravelPathDataUpdatedPartial: [],
                NewLocationReceived: [],
                RenameLocation: [],
                DeActivateLocation: [],
                ActivateLocation: [],
                ResortLocation: [],
                ForecastHasBeenRegenerated: [],
                ForecastGenerationFailed: [],
                RefreshNotifications: []
            };
            this.CreateSignalRHub();
            this.SetSignalRReconectionTimer();
        }
        SignalRService.prototype.HubExists = function () {
            if (this._isSimpleMode) {
                return true;
            }
            return this._applicationHub !== null;
        };
        SignalRService.prototype.GetConnectionId = function () {
            if (this._isSimpleMode) {
                return "Simple_Mode_Connection_Id";
            }
            return (this._applicationHub) ? this._applicationHub.ConnectionId() : "-";
        };
        SignalRService.prototype.SetConnectedListener = function (handler, $scope) {
            this.AddListener(this._hubConnectedListeners, handler, $scope);
        };
        SignalRService.prototype.SetReconnectedListener = function (handler, $scope) {
            this.AddListener(this._hubReconnectedListeners, handler, $scope);
        };
        SignalRService.prototype.SetDisconnectedListener = function (handler, $scope) {
            this.AddListener(this._hubDisconnectedListeners, handler, $scope);
        };
        SignalRService.prototype.SetSignalREventListener = function (name, listener) {
            for (var propertyName in this._signalREvents) {
                if (name === propertyName) {
                    if (Array.isArray(this._signalREvents[name])) {
                        this._signalREvents[name].push(function () {
                            var args = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                args[_i - 0] = arguments[_i];
                            }
                            listener.apply(null, args);
                        });
                    }
                    else {
                        this._signalREvents[name] = function () {
                            var args = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                args[_i - 0] = arguments[_i];
                            }
                            listener.apply(null, args);
                        };
                    }
                }
            }
        };
        SignalRService.prototype.IsOffline = function () {
            if (this._isSimpleMode) {
                return false;
            }
            return this._isOffline;
        };
        SignalRService.prototype.IsBackplane = function () {
            if (this._isSimpleMode) {
                return false;
            }
            return this.constants.IsBackplane;
        };
        SignalRService.prototype.IsBackplaneActive = function () {
            if (this._isSimpleMode) {
                return this.$q.when(false);
            }
            if (this.IsOffline()) {
                var deferred = this.$q.defer();
                deferred.resolve(false);
                return deferred.promise;
            }
            return this.backplaneService.IsBackplaneActive().then(function (result) {
                return result.data;
            });
        };
        SignalRService.prototype.Start = function () {
            if (this._isSimpleMode) {
                return;
            }
            if (this._intervalTimerPointer != null) {
                this.intervalService.cancel(this._intervalTimerPointer);
            }
            if (this._applicationHub != null) {
                this._applicationHub.Stop();
            }
            this.CreateSignalRHub();
            this.SetSignalRReconectionTimer();
        };
        SignalRService.prototype.Stop = function () {
            if (this._intervalTimerPointer != null) {
                this.intervalService.cancel(this._intervalTimerPointer);
            }
            if (this._applicationHub != null) {
                this._applicationHub.Stop();
            }
        };
        SignalRService.prototype.SetSignalRReconectionTimer = function () {
            var _this = this;
            this._intervalTimerPointer = this.intervalService(function () {
                if (!_this._applicationHub || _this._applicationHub.GetConnectionStatusId() !== SignalRConnectionState.Connected) {
                    _this.CreateSignalRHub();
                }
            }, this.constants.SignaRReconnectionTimeout);
        };
        SignalRService.prototype.CreateSignalRHub = function () {
            var _this = this;
            if (this._isSimpleMode) {
                return;
            }
            var user = this.authService.GetUser();
            if (user.BusinessUser) {
                if (this._applicationHub) {
                    this._applicationHub.Stop();
                }
                this._applicationHub = new Core.SignalRHub(Core.SignalRHubs.ApplicationHub, this, user.BusinessUser.MobileSettings.EntityId, function () { _this.HubConnectedCallback(); }, function () { _this.HubDisconnectedCallback(); }, function () { _this.HubReconnectedCallback(); }, this._signalREvents, this.$rootScope);
            }
        };
        SignalRService.prototype.HubConnectedCallback = function () {
            if (this._isSimpleMode) {
                return;
            }
            if (this._hubConnectedListeners.length) {
                angular.forEach(this._hubConnectedListeners, function (listener) {
                    listener.Handler.apply(listener.Scope || null);
                });
            }
            this._isOffline = false;
        };
        SignalRService.prototype.HubReconnectedCallback = function () {
            if (this._isSimpleMode) {
                return;
            }
            if (this._hubReconnectedListeners.length) {
                angular.forEach(this._hubReconnectedListeners, function (listener) {
                    listener.Handler.apply(listener.Scope || null);
                });
            }
            this._isOffline = false;
        };
        SignalRService.prototype.HubDisconnectedCallback = function () {
            if (this._isSimpleMode) {
                return;
            }
            if (this._hubDisconnectedListeners.length) {
                angular.forEach(this._hubDisconnectedListeners, function (listener) {
                    listener.Handler.apply(listener.Scope || null);
                });
            }
            this._isOffline = true;
        };
        SignalRService.prototype.Subscribe = function (entityId) {
            if (this._isSimpleMode) {
                return;
            }
            if (this._applicationHub != null) {
                this._applicationHub.Subscribe(entityId);
            }
        };
        SignalRService.prototype.UnSubscribe = function (entityId) {
            if (this._isSimpleMode) {
                return;
            }
            if (this._applicationHub != null) {
                this._applicationHub.UnSubscribe(entityId);
            }
        };
        SignalRService.prototype.AddListener = function (listenerQueue, handler, $scope) {
            var _this = this;
            var newListener = { Handler: handler, Scope: $scope };
            listenerQueue.push(newListener);
            if ($scope) {
                $scope.$on("$destroy", function () {
                    _this.RemoveListener(listenerQueue, newListener);
                });
            }
        };
        SignalRService.prototype.RemoveListener = function (listenerQueue, listener) {
            var length = listenerQueue.length, i;
            for (i = 0; i < length; i += 1) {
                if (listenerQueue[i] === listener) {
                    listenerQueue.splice(i, 1);
                    break;
                }
            }
        };
        SignalRService.SIMPLE_MODE_HEADER = "MxSimpleMode";
        return SignalRService;
    }());
    Core.$signalR = Core.NG.CoreModule.RegisterService("SignalR", SignalRService, Core.NG.$rootScope, Core.NG.$interval, Core.NG.$timeout, Core.NG.$q, Core.Auth.$authService, Core.NG.$rootScope, Core.Api.$backplaneService, Core.Constants);
})(Core || (Core = {}));
