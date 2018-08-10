var Inventory;
(function (Inventory) {
    var Order;
    (function (Order) {
        "use strict";
        var ReturnOrderDetailsController = (function () {
            function ReturnOrderDetailsController($scope, authService, $location, confirmationService, popupMessageService, translationService, $routeParams, receiveOrderService, returnOrderService, $timeoutService) {
                var _this = this;
                this.$scope = $scope;
                this.confirmationService = confirmationService;
                this.$timeoutService = $timeoutService;
                this._inDiscard = false;
                var authorizedToAccessReturns = authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_Ordering_CanReturn);
                if (!authorizedToAccessReturns) {
                    $location.path("/Core/Forbidden");
                    return;
                }
                $scope.GoBack = function () {
                    if (_this.IsAnyReturnQuantityGreaterThanZero()) {
                        _this.ConfirmBack().then(function () {
                            $location.path("/Inventory/Order/Return");
                        });
                    }
                    else {
                        $location.path("/Inventory/Order/Return");
                    }
                };
                $scope.ReturnSelected = function () {
                    _this.ConfirmSubmit().then(function () {
                        _.forEach($scope.Model.ReceiveOrder.Items, function (item) {
                            item.ToBeReturned = Number(item.ToBeReturned);
                            item.PreviouslyReturn = item.ReturnedQuantity;
                            item.ReturnedQuantity = item.ToBeReturned;
                        });
                        returnOrderService.ReturnItemsInOrder($scope.Model.ReceiveOrder).success(function (response) {
                            if (response) {
                                popupMessageService.ShowSuccess($scope.Translation.ReturnSuccessful);
                                _this.UpdateReturnOnPage();
                            }
                            else {
                                popupMessageService.ShowError($scope.Translation.ErrorHasOccuredPleaseContactSysAdmin);
                            }
                        });
                    });
                };
                $scope.ReturnEntireOrder = function () {
                    _this.ConfirmReturnAll().then(function () {
                        returnOrderService.ReturnEntireOrder($scope.Model.ReceiveOrder).success(function (response) {
                            if (response) {
                                popupMessageService.ShowSuccess($scope.Translation.EntireOrderSuccessfullyReturned);
                                $location.path("/Inventory/Order/Return");
                            }
                            else {
                                popupMessageService.ShowError($scope.Translation.ErrorHasOccuredPleaseContactSysAdmin);
                            }
                        });
                    });
                };
                var orderId = Number($routeParams.OrderId);
                if (isNaN(orderId)) {
                    $scope.GoBack();
                    return;
                }
                $scope.Model = {
                    ReceiveOrder: null,
                    IsReadOnly: true,
                    SearchFilter: "",
                    CanReturnOrder: false,
                    CurrentOrderDetails: []
                };
                $scope.$watch("Model.SearchFilter", function (newValue) {
                    _this.FilterDetails(newValue);
                });
                translationService.GetTranslations().then(function (result) {
                    $scope.Translation = result.InventoryOrder;
                    popupMessageService.SetPageTitle(result.InventoryOrder.ReturnOrderDetail);
                    receiveOrderService.GetReceiveOrder(orderId).success(function (order) {
                        var anyNotReceived = _.any(order.Items, function (item) { return !(item.Received); }), canReturn = authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_Ordering_CanReturn);
                        _.forEach(order.Items, function (item) {
                            item.ToBeReturned = 0;
                            item.ToBeReturnedGreaterThanReceived = false;
                        });
                        $scope.Model.ReceiveOrder = order;
                        $scope.CanOrderBeReturned();
                        _this._canReturn = (canReturn && $scope.Model.CanReturnOrder);
                        $scope.Model.IsReadOnly = ($scope.Model.ReceiveOrder.OrderStatus === 5 && !anyNotReceived);
                        _this.FilterDetails($scope.Model.SearchFilter);
                    });
                });
                $scope.ActionsEnabled = function () {
                    if (receiveOrderService.IsOffline()) {
                        return false;
                    }
                    return _this._canReturn;
                };
                $scope.CanOrderBeReturned = function () {
                    $scope.Model.CanReturnOrder = _.any($scope.Model.ReceiveOrder.Items, function (item) {
                        return item.ReceivedQuantity > 0;
                    });
                    return $scope.Model.CanReturnOrder;
                };
                $scope.ReturnAmountGreaterThanToReceivedAmount = function (item) {
                    if (item.ToBeReturned > item.ReceivedQuantity) {
                        item.ToBeReturnedGreaterThanReceived = true;
                        return true;
                    }
                    item.ToBeReturnedGreaterThanReceived = false;
                    return false;
                };
                $scope.ItemCanBeReturned = function (item) {
                    return (item.ReceivedQuantity > 0);
                };
                $scope.SelectedCanBeReturned = function () {
                    var anyReturnQuantityEntered = _.any($scope.Model.ReceiveOrder.Items, function (item) {
                        return (item.ToBeReturned > 0 && item.ToBeReturned <= item.ReceivedQuantity);
                    });
                    var returnQuantityExceedsReceivedQuantity = _.any($scope.Model.ReceiveOrder.Items, function (item) {
                        return (item.ToBeReturnedGreaterThanReceived);
                    });
                    return (anyReturnQuantityEntered && !returnQuantityExceedsReceivedQuantity);
                };
            }
            ReturnOrderDetailsController.prototype.IsAnyReturnQuantityGreaterThanZero = function () {
                var anyReturnQuantityEntered = _.any(this.$scope.Model.ReceiveOrder.Items, function (item) {
                    return (item.ToBeReturned > 0);
                });
                return anyReturnQuantityEntered;
            };
            ReturnOrderDetailsController.prototype.UpdateReturnOnPage = function () {
                _.forEach(this.$scope.Model.ReceiveOrder.Items, function (item) {
                    item.ReturnedQuantity = item.PreviouslyReturn + Number(item.ToBeReturned);
                    item.ReceivedQuantity = item.ReceivedQuantity - Number(item.ToBeReturned);
                    item.ToBeReturned = 0;
                });
            };
            ReturnOrderDetailsController.prototype.FilterDetails = function (filterText) {
                if (!this.$scope.Model.ReceiveOrder) {
                    return;
                }
                filterText = filterText.trim().toLocaleLowerCase();
                this.$scope.Model.CurrentOrderDetails = _.filter(this.$scope.Model.ReceiveOrder.Items, function (detail) {
                    return (!filterText ||
                        detail.Description.toLocaleLowerCase().indexOf(filterText) > -1 ||
                        detail.ItemCode.toLocaleLowerCase().indexOf(filterText) > -1 ||
                        detail.Unit.toLocaleLowerCase().indexOf(filterText) > -1);
                });
            };
            ReturnOrderDetailsController.prototype.ConfirmBack = function () {
                return this.confirmationService.Confirm({
                    Title: this.$scope.Translation.DiscardChanges,
                    Message: this.$scope.Translation.CancelConfirmation,
                    ConfirmText: this.$scope.Translation.Confirm,
                    ConfirmationType: Core.ConfirmationTypeEnum.Positive
                });
            };
            ReturnOrderDetailsController.prototype.ConfirmSubmit = function () {
                var returnItems = _.where(this.$scope.Model.ReceiveOrder.Items, function (item) {
                    return item.ToBeReturned > 0 && item.ReceivedQuantity >= item.ToBeReturned;
                });
                var message = this.$scope.Translation.ReturnConfirmationMessage.format(returnItems.length, this.$scope.Model.ReceiveOrder.OrderNumber);
                return this.confirmationService.Confirm({
                    Title: this.$scope.Translation.ReturnConfirmation,
                    Message: message,
                    ConfirmText: this.$scope.Translation.Confirm,
                    ConfirmationType: Core.ConfirmationTypeEnum.Positive
                });
            };
            ReturnOrderDetailsController.prototype.ConfirmReturnAll = function () {
                var returnableItems = _.where(this.$scope.Model.ReceiveOrder.Items, function (item) {
                    return item.ReceivedQuantity > 0;
                });
                var message = this.$scope.Translation.ReturnConfirmationMessage.format(returnableItems.length, this.$scope.Model.ReceiveOrder.OrderNumber);
                return this.confirmationService.Confirm({
                    Title: this.$scope.Translation.ReturnEntireOrder,
                    Message: message,
                    ConfirmText: this.$scope.Translation.Confirm,
                    ConfirmationType: Core.ConfirmationTypeEnum.Positive
                });
            };
            return ReturnOrderDetailsController;
        }());
        Order.ReturnOrderDetailsController = ReturnOrderDetailsController;
        Core.NG.InventoryOrderModule.RegisterRouteController("Return/Details/:OrderId", "Templates/ReturnOrderDetails.html", ReturnOrderDetailsController, Core.NG.$typedScope(), Core.Auth.$authService, Core.NG.$location, Core.$confirmationService, Core.$popupMessageService, Core.$translation, Core.NG.$typedStateParams(), Order.$receiveOrderService, Order.$returnOrderService, Core.NG.$timeout);
    })(Order = Inventory.Order || (Inventory.Order = {}));
})(Inventory || (Inventory = {}));
