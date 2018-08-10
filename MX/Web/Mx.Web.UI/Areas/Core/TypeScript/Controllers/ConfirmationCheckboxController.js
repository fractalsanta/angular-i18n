var Core;
(function (Core) {
    "use strict";
    var ConfirmationCheckboxController = (function () {
        function ConfirmationCheckboxController(scope, modalInstance, translation, confirmation) {
            this.scope = scope;
            this.modalInstance = modalInstance;
            this.translation = translation;
            this.confirmation = confirmation;
            Core.ConfirmationController.call(this, scope, modalInstance, translation, confirmation);
            if (scope.Model.Checked == null) {
                scope.Model.Checked = false;
            }
            scope.Close = function () { return modalInstance.close(scope.Model.Checked); };
        }
        return ConfirmationCheckboxController;
    }());
    Core.ConfirmationCheckboxController = ConfirmationCheckboxController;
    Core.NG.CoreModule.RegisterNamedController("ConfirmationCheckboxController", ConfirmationCheckboxController, Core.NG.$typedScope(), Core.NG.$modalInstance, Core.$translation, Core.NG.$typedCustomResolve("confirm"));
})(Core || (Core = {}));
