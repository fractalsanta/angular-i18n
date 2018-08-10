var Core;
(function (Core) {
    var ConfirmModalController = (function () {
        function ConfirmModalController($scope, $modalInstance, confirmationMessage) {
            $scope.ConfirmButtonText = "OK";
            $scope.CancelButtonText = "Cancel";

            if (confirmationMessage != null) {
                $scope.Title = confirmationMessage.ModalWindowTitle;
                $scope.Message = confirmationMessage.Message;
                if (confirmationMessage.ConfirmButtonText != null) {
                    $scope.ConfirmButtonText = confirmationMessage.ConfirmButtonText;
                }
                if (confirmationMessage.CancelButtonText != null) {
                    $scope.CancelButtonText = confirmationMessage.CancelButtonText;
                }
            }

            $scope.Cancel = function () {
                $modalInstance.dismiss();
            };

            $scope.Confirm = function () {
                $modalInstance.close(true);
            };
        }
        return ConfirmModalController;
    })();

    Core.NG.CoreModule.RegisterNamedController("ConfirmModalController", ConfirmModalController, Core.NG.$typedScope(), Core.NG.$modalInstance, Core.NG.$typedCustomResolve("confirmationMessage"));
})(Core || (Core = {}));
//# sourceMappingURL=mx-confirm-message-ctrl.js.map
