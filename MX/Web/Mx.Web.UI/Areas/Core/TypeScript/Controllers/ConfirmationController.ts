module Core {
    export interface IConfirmationScope extends ng.IScope {
        Model: IConfirmation;
        Close(): void;
        Cancel(): void;
        ButtonClass: string;
    }

    export class ConfirmationController {
        constructor(
            $scope: IConfirmationScope,
            $modalInstance: ng.ui.bootstrap.IModalServiceInstance,
            translation: Core.ITranslationService,
            confirmation: IConfirmation) {

            // Update the cancel text if it is not set.
            if (!confirmation.CancelText) {
                translation.GetTranslations().then((result) => {
                    confirmation.CancelText = result.Core.Cancel;
                });
            }

            $scope.Close = () => $modalInstance.close(true);
            $scope.Cancel = () => $modalInstance.dismiss();

            $scope.Model = confirmation;
            switch (confirmation.ConfirmationType) {
            case ConfirmationTypeEnum.Positive:
                $scope.ButtonClass = 'btn-success';
                break;
            case ConfirmationTypeEnum.Danger:
                $scope.ButtonClass = 'btn-danger';
                break;
            default:
                $scope.ButtonClass = 'btn-warning';
                break;
            }
        }
    }

    NG.CoreModule.RegisterNamedController("ConfirmationController", ConfirmationController,
        NG.$typedScope<IConfirmationScope>(),
        Core.NG.$modalInstance,
        Core.$translation,
        Core.NG.$typedCustomResolve<IConfirmation>("confirm")
        
    );
}