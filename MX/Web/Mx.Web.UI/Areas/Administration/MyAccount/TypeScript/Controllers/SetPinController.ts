module Administration.MyAccount {
    "use strict";

    interface ISetPINScope extends ng.IScope {
        Translations: Administration.MyAccount.Api.Models.IL10N;
        PINSetting: IPINSetting;

        Dismiss(): void;
        Cancel(val:string): void;
        Save(): void;
        UnequalPINs(): boolean;
        HavePINs(): boolean;
        Changed(): void;
        InvalidCredentials: boolean;
    }

    class SetPINController {
        constructor(
                private $scope: ISetPINScope,
                private translationService: Core.ITranslationService,
                private popup: Core.IPopupMessageService,
                private authService: Core.Auth.IAuthService,
                $window: ng.IWindowService,
                private $modalInstance: ng.ui.bootstrap.IModalServiceInstance,
                private PINSetting: IPINSetting
            ) {

            translationService.GetTranslations().then((result: Core.Api.Models.ITranslations): void => {
                $scope.Translations = result.MyAccount;
            });

            popup.Dismiss();

            $scope.InvalidCredentials = false;
            $scope.PINSetting = PINSetting;

            $scope.Save = (): void => {
                this.DoSave();
            };

            $scope.Cancel = (val): void => {
                $scope.Dismiss();
                $modalInstance.dismiss();
            };

            $scope.UnequalPINs = (): boolean => {
                var pin1 = $scope.PINSetting.UserPIN, pin2 = $scope.PINSetting.ConfirmPIN;
                return (pin1 && pin2 && pin1 !== pin2);
            };

            $scope.HavePINs = (): boolean => {
                var pin1 = $scope.PINSetting.UserPIN, pin2 = $scope.PINSetting.ConfirmPIN;
                return (pin1 && pin2 && pin1 === pin2);
            };

            $scope.Dismiss = (): void => {
                this.popup.Dismiss();
                this.$scope.InvalidCredentials = false;
            }
        }

        private DoSave(): void {
            var password = this.$scope.PINSetting.Password,
                pin = this.$scope.PINSetting.UserPIN;

            this.authService.SetPinNumber(password, pin)
            .success( (result) => {
                this.$modalInstance.close(true);
            })
            .error(error =>  {
                this.popup.Dismiss();
                this.$scope.PINSetting.Password = "";
                this.$scope.InvalidCredentials = true;
            });
        }
    }

    Core.NG.AdministrationMyAccountModule.RegisterNamedController("SetPinController", SetPINController,
        Core.NG.$typedScope<ISetPINScope>(),
        Core.$translation,
        Core.$popupMessageService,
        Core.Auth.$authService,
        Core.NG.$window,
        Core.NG.$modalInstance,
        Core.NG.$typedCustomResolve<IPINSetting>("PINSetting")
        );
}

