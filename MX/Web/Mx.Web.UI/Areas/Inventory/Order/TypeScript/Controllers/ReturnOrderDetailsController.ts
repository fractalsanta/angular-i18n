module Inventory.Order {
    "use strict";

    export interface IReturnOrderDetail extends Api.Models.IReceiveOrderDetail {
        PreviouslyReturn: number;
        ToBeReturned: number;
        ToBeReturnedGreaterThanReceived: boolean;
    }

    export class ReturnOrderDetailsController {
        private _canReturn: boolean;
        private _inDiscard: boolean;

        constructor(
            private $scope: IReturnOrderDetailsControllerScope,
            authService: Core.Auth.IAuthService,
            $location: ng.ILocationService,
            private confirmationService: Core.IConfirmationService,
            popupMessageService: Core.IPopupMessageService,
            translationService: Core.ITranslationService,
            $routeParams: IReturnOrderDetailsControllerRouteParams,
            receiveOrderService: IReceiveOrderService,
            returnOrderService: IReturnOrderService,
            private $timeoutService: ng.ITimeoutService) {

            this._inDiscard = false;

            var authorizedToAccessReturns = authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_Ordering_CanReturn);
            if (!authorizedToAccessReturns) {
                $location.path("/Core/Forbidden");
                return;
            }
            
            $scope.GoBack = (): void => {
                if (this.IsAnyReturnQuantityGreaterThanZero()) {
                    this.ConfirmBack().then((): void => {
                        $location.path("/Inventory/Order/Return");
                    });
                } else {
                    $location.path("/Inventory/Order/Return");
                }
            };

            $scope.ReturnSelected = (): void => {
                this.ConfirmSubmit().then((): void => {
                    _.forEach($scope.Model.ReceiveOrder.Items, (item: IReturnOrderDetail): void => {
                        item.ToBeReturned = Number(item.ToBeReturned);
                        item.PreviouslyReturn = item.ReturnedQuantity;
                        item.ReturnedQuantity = item.ToBeReturned;
                    });

                    returnOrderService.ReturnItemsInOrder($scope.Model.ReceiveOrder).success((response: boolean): void => {
                        if (response) {
                            popupMessageService.ShowSuccess($scope.Translation.ReturnSuccessful);
                            this.UpdateReturnOnPage();
                        } else {
                            popupMessageService.ShowError($scope.Translation.ErrorHasOccuredPleaseContactSysAdmin);
                        }
                    });
                });
            };

            $scope.ReturnEntireOrder = (): void => {
               this.ConfirmReturnAll().then((): void => {

                    returnOrderService.ReturnEntireOrder($scope.Model.ReceiveOrder).success((response: boolean): void => {

                        if (response) {
                            popupMessageService.ShowSuccess($scope.Translation.EntireOrderSuccessfullyReturned);
                            $location.path("/Inventory/Order/Return");
                        } else {
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

            $scope.$watch("Model.SearchFilter", (newValue: string): void => {
                this.FilterDetails(newValue);
            });

            translationService.GetTranslations().then((result: Core.Api.Models.ITranslations): void => {
                $scope.Translation = result.InventoryOrder;
                popupMessageService.SetPageTitle(result.InventoryOrder.ReturnOrderDetail);

                receiveOrderService.GetReceiveOrder(orderId).success((order: Api.Models.IReceiveOrder): void => {
                    var anyNotReceived = _.any(order.Items, (item: IReturnOrderDetail): boolean => { return !(item.Received); }),
                        canReturn = authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_Ordering_CanReturn);

                    _.forEach(order.Items, (item: IReturnOrderDetail): void => {
                        item.ToBeReturned = 0;
                        item.ToBeReturnedGreaterThanReceived = false;
                    });

                    $scope.Model.ReceiveOrder = order;

                    $scope.CanOrderBeReturned();

                    this._canReturn = (canReturn && $scope.Model.CanReturnOrder);

                    $scope.Model.IsReadOnly = ($scope.Model.ReceiveOrder.OrderStatus === 5 && !anyNotReceived);

                    this.FilterDetails($scope.Model.SearchFilter);
                });
            });

            $scope.ActionsEnabled = (): boolean => {
                if (receiveOrderService.IsOffline()) {
                    return false;
                }

                return this._canReturn;
            };

            $scope.CanOrderBeReturned = (): boolean => {
                $scope.Model.CanReturnOrder = _.any($scope.Model.ReceiveOrder.Items, (item: IReturnOrderDetail): boolean => {
                    return item.ReceivedQuantity > 0;
                });

                return $scope.Model.CanReturnOrder;
            };

            $scope.ReturnAmountGreaterThanToReceivedAmount = (item: IReturnOrderDetail): boolean => {
                if (item.ToBeReturned > item.ReceivedQuantity){
                    item.ToBeReturnedGreaterThanReceived = true;
                    return true;
                }

                item.ToBeReturnedGreaterThanReceived = false;
                return false;
            };

            $scope.ItemCanBeReturned = (item: IReturnOrderDetail): boolean => {
                return (item.ReceivedQuantity > 0);
            };

            $scope.SelectedCanBeReturned = (): boolean => {
                var anyReturnQuantityEntered = _.any($scope.Model.ReceiveOrder.Items, (item: IReturnOrderDetail): boolean => {
                    return (item.ToBeReturned > 0 && item.ToBeReturned <= item.ReceivedQuantity);
                });

                var returnQuantityExceedsReceivedQuantity = _.any($scope.Model.ReceiveOrder.Items, (item: IReturnOrderDetail): boolean => {
                    return (item.ToBeReturnedGreaterThanReceived);
                });

                return (anyReturnQuantityEntered && !returnQuantityExceedsReceivedQuantity);
            }
        }

        private IsAnyReturnQuantityGreaterThanZero(): boolean {
            var anyReturnQuantityEntered = _.any(this.$scope.Model.ReceiveOrder.Items, (item: IReturnOrderDetail): boolean => {
                return (item.ToBeReturned > 0);
            });

            return anyReturnQuantityEntered;
        }

        private UpdateReturnOnPage(): void {
            _.forEach(this.$scope.Model.ReceiveOrder.Items, (item: IReturnOrderDetail): void => {
                item.ReturnedQuantity = item.PreviouslyReturn + Number(item.ToBeReturned);
                item.ReceivedQuantity = item.ReceivedQuantity - Number(item.ToBeReturned);
                item.ToBeReturned = 0;
            });
        }

        private FilterDetails(filterText: string): void {
            if (!this.$scope.Model.ReceiveOrder) {
                return;
            }

            filterText = filterText.trim().toLocaleLowerCase();

            this.$scope.Model.CurrentOrderDetails = _.filter(this.$scope.Model.ReceiveOrder.Items, (detail: Api.Models.IReceiveOrderDetail): boolean => {
                return (!filterText ||
                    detail.Description.toLocaleLowerCase().indexOf(filterText) > -1 ||
                    detail.ItemCode.toLocaleLowerCase().indexOf(filterText) > -1 ||
                    detail.Unit.toLocaleLowerCase().indexOf(filterText) > -1);
            });
        }

        private ConfirmBack(): ng.IPromise<boolean> {
            return this.confirmationService.Confirm( {
                Title: this.$scope.Translation.DiscardChanges,
                Message: this.$scope.Translation.CancelConfirmation,
                ConfirmText: this.$scope.Translation.Confirm,
                ConfirmationType: Core.ConfirmationTypeEnum.Positive
            });
        }

        private ConfirmSubmit(): ng.IPromise<boolean> {

            var returnItems = _.where(this.$scope.Model.ReceiveOrder.Items, (item: IReturnOrderDetail): boolean => {
                return item.ToBeReturned > 0 && item.ReceivedQuantity >= item.ToBeReturned;
            });

            var message = this.$scope.Translation.ReturnConfirmationMessage.format( returnItems.length,this.$scope.Model.ReceiveOrder.OrderNumber);

            return this.confirmationService.Confirm({
                Title: this.$scope.Translation.ReturnConfirmation,
                Message: message,
                ConfirmText: this.$scope.Translation.Confirm,
                ConfirmationType: Core.ConfirmationTypeEnum.Positive
            });
        }

        private ConfirmReturnAll(): ng.IPromise<boolean> {

            var returnableItems = _.where(this.$scope.Model.ReceiveOrder.Items, (item: IReturnOrderDetail): boolean => {
                return item.ReceivedQuantity > 0;
            });

            var message = this.$scope.Translation.ReturnConfirmationMessage.format(returnableItems.length, this.$scope.Model.ReceiveOrder.OrderNumber);

            return this.confirmationService.Confirm({
                Title: this.$scope.Translation.ReturnEntireOrder,
                Message: message,
                ConfirmText: this.$scope.Translation.Confirm,
                ConfirmationType: Core.ConfirmationTypeEnum.Positive
            });
        }
    }

    Core.NG.InventoryOrderModule.RegisterRouteController("Return/Details/:OrderId", "Templates/ReturnOrderDetails.html",
        ReturnOrderDetailsController,
        Core.NG.$typedScope<IReturnOrderDetailsControllerScope>(),
        Core.Auth.$authService,
        Core.NG.$location,
        Core.$confirmationService,
        Core.$popupMessageService,
        Core.$translation,
        Core.NG.$typedStateParams<IReturnOrderDetailsControllerRouteParams>(),
        $receiveOrderService,
        $returnOrderService,
        Core.NG.$timeout
        );
} 
