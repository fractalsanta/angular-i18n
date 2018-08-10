var Core;
(function (Core) {
    var ModalMessageController = (function () {
        function ModalMessageController($scope, $modalInstance, modalMessage) {
            $scope.Close = function () {
                return $modalInstance.close();
            };
            $scope.Model = {
                Title: modalMessage.ModalWindowTitle,
                Message: modalMessage.Message,
                CloseButtonText: modalMessage.ConfirmButtonText || "OK"
            };
        }
        return ModalMessageController;
    })();

    Core.NG.CoreModule.RegisterNamedController("ModalMessageController", ModalMessageController, Core.NG.$typedScope(), Core.NG.$modalInstance, Core.NG.$typedCustomResolve("modalMessage"));
})(Core || (Core = {}));
//# sourceMappingURL=ModalMessageController.js.map
