/// <reference path="ConfirmationController.ts" />
module Core {
    "use strict";

    export interface IConfirmationCheckboxScope extends IConfirmationScope {
        Model: IConfirmationCheckbox;
    }

    export class ConfirmationCheckboxController /* extends ConfirmationController */ {
        constructor(private scope: IConfirmationCheckboxScope
            , private modalInstance: ng.ui.bootstrap.IModalServiceInstance
            , private translation: ITranslationService
            , private confirmation: IConfirmationCheckbox
            ) {
            // this is a "manual" controller inheritance, typescript's extends didn't work
            ConfirmationController.call(this, scope, modalInstance, translation, confirmation);

            if (scope.Model.Checked == null) {
                scope.Model.Checked = false;
            }

            scope.Close = () => modalInstance.close(scope.Model.Checked);
        }
    }

    NG.CoreModule.RegisterNamedController("ConfirmationCheckboxController"
        , ConfirmationCheckboxController
        , NG.$typedScope<IConfirmationCheckboxScope>()
        , NG.$modalInstance
        , Core.$translation
        , NG.$typedCustomResolve<IConfirmationCheckbox>("confirm")
        );
}