module Core.PartnerRedirect {

    interface IPartnerRedirectControllerScope extends ng.IScope {
        Model: Api.Models.ILinkRequest;
        IsReady: boolean;
    }

    class PartnerRedirectController {

        constructor(
            private $scope: IPartnerRedirectControllerScope,
            private $authService: Core.Auth.IAuthService,
            private partnerRedirectService: Core.PartnerRedirect.Api.IPartnerRedirectService,
            private $sce: ng.ISCEService
            ) {
            $scope.IsReady = false;
            this.partnerRedirectService.Get().then((result) => {
                var linkRequest = result.data;
                $scope.Model = linkRequest;
                $scope.Model.Url = $sce.trustAsResourceUrl(linkRequest.Url);
                $scope.IsReady = true;
            });
        }
    }

    Core.NG.CorePartnerRedirectModule.RegisterRouteController("", "Templates/PartnerRedirect.html", PartnerRedirectController
        , Core.NG.$typedScope<IPartnerRedirectControllerScope>()
        , Core.Auth.$authService
        , Core.PartnerRedirect.Api.$partnerRedirectService
        , Core.NG.$sce
        );
}   