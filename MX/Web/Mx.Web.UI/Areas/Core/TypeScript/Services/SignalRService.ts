module Core {
    "use strict";

    export enum SignalRConnectionState {
        Connecting = 0,
        Connected = 1,
        Reconnecting = 2,
        Disconnected = 4
    }

    export interface ISignalRService {
        GetConnectionId(): string;

        SetSignalREventListener(name: any, listener: any): void;

        SetConnectedListener(listener: () => void, $scope?: ng.IScope): void;
        SetReconnectedListener(listener: () => void, $scope?: ng.IScope): void;
        SetDisconnectedListener(listener: () => void, $scope?: ng.IScope): void;
        IsBackplane(): boolean;
        IsBackplaneActive(): ng.IPromise<boolean>;

        IsOffline(): boolean;

        HubExists(): boolean;
    }

    interface IListener {
        Handler: () => void;
        Scope?: ng.IScope;
    }

    class SignalRService implements ISignalRService {
        private _intervalTimerPointer: ng.IPromise<any>;

        private _hubConnectedListeners: IListener[] = [];
        private _hubDisconnectedListeners: IListener[] = [];
        private _hubReconnectedListeners: IListener[] = [];

        private _applicationHub: ISignalRHub;
        private _signalREvents: ISignalREvents;

        private _isOffline: boolean;

        private static SIMPLE_MODE_HEADER = "MxSimpleMode";
        private _isSimpleMode: boolean;

        constructor(
            private $rootScope: ng.IRootScopeService
            , private intervalService: ng.IIntervalService
            , private timeoutService: ng.ITimeoutService
            , private $q: ng.IQService
            , private authService: Core.Auth.IAuthService
            , private rootScope: ng.IRootScopeService
            , private backplaneService: Api.IBackplaneService
            , private constants: Core.IConstants ) {

            this._isOffline = false;
            this._isSimpleMode = false;

            // Change Store Event
            // UnSubscribe / Subscribe
            $rootScope.$on(ApplicationEvent.ChangeStore, (event: ng.IAngularEvent, ...args: any[]): void => {
                if (args && args.length) {
                    var eventArgs = <IChangeStoreEventArg>args[0];
                    this.UnSubscribe(eventArgs.previousEntityId);
                    this.Subscribe(eventArgs.currentEntityId);
                }
            });

            $rootScope.$on(ApplicationEvent.Login, (): void => {
                this.Start();
            });

            $rootScope.$on(ApplicationEvent.Logout, (): void => {
                this.Stop();
            });

            //Looking for MxSimpleMode header
            rootScope.$on(ApplicationEvent.HttpSuccess, (event: ng.IAngularEvent, ...args: any[]): void => {                
                if (args != null && args.length > 0) {                    
                    var response = <ng.IHttpPromiseCallbackArg<any>>args[0];
                    if (response.headers(SignalRService.SIMPLE_MODE_HEADER) != null) {                                                
                        if (!this._isSimpleMode) {
                            console.log('SignalR simple mode is on!');                 
                            this.Stop();
                            this._isSimpleMode = true;
                        }
                    } else {                                                
                        if (this._isSimpleMode && response.headers('Content-Type')) {

                                console.log('SignalR switching from simple mode to normal!');
                                this._isSimpleMode = false;

                                var rndSeconds = Math.floor(Math.random() * 10 + 1);
                                console.log('Back to normal in ', rndSeconds, ' sec.', moment().toISOString());

                                this.timeoutService(() => {
                                    console.log('Stop / Start SignalR', moment().toISOString());
                                    this.HubDisconnectedCallback();
                                    this.Start();
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

                RefreshNotifications: [],
            };

            this.CreateSignalRHub();
            this.SetSignalRReconectionTimer();
        }

        public HubExists(): boolean {
            if (this._isSimpleMode) {
                return true;
            }
            return this._applicationHub !== null;
        }

        public GetConnectionId(): string {
            if (this._isSimpleMode) {
                return "Simple_Mode_Connection_Id";
            }
            return (this._applicationHub) ? this._applicationHub.ConnectionId() : "-";
        }

        public SetConnectedListener(handler: () => void, $scope?: ng.IScope): void {
            this.AddListener(this._hubConnectedListeners, handler, $scope);
        }

        public SetReconnectedListener(handler: () => void, $scope?: ng.IScope): void {
            this.AddListener(this._hubReconnectedListeners, handler, $scope);
        }

        public SetDisconnectedListener(handler: () => void, $scope?: ng.IScope): void {
            this.AddListener(this._hubDisconnectedListeners, handler, $scope);
        }

        public SetSignalREventListener(name: any, listener: any): void {
            for (var propertyName in this._signalREvents) {
                if (name === propertyName) {
                    if (Array.isArray(this._signalREvents[name])) {
                        this._signalREvents[name].push((...args: any[]): void => {
                            listener.apply(null, args);
                        });
                    } else {
                        this._signalREvents[name] = (...args: any[]): void => {
                            listener.apply(null, args);
                        };
                    }
                }
            }
        }

        public IsOffline(): boolean {
            if (this._isSimpleMode) {
                return false;
            }
            return this._isOffline;
        }

        public IsBackplane() {
            if (this._isSimpleMode) {
                return false;
            }
            return this.constants.IsBackplane;
        }

        public IsBackplaneActive(): ng.IPromise<boolean> {
            if (this._isSimpleMode) {
                return this.$q.when(false);
            }

            if (this.IsOffline()) {
                var deferred = this.$q.defer<Boolean>();
                deferred.resolve(false);
                return deferred.promise;
            }
            return this.backplaneService.IsBackplaneActive().then((result) => {
                return result.data;
            });
        }


        private Start() {           
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
        }

        private Stop() {
            if (this._intervalTimerPointer != null) {
                this.intervalService.cancel(this._intervalTimerPointer);
            }

            if (this._applicationHub != null) {
                this._applicationHub.Stop();
            }
        }

        private SetSignalRReconectionTimer(): void {
            this._intervalTimerPointer = this.intervalService((): void => {
                if (!this._applicationHub || this._applicationHub.GetConnectionStatusId() !== SignalRConnectionState.Connected) {
                    this.CreateSignalRHub();
                }
            }, this.constants.SignaRReconnectionTimeout);
        }

        private CreateSignalRHub(): void {

            if (this._isSimpleMode) {
                return;
            }

            var user = this.authService.GetUser();
            if (user.BusinessUser) {
                if (this._applicationHub) {
                    this._applicationHub.Stop();
                }
                this._applicationHub = new SignalRHub(
                    Core.SignalRHubs.ApplicationHub,
                    this,
                    user.BusinessUser.MobileSettings.EntityId,
                    (): void => { this.HubConnectedCallback(); },
                    (): void => { this.HubDisconnectedCallback(); },
                    (): void => { this.HubReconnectedCallback(); },
                    this._signalREvents,
                    this.$rootScope);
            }            
        }

        private HubConnectedCallback(): void {
            if (this._isSimpleMode) {
                return;
            }
            if (this._hubConnectedListeners.length) {
                angular.forEach(this._hubConnectedListeners, (listener: IListener): void => {
                    listener.Handler.apply(listener.Scope || null);
                });
            }
            this._isOffline = false;
        }

        private HubReconnectedCallback(): void {
            if (this._isSimpleMode) {
                return;
            }
            if (this._hubReconnectedListeners.length) {
                angular.forEach(this._hubReconnectedListeners, (listener: IListener): void => {
                    listener.Handler.apply(listener.Scope || null);
                });
            }
            this._isOffline = false;
        }

        private HubDisconnectedCallback(): void {
            if (this._isSimpleMode) {
                return;
            }
            if (this._hubDisconnectedListeners.length) {
                angular.forEach(this._hubDisconnectedListeners, (listener: IListener): void => {
                    listener.Handler.apply(listener.Scope || null);
                });
            }
            this._isOffline = true;
        }

        private Subscribe(entityId: number): void {
            if (this._isSimpleMode) {
                return;
            }
            if (this._applicationHub != null) {
                this._applicationHub.Subscribe(entityId);
            }
        }

        private UnSubscribe(entityId: number): void {
            if (this._isSimpleMode) {
                return;
            }
            if (this._applicationHub != null) {
                this._applicationHub.UnSubscribe(entityId);
            }
        }

        private AddListener(listenerQueue: IListener[], handler: () => void, $scope?: ng.IScope): void {
            var newListener = <IListener>{ Handler: handler, Scope: $scope };
            listenerQueue.push(newListener);

            if ($scope) {
                $scope.$on("$destroy", (): void => {
                    this.RemoveListener(listenerQueue, newListener);
                });
            }
        }

        private RemoveListener(listenerQueue: IListener[], listener: IListener): void {
            var length = listenerQueue.length,
                i: number;

            for (i = 0; i < length; i += 1) {
                if (listenerQueue[i] === listener) {
                    listenerQueue.splice(i, 1);
                    break;
                }
            }
        }
    }

    export var $signalR: NG.INamedService<ISignalRService> = NG.CoreModule.RegisterService("SignalR", SignalRService
        , NG.$rootScope
        , NG.$interval
        , NG.$timeout
        , NG.$q
        , Auth.$authService
        , NG.$rootScope
        , Api.$backplaneService
        , Core.Constants);
} 