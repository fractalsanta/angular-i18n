var Administration;
(function (Administration) {
    var MyAccount;
    (function (MyAccount) {
        "use strict";
        var SetPINController = (function () {
            function SetPINController($scope, translationService, popup, authService, $window, $modalInstance, PINSetting) {
                var _this = this;
                this.$scope = $scope;
                this.translationService = translationService;
                this.popup = popup;
                this.authService = authService;
                this.$modalInstance = $modalInstance;
                this.PINSetting = PINSetting;
                translationService.GetTranslations().then(function (result) {
                    $scope.Translations = result.MyAccount;
                });
                popup.Dismiss();
                $scope.InvalidCredentials = false;
                $scope.PINSetting = PINSetting;
                $scope.Save = function () {
                    _this.DoSave();
                };
                $scope.Cancel = function (val) {
                    $scope.Dismiss();
                    $modalInstance.dismiss();
                };
                $scope.UnequalPINs = function () {
                    var pin1 = $scope.PINSetting.UserPIN, pin2 = $scope.PINSetting.ConfirmPIN;
                    return (pin1 && pin2 && pin1 !== pin2);
                };
                $scope.HavePINs = function () {
                    var pin1 = $scope.PINSetting.UserPIN, pin2 = $scope.PINSetting.ConfirmPIN;
                    return (pin1 && pin2 && pin1 === pin2);
                };
                $scope.Dismiss = function () {
                    _this.popup.Dismiss();
                    _this.$scope.InvalidCredentials = false;
                };
            }
            SetPINController.prototype.DoSave = function () {
                var _this = this;
                var password = this.$scope.PINSetting.Password, pin = this.$scope.PINSetting.UserPIN;
                this.authService.SetPinNumber(password, pin)
                    .success(function (result) {
                    _this.$modalInstance.close(true);
                })
                    .error(function (error) {
                    _this.popup.Dismiss();
                    _this.$scope.PINSetting.Password = "";
                    _this.$scope.InvalidCredentials = true;
                });
            };
            return SetPINController;
        }());
        Core.NG.AdministrationMyAccountModule.RegisterNamedController("SetPinController", SetPINController, Core.NG.$typedScope(), Core.$translation, Core.$popupMessageService, Core.Auth.$authService, Core.NG.$window, Core.NG.$modalInstance, Core.NG.$typedCustomResolve("PINSetting"));
    })(MyAccount = Administration.MyAccount || (Administration.MyAccount = {}));
})(Administration || (Administration = {}));
