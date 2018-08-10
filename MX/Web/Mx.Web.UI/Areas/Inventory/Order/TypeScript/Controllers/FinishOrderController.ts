module Inventory.Order {
    "use strict";

    export interface IFinishOrderResult {
        AutoReceive: boolean;
        InvoiceNumber: string;
        ReceiveTime: Date;
        ShowReceiveDate: boolean;
        CanAutoReceive: boolean;
        ReceiveWithoutInvoiceNumber: boolean;
    }

    export interface IFinishOrderControllerScope extends ng.IScope {
        Translations: Api.Models.IL10N;
        SubmissionOptions: IFinishOrderResult;

        IsOrderReceiveIncomplete(): boolean;
        IsInvoiceNumberValid(): boolean;

        ToggleAutoReceive(): void;
        OpenReceiveDate(e: Event): void;
        Cancel(): void;
        Confirm(): void;
    }

    export class FinishOrderController {
        constructor(
            $scope: IFinishOrderControllerScope,
            $modalInstance: ng.ui.bootstrap.IModalServiceInstance,
            translation: Core.ITranslationService,
            authService: Core.Auth.IAuthService
            ) {

            translation.GetTranslations().then((results: Core.Api.Models.ITranslations): void => {
                $scope.Translations = results.InventoryOrder;
            });

            $scope.SubmissionOptions = {
                ShowReceiveDate:false,
                AutoReceive: false,
                InvoiceNumber: "",
                ReceiveTime: moment().toDate(),
                CanAutoReceive: authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_Ordering_CanAutoReceiveOrder),
                ReceiveWithoutInvoiceNumber: !authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_Receiving_CanReceiveWithoutInvoiceNumber)
            };

            $scope.IsOrderReceiveIncomplete = (): boolean => {
                       // Disable if ReceiveTime fails validation.
                return !$scope.SubmissionOptions.ReceiveTime ||
                       // Or Disable if Invoice number missing, while in auto receive mode and invoice number required config switched on.
                       (!$scope.SubmissionOptions.InvoiceNumber && $scope.SubmissionOptions.AutoReceive && $scope.SubmissionOptions.ReceiveWithoutInvoiceNumber);
            };

            $scope.IsInvoiceNumberValid = (): boolean => {
                // Only show textbox validation if invoice number is missing and Invoice number required config switched on
                return !$scope.SubmissionOptions.InvoiceNumber && $scope.SubmissionOptions.ReceiveWithoutInvoiceNumber && $scope.SubmissionOptions.AutoReceive;
            };

            $scope.ToggleAutoReceive = (): void => {
                $scope.SubmissionOptions.AutoReceive = !$scope.SubmissionOptions.AutoReceive;
            };

            $scope.OpenReceiveDate = (e: Event): void => {
                e.preventDefault();
                e.stopPropagation();
                $scope.SubmissionOptions.ShowReceiveDate = !$scope.SubmissionOptions.ShowReceiveDate;
            };

            $scope.Cancel = (): void => {
                $modalInstance.dismiss();
            };

            $scope.Confirm = (): void => { 
                if ($scope.SubmissionOptions.InvoiceNumber == undefined) {
                    $scope.SubmissionOptions.InvoiceNumber = '';
                }             
                $modalInstance.close($scope.SubmissionOptions);
            };
        }
    }

    Core.NG.InventoryOrderModule.RegisterNamedController("FinishOrderController", FinishOrderController,
        Core.NG.$typedScope<IFinishOrderControllerScope>(),
        Core.NG.$modalInstance,
        Core.$translation,
        Core.Auth.$authService);
}