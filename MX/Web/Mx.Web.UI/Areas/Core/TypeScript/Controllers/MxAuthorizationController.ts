module Core {

    export interface IMxAuthorizationScope extends ng.IScope {
        Translations: Core.Auth.Api.Models.IL10N;
        Authorize: Core.Api.Models.ISupervisorAuthorization;
        IsOptional: boolean;
        IsValid: boolean;
    }

    export class MxAuthorizeController {
        private _isAscending = true;

        constructor(
            private $scope: IMxAuthorizationScope,
            private translationService: Core.ITranslationService
            ) {
            translationService.GetTranslations().then((l10NData) => {
                $scope.Translations = l10NData.Authentication;
            });
        }
    }

    Core.NG.CoreModule.RegisterNamedController("MxAuthorizeController", MxAuthorizeController,
        Core.NG.$typedScope<IMxAuthorizationScope>(),
        Core.$translation
    );
}