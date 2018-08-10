module Administration.MyAccount {
    "use strict";

    export interface IPINSetting {
        Password: string;
        UserPIN: string;
        ConfirmPIN: string;
        Enabled: boolean;
        Enabling: boolean;
    }

    interface IMyAccountControllerScope extends ng.IScope {
        Translations: Administration.MyAccount.Api.Models.IL10N;
        PINSetting: IPINSetting;

        SetPIN(): void;
        TurnON(): void;
        TurnOFF(): void;
        Nothing(): void;

        User: Core.Auth.IUser;
    }

    class MyAccountController {
        constructor(
            private $scope: IMyAccountControllerScope,
            private translationService: Core.ITranslationService,
            popupMessageService: Core.IPopupMessageService,
            confirmationService: Core.IConfirmationService,
            $modal: ng.ui.bootstrap.IModalService,
            $authService: Core.Auth.IAuthService,
            $timeout: ng.ITimeoutService
        ) {
            //Load Translations
            translationService.GetTranslations().then((result) => {
                $scope.Translations = result.MyAccount;
                popupMessageService.SetPageTitle(result.MyAccount.MyAccount);
            });

            $scope.User = $authService.GetUser();

            $scope.PINSetting = <IPINSetting>{
                Enabled: $authService.GetPinUserName() ? true : false
            };

            $scope.SetPIN = (): void => {
                if ($scope.PINSetting.Enabling) {
                    $timeout(() => {
                        $scope.PINSetting.Enabled = false;
                    });
                }

                $scope.PINSetting.Password = $scope.PINSetting.UserPIN = $scope.PINSetting.ConfirmPIN = "";

                $modal.open(<ng.ui.bootstrap.IModalSettings>{
                    templateUrl: "/Areas/Administration/MyAccount/Templates/SetPIN.html",
                    controller: "Administration.MyAccount.SetPinController",
                    windowClass: "smaller",
                    resolve: {
                        PINSetting: (): any => { return $scope.PINSetting; }
                    }
                }).result.then((result) => {
                    if (result) {
                        $scope.PINSetting.Enabled = true;
                    } else {
                        if ($scope.PINSetting.Enabling) {
                            $scope.PINSetting.Enabled = false;
                        }
                    }

                    $scope.PINSetting.Enabling = false;
                });
            }

            $scope.TurnON = (): void => {
                $scope.PINSetting.Enabling = true;
                $scope.SetPIN();
            }

            $scope.TurnOFF = (): void => {

                $timeout(() => {
                    $scope.PINSetting.Enabled = true;
                });

                confirmationService.Confirm({
                    Title: $scope.Translations.TurnOFFMessageTitle,
                    Message: $scope.Translations.TurnOFFMessage,
                    ConfirmationType: Core.ConfirmationTypeEnum.Positive,
                    ConfirmText: $scope.Translations.TurnOFFConfirm
                }).then((result) => {
                    $scope.PINSetting.Enabled = !result;
                    $authService.ClearPinNumber(true);
                });
            }

            $scope.Nothing = (): void => {
            }
        }
    }

    Core.NG.AdministrationMyAccountModule.RegisterRouteController("", "Templates/MyAccount.html", MyAccountController,
        Core.NG.$typedScope<IMyAccountControllerScope>(),
        Core.$translation,
        Core.$popupMessageService,
        Core.$confirmationService,
        Core.NG.$modal,
        Core.Auth.$authService,
        Core.NG.$timeout);
} 
