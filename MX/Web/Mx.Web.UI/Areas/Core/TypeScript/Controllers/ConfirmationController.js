var Core;
(function (Core) {
    var ConfirmationController = (function () {
        function ConfirmationController($scope, $modalInstance, translation, confirmation) {
            if (!confirmation.CancelText) {
                translation.GetTranslations().then(function (result) {
                    confirmation.CancelText = result.Core.Cancel;
                });
            }
            $scope.Close = function () { return $modalInstance.close(true); };
            $scope.Cancel = function () { return $modalInstance.dismiss(); };
            $scope.Model = confirmation;
            switch (confirmation.ConfirmationType) {
                case Core.ConfirmationTypeEnum.Positive:
                    $scope.ButtonClass = 'btn-success';
                    break;
                case Core.ConfirmationTypeEnum.Danger:
                    $scope.ButtonClass = 'btn-danger';
                    break;
                default:
                    $scope.ButtonClass = 'btn-warning';
                    break;
            }
        }
        return ConfirmationController;
    }());
    Core.ConfirmationController = ConfirmationController;
    Core.NG.CoreModule.RegisterNamedController("ConfirmationController", ConfirmationController, Core.NG.$typedScope(), Core.NG.$modalInstance, Core.$translation, Core.NG.$typedCustomResolve("confirm"));
})(Core || (Core = {}));
