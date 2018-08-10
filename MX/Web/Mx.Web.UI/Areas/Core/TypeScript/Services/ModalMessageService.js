var Core;
(function (Core) {
    var ModalMessageService = (function () {
        function ModalMessageService($modalService) {
            this.$modalService = $modalService;
        }
        ModalMessageService.prototype.CreateConfirmationModal = function (confirmMessage) {
            return this.$modalService.open({
                templateUrl: "/Areas/Core/Templates/mx-confirm-message.html",
                controller: "Core.ConfirmModalController",
                resolve: {
                    confirmationMessage: function () {
                        return confirmMessage;
                    }
                }
            });
        };

        ModalMessageService.prototype.CreateNotificationModal = function (modalMessage) {
            return this.$modalService.open({
                templateUrl: "/Areas/Core/Templates/mx-modal-message.html",
                controller: "Core.ModalMessageController",
                resolve: {
                    modalMessage: function () {
                        return modalMessage;
                    }
                }
            });
        };
        return ModalMessageService;
    })();
    Core.ModalMessageService = ModalMessageService;

    Core.$modalMessageService = Core.NG.CoreModule.RegisterService("ModalMessage", ModalMessageService, Core.NG.$modal);
})(Core || (Core = {}));
//# sourceMappingURL=ModalMessageService.js.map
