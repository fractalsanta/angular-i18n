var Core;
(function (Core) {
    var ConfirmationService = (function () {
        function ConfirmationService($modalService) {
            this.$modalService = $modalService;
        }
        ConfirmationService.prototype.Confirm = function (confirm) {
            return this.$modalService.open({
                templateUrl: "/Areas/Core/Templates/mx-confirmation.html",
                controller: "Core.ConfirmationController",
                resolve: {
                    confirm: function () { return confirm; }
                }
            }).result;
        };
        ConfirmationService.prototype.ConfirmCheckbox = function (confirm) {
            return this.$modalService.open({
                templateUrl: "/Areas/Core/Templates/mx-confirmation-checkbox.html",
                controller: "Core.ConfirmationCheckboxController",
                resolve: {
                    confirm: function () { return confirm; }
                }
            }).result;
        };
        return ConfirmationService;
    }());
    Core.ConfirmationService = ConfirmationService;
    Core.$confirmationService = Core.NG.CoreModule.RegisterService("Confirmation", ConfirmationService, Core.NG.$modal);
})(Core || (Core = {}));
