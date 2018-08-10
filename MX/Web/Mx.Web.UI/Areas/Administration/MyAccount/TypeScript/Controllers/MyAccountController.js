var Administration;
(function (Administration) {
    var MyAccount;
    (function (MyAccount) {
        "use strict";
        var MyAccountController = (function () {
            function MyAccountController($scope, translationService, popupMessageService, confirmationService, $modal, $authService, $timeout) {
                this.$scope = $scope;
                this.translationService = translationService;
                translationService.GetTranslations().then(function (result) {
                    $scope.Translations = result.MyAccount;
                    popupMessageService.SetPageTitle(result.MyAccount.MyAccount);
                });
                $scope.User = $authService.GetUser();
                $scope.PINSetting = {
                    Enabled: $authService.GetPinUserName() ? true : false
                };
                $scope.SetPIN = function () {
                    if ($scope.PINSetting.Enabling) {
                        $timeout(function () {
                            $scope.PINSetting.Enabled = false;
                        });
                    }
                    $scope.PINSetting.Password = $scope.PINSetting.UserPIN = $scope.PINSetting.ConfirmPIN = "";
                    $modal.open({
                        templateUrl: "/Areas/Administration/MyAccount/Templates/SetPIN.html",
                        controller: "Administration.MyAccount.SetPinController",
                        windowClass: "smaller",
                        resolve: {
                            PINSetting: function () { return $scope.PINSetting; }
                        }
                    }).result.then(function (result) {
                        if (result) {
                            $scope.PINSetting.Enabled = true;
                        }
                        else {
                            if ($scope.PINSetting.Enabling) {
                                $scope.PINSetting.Enabled = false;
                            }
                        }
                        $scope.PINSetting.Enabling = false;
                    });
                };
                $scope.TurnON = function () {
                    $scope.PINSetting.Enabling = true;
                    $scope.SetPIN();
                };
                $scope.TurnOFF = function () {
                    $timeout(function () {
                        $scope.PINSetting.Enabled = true;
                    });
                    confirmationService.Confirm({
                        Title: $scope.Translations.TurnOFFMessageTitle,
                        Message: $scope.Translations.TurnOFFMessage,
                        ConfirmationType: Core.ConfirmationTypeEnum.Positive,
                        ConfirmText: $scope.Translations.TurnOFFConfirm
                    }).then(function (result) {
                        $scope.PINSetting.Enabled = !result;
                        $authService.ClearPinNumber(true);
                    });
                };
                $scope.Nothing = function () {
                };
            }
            return MyAccountController;
        }());
        Core.NG.AdministrationMyAccountModule.RegisterRouteController("", "Templates/MyAccount.html", MyAccountController, Core.NG.$typedScope(), Core.$translation, Core.$popupMessageService, Core.$confirmationService, Core.NG.$modal, Core.Auth.$authService, Core.NG.$timeout);
    })(MyAccount = Administration.MyAccount || (Administration.MyAccount = {}));
})(Administration || (Administration = {}));
