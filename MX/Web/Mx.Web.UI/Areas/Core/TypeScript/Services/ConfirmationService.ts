/// <reference path="../models/IConfirmation.ts" />
/// <reference path="../models/IConfirmationCheckbox.ts" />
module Core {

    export class ConfirmationService implements IConfirmationService {

        constructor(
            private $modalService: ng.ui.bootstrap.IModalService
            ) {
        }

        Confirm(confirm: IConfirmation): ng.IPromise<any> {
            return this.$modalService.open({
                templateUrl: "/Areas/Core/Templates/mx-confirmation.html",
                controller: "Core.ConfirmationController",
                resolve: {
                    confirm: () => { return confirm; }
                }
            }).result;
        }

        ConfirmCheckbox(confirm: IConfirmationCheckbox): ng.IPromise<any> {
            return this.$modalService.open({
                templateUrl: "/Areas/Core/Templates/mx-confirmation-checkbox.html",
                controller: "Core.ConfirmationCheckboxController",
                resolve: {
                    confirm: () => { return confirm; }
                }
            }).result;
        }
    }

    $confirmationService = NG.CoreModule.RegisterService(
        "Confirmation",
        ConfirmationService,
        Core.NG.$modal
        );
}