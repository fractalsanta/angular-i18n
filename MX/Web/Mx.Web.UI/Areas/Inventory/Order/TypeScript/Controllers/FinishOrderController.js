var Inventory;
(function (Inventory) {
    var Order;
    (function (Order) {
        "use strict";
        var FinishOrderController = (function () {
            function FinishOrderController($scope, $modalInstance, translation, authService) {
                translation.GetTranslations().then(function (results) {
                    $scope.Translations = results.InventoryOrder;
                });
                $scope.SubmissionOptions = {
                    ShowReceiveDate: false,
                    AutoReceive: false,
                    InvoiceNumber: "",
                    ReceiveTime: moment().toDate(),
                    CanAutoReceive: authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_Ordering_CanAutoReceiveOrder),
                    ReceiveWithoutInvoiceNumber: !authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_Receiving_CanReceiveWithoutInvoiceNumber)
                };
                $scope.IsOrderReceiveIncomplete = function () {
                    return !$scope.SubmissionOptions.ReceiveTime ||
                        (!$scope.SubmissionOptions.InvoiceNumber && $scope.SubmissionOptions.AutoReceive && $scope.SubmissionOptions.ReceiveWithoutInvoiceNumber);
                };
                $scope.IsInvoiceNumberValid = function () {
                    return !$scope.SubmissionOptions.InvoiceNumber && $scope.SubmissionOptions.ReceiveWithoutInvoiceNumber && $scope.SubmissionOptions.AutoReceive;
                };
                $scope.ToggleAutoReceive = function () {
                    $scope.SubmissionOptions.AutoReceive = !$scope.SubmissionOptions.AutoReceive;
                };
                $scope.OpenReceiveDate = function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    $scope.SubmissionOptions.ShowReceiveDate = !$scope.SubmissionOptions.ShowReceiveDate;
                };
                $scope.Cancel = function () {
                    $modalInstance.dismiss();
                };
                $scope.Confirm = function () {
                    if ($scope.SubmissionOptions.InvoiceNumber == undefined) {
                        $scope.SubmissionOptions.InvoiceNumber = '';
                    }
                    $modalInstance.close($scope.SubmissionOptions);
                };
            }
            return FinishOrderController;
        }());
        Order.FinishOrderController = FinishOrderController;
        Core.NG.InventoryOrderModule.RegisterNamedController("FinishOrderController", FinishOrderController, Core.NG.$typedScope(), Core.NG.$modalInstance, Core.$translation, Core.Auth.$authService);
    })(Order = Inventory.Order || (Inventory.Order = {}));
})(Inventory || (Inventory = {}));
