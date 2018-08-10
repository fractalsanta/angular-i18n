module Core {
    "use strict";

    class MxHeaderController {
        public NavState: { Expanded: boolean };
        public L10N: Api.Models.ITranslations;
        public NotificationAreas: Api.Models.INotificationArea[];
        public CanViewSettings: boolean;
        public VersionInfo: {
            ProductVersion: string;
            FileVersion: string;
        };

        private isBackPlaneActive: boolean = true;

        constructor(
            private navigationService: INavigationService,
            private notificationsService: Api.INotificationsService,
            $rootScope: ng.IRootScopeService,
            translationService: Core.ITranslationService,
            private $location: ng.ILocationService,
            $authService: Core.Auth.IAuthService,
            private popupMessageService: Core.IPopupMessageService,
            private constants: Core.IConstants,
            private signalR: Core.ISignalRService,
            private $state: ng.ui.IStateService,
            private $intervalService: ng.IIntervalService,
            private confirmationService: Core.IConfirmationService
            ) {

            this.VersionInfo = constants.VersionInfo;
            this.NavState = navigationService.NavState();
            this.UpdateNotifications();

            $intervalService((): void => {
                var user = $authService.GetUser();
                if (!signalR.IsOffline() && user && user.IsAuthenticated) {
                    this.UpdateNotifications();
                }
            }, constants.NotificationRefreshInterval);


            if(this.signalR.IsBackplane()) {
                $intervalService((): void => {
                    if (! this.signalR.IsOffline()) {
                        this.signalR.IsBackplaneActive().then((result) => {
                            if (this.isBackPlaneActive !== result) {
                                if (result) {
                                    console.log("Backplane has reloaded");
                                    confirmationService.Confirm({
                                        ConfirmText: this.L10N.Core.BackplaneRefresh,
                                        ConfirmationType: ConfirmationTypeEnum.Positive,
                                        Message: this.L10N.Core.BackplaneMessage,
                                        Title: this.L10N.Core.BackplaneTitle
                                    }).then(() => {
                                        window.location.reload();
                                    });
                                } else {
                                    console.log("Backplane has closed, some messages will be missed");
                                }
                                this.isBackPlaneActive = result;
                            }
                        });
                    }
                }, constants.CheckBackplaneInterval);
            }

            this.signalR.SetSignalREventListener(Core.SignalRServerMethods.RefreshNotifications, (): void => {
                this.UpdateNotifications();
            });

            this.signalR.SetConnectedListener((): void => {
                this.UpdateNotifications();
            });

            $rootScope.$on(Core.ApplicationEvent.ChangeStore, (): void => {
                this.UpdateNotifications();
            });

            translationService.GetTranslations().then((results: Api.Models.ITranslations): void => {
                this.L10N = results;
            });

            this.CanViewSettings = $authService.CheckPermissionAllowance(Core.Api.Models.Task.Administration_Settings_Dashboard_Application_CanUpdate) ||
            $authService.CheckPermissionAllowance(Core.Api.Models.Task.Administration_Settings_Dashboard_Global_CanUpdate) ||
            $authService.CheckPermissionAllowance(Core.Api.Models.Task.Administration_Settings_Dashboard_Store_CanUpdate) ||
            $authService.CheckPermissionAllowance(Core.Api.Models.Task.Administration_Settings_ForecastFilter_CanAccess) ||
            $authService.CheckPermissionAllowance(Core.Api.Models.Task.Administration_Settings_ForecastUsage_CanAccess);
        }

        private UpdateNotifications(): void {
            this.notificationsService.Get().success((result: Api.Models.INotificationArea[]): void => {
                this.NotificationAreas = result;
            });
        }

        public YouHaveNotifications(): string {
            if (this.L10N != null && this.NotificationAreas != null) {
                return this.L10N.Notifications.YouHaveNotifications.toString().format(this.NotificationAreas.length);
            }
            return "";
        }

        public CountOfflineRecords(): number {
            return this.popupMessageService.GetPendingTasks();
        }

        public CollapseNav(): boolean {
            this.NavState.Expanded = false;
            return true; // This is a temporary fix to allow chaining with NavigateTo() to be refactored to remove all client side logic.
        }

        public ToggleNav(): void {
            this.NavState.Expanded = !this.NavState.Expanded;
        }

        public NavigateTo(path: string): void {
            this.$location.path(path);
        }

        public CountIsOfflineMode(): boolean {
            return this.popupMessageService.IsOffline();
        }

        public IsBackplaneActive(): boolean {
            return this.isBackPlaneActive;
        }

        public NavigateToNotification(notification: Api.Models.INotification): void {
            var path = notification.Url.replace("#", "");

            if (this.$location.path() === path) {
                this.$state.transitionTo(this.$state.current.name, this.$state.params, { reload: true });
            } else {
                this.NavigateTo(path);
            }

            this.CollapseNav();
        }
    }

    NG.CoreModule.RegisterNamedController("mxHeaderController", MxHeaderController,
        $navigationService,
        Api.$notificationsService,
        Core.NG.$rootScope,
        Core.$translation,
        Core.NG.$location,
        Core.Auth.$authService,
        Core.$popupMessageService,
        Core.Constants,
        Core.$signalR,
        Core.NG.$state,
        Core.NG.$interval,
        Core.$confirmationService);
}
