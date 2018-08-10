var Core;
(function (Core) {
    "use strict";
    var MxHeaderController = (function () {
        function MxHeaderController(navigationService, notificationsService, $rootScope, translationService, $location, $authService, popupMessageService, constants, signalR, $state, $intervalService, confirmationService) {
            var _this = this;
            this.navigationService = navigationService;
            this.notificationsService = notificationsService;
            this.$location = $location;
            this.popupMessageService = popupMessageService;
            this.constants = constants;
            this.signalR = signalR;
            this.$state = $state;
            this.$intervalService = $intervalService;
            this.confirmationService = confirmationService;
            this.isBackPlaneActive = true;
            this.VersionInfo = constants.VersionInfo;
            this.NavState = navigationService.NavState();
            this.UpdateNotifications();
            $intervalService(function () {
                var user = $authService.GetUser();
                if (!signalR.IsOffline() && user && user.IsAuthenticated) {
                    _this.UpdateNotifications();
                }
            }, constants.NotificationRefreshInterval);
            if (this.signalR.IsBackplane()) {
                $intervalService(function () {
                    if (!_this.signalR.IsOffline()) {
                        _this.signalR.IsBackplaneActive().then(function (result) {
                            if (_this.isBackPlaneActive !== result) {
                                if (result) {
                                    console.log("Backplane has reloaded");
                                    confirmationService.Confirm({
                                        ConfirmText: _this.L10N.Core.BackplaneRefresh,
                                        ConfirmationType: Core.ConfirmationTypeEnum.Positive,
                                        Message: _this.L10N.Core.BackplaneMessage,
                                        Title: _this.L10N.Core.BackplaneTitle
                                    }).then(function () {
                                        window.location.reload();
                                    });
                                }
                                else {
                                    console.log("Backplane has closed, some messages will be missed");
                                }
                                _this.isBackPlaneActive = result;
                            }
                        });
                    }
                }, constants.CheckBackplaneInterval);
            }
            this.signalR.SetSignalREventListener(Core.SignalRServerMethods.RefreshNotifications, function () {
                _this.UpdateNotifications();
            });
            this.signalR.SetConnectedListener(function () {
                _this.UpdateNotifications();
            });
            $rootScope.$on(Core.ApplicationEvent.ChangeStore, function () {
                _this.UpdateNotifications();
            });
            translationService.GetTranslations().then(function (results) {
                _this.L10N = results;
            });
            this.CanViewSettings = $authService.CheckPermissionAllowance(Core.Api.Models.Task.Administration_Settings_Dashboard_Application_CanUpdate) ||
                $authService.CheckPermissionAllowance(Core.Api.Models.Task.Administration_Settings_Dashboard_Global_CanUpdate) ||
                $authService.CheckPermissionAllowance(Core.Api.Models.Task.Administration_Settings_Dashboard_Store_CanUpdate) ||
                $authService.CheckPermissionAllowance(Core.Api.Models.Task.Administration_Settings_ForecastFilter_CanAccess) ||
                $authService.CheckPermissionAllowance(Core.Api.Models.Task.Administration_Settings_ForecastUsage_CanAccess);
        }
        MxHeaderController.prototype.UpdateNotifications = function () {
            var _this = this;
            this.notificationsService.Get().success(function (result) {
                _this.NotificationAreas = result;
            });
        };
        MxHeaderController.prototype.YouHaveNotifications = function () {
            if (this.L10N != null && this.NotificationAreas != null) {
                return this.L10N.Notifications.YouHaveNotifications.toString().format(this.NotificationAreas.length);
            }
            return "";
        };
        MxHeaderController.prototype.CountOfflineRecords = function () {
            return this.popupMessageService.GetPendingTasks();
        };
        MxHeaderController.prototype.CollapseNav = function () {
            this.NavState.Expanded = false;
            return true;
        };
        MxHeaderController.prototype.ToggleNav = function () {
            this.NavState.Expanded = !this.NavState.Expanded;
        };
        MxHeaderController.prototype.NavigateTo = function (path) {
            this.$location.path(path);
        };
        MxHeaderController.prototype.CountIsOfflineMode = function () {
            return this.popupMessageService.IsOffline();
        };
        MxHeaderController.prototype.IsBackplaneActive = function () {
            return this.isBackPlaneActive;
        };
        MxHeaderController.prototype.NavigateToNotification = function (notification) {
            var path = notification.Url.replace("#", "");
            if (this.$location.path() === path) {
                this.$state.transitionTo(this.$state.current.name, this.$state.params, { reload: true });
            }
            else {
                this.NavigateTo(path);
            }
            this.CollapseNav();
        };
        return MxHeaderController;
    }());
    Core.NG.CoreModule.RegisterNamedController("mxHeaderController", MxHeaderController, Core.$navigationService, Core.Api.$notificationsService, Core.NG.$rootScope, Core.$translation, Core.NG.$location, Core.Auth.$authService, Core.$popupMessageService, Core.Constants, Core.$signalR, Core.NG.$state, Core.NG.$interval, Core.$confirmationService);
})(Core || (Core = {}));
