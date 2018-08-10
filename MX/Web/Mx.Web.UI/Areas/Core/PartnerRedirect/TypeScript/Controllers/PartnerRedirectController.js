var Core;
(function (Core) {
    var PartnerRedirect;
    (function (PartnerRedirect) {
        var PartnerRedirectController = (function () {
            function PartnerRedirectController($scope, $authService, partnerRedirectService, $sce) {
                this.$scope = $scope;
                this.$authService = $authService;
                this.partnerRedirectService = partnerRedirectService;
                this.$sce = $sce;
                $scope.IsReady = false;
                this.partnerRedirectService.Get().then(function (result) {
                    var linkRequest = result.data;
                    $scope.Model = linkRequest;
                    $scope.Model.Url = $sce.trustAsResourceUrl(linkRequest.Url);
                    $scope.IsReady = true;
                });
            }
            return PartnerRedirectController;
        }());
        Core.NG.CorePartnerRedirectModule.RegisterRouteController("", "Templates/PartnerRedirect.html", PartnerRedirectController, Core.NG.$typedScope(), Core.Auth.$authService, Core.PartnerRedirect.Api.$partnerRedirectService, Core.NG.$sce);
    })(PartnerRedirect = Core.PartnerRedirect || (Core.PartnerRedirect = {}));
})(Core || (Core = {}));
