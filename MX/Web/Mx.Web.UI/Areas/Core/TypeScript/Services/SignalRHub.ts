module Core {

    export interface ISignalRHub {
        ConnectionId(): string;
        GetConnectionStatus(): string;
        GetConnectionStatusId(): SignalRConnectionState;
        Subscribe(entityId: number): void;
        UnSubscribe(entityId: number): void;
        Stop(): void;
    }

    export class SignalRHub implements ISignalRHub {
        private _connectionId: string;
        private _connection: HubConnection;
        private _proxy: HubProxy;

        constructor(private hubName: string, private parentObject: any
            , private entityId: number
            , private connectedCallback: any
            , private disconnectedCallback: any
            , private reconnectedCallback: any
            , private events: ISignalREvents
            , private rootScope: ng.IRootScopeService) {

            this._connection = $.hubConnection();
            //this._connection.logging = true;
            this._proxy = this._connection.createHubProxy(hubName);
            this.reconnectedCallback = reconnectedCallback;

            this._connection.disconnected(() => {
                if (this.disconnectedCallback != null) {
                    this.rootScope.$apply(() => this.disconnectedCallback());
                }
            });

            this._connection.reconnecting(() => {                
            });

            this._connection.reconnected(() => {
                if (this.reconnectedCallback != null) {
                    this.rootScope.$apply(() => this.reconnectedCallback());
                }
            });

            this._connection.error(() => {
            });

            this._connection.stateChanged(() => {
                if (this._connection.state === SignalRConnectionState.Connected) {
                    if (this.connectedCallback != null) {
                        this.rootScope.$apply(() => this.connectedCallback());
                    }
                }
            });

            this.SetListeneres(events);
            this.Start();
        }

        SetEntityId(entityId: number) {
            this.Subscribe(entityId);
        }

        SetListeneres(events: ISignalREvents) {
            for (var propertyName in events) {                
                this.AngularRegisterCallback(events[propertyName], propertyName);
            }
        }

        AngularRegisterCallback(callback: any, name: string) {
            if (angular.isFunction(callback)) {
                this.events[name] = callback;
                this._proxy.on(name, (...args: any[]) => {
                    this.rootScope.$apply(() => {
                        this.events[name].apply(this.parentObject, args);
                    });
                });
            } else if (Array.isArray(callback)) {
                this.events[name] = callback;

                this._proxy.on(name, (...args: any[]) => {
                    this.rootScope.$apply(() => {
                        angular.forEach(this.events[name], onecallback => onecallback.apply(this.parentObject, args));
                    });
                });
            }
        }

        Start = () => {
            this._connection.start({ transport: ['webSockets', 'serverSentEvents', 'longPolling'], waitForPageLoad: false }).done(() => {
                this._connectionId = this._proxy.connection.id;
                this._connection.disconnectTimeout = 15000;
                this.Subscribe(this.entityId);
            }).fail(() => {
            });
        }

        Stop = () => {
            this.UnSubscribe(this.entityId);
            this.disconnectedCallback = null;
            this.reconnectedCallback = null;
            this.connectedCallback = null;         
            this._connection.stop(false, false);
        }

        Subscribe(entityId: number) {
            if (this._connection.state === SignalRConnectionState.Connected) {
                this._proxy.invoke(Core.SignalRServerMethods.Subscribe, entityId);
            }
        }

        UnSubscribe(entityId: number) {
            if (this._connection.state === SignalRConnectionState.Connected) {
                this._proxy.invoke(Core.SignalRServerMethods.Unsubscribe, entityId);
            }
        }

        GetConnectionStatusId = () => {
            return <SignalRConnectionState>this._connection.state;
        }

        GetConnectionStatus = () => {
            return SignalRConnectionState[this._connection.state];
        }

        GetName = () => {
            return this.hubName;
        }

        ConnectionId() {
            return this._connectionId;
        }
    } 
} 