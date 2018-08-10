var Core;
(function (Core) {
    var MxAuthorizeController = (function () {
        function MxAuthorizeController($scope, translationService) {
            this.$scope = $scope;
            this.translationService = translationService;
            this._isAscending = true;
            translationService.GetTranslations().then(function (l10NData) {
                $scope.Translations = l10NData.Authentication;
            });
        }
        return MxAuthorizeController;
    }());
    Core.MxAuthorizeController = MxAuthorizeController;
    Core.NG.CoreModule.RegisterNamedController("MxAuthorizeController", MxAuthorizeController, Core.NG.$typedScope(), Core.$translation);
})(Core || (Core = {}));
