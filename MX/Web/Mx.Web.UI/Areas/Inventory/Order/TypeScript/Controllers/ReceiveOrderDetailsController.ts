module Inventory.Order {
    "use strict";

    export class ReceiveOrderDetailsController {

        private _originalValues: number[];
        private _numericInputPattern: RegExp;

        private _initialItemValues: Api.Models.IReceiveOrderDetail[];
        private _currentCategory: Api.Models.ICategory;
               

        constructor(
            private $scope: IReceiveOrderDetailsControllerScope,
            private authService: Core.Auth.IAuthService,
            $routeParams: IReceiveOrderDetailsControllerRouteParams,
            translationService: Core.ITranslationService,
            private receiveOrderService: IReceiveOrderService,
            private $modal: ng.ui.bootstrap.IModalService,
            private confirmationService: Core.IConfirmationService,
            popupMessageService: Core.IPopupMessageService,
            private stateService: ng.ui.IStateService,
            constants: Core.IConstants,
            private periodCloseService: Workforce.PeriodClose.Api.IPeriodCloseService            
            ) {

            this._numericInputPattern = new RegExp(constants.NumericalInputBoxPattern);
          
            $scope.Return = (skipChanges?: boolean): void => {
                if (!skipChanges && this.PageIsDirty()) {
                    this.confirmationService.Confirm({
                        Title: this.$scope.Translation.DiscardChanges,
                        Message: this.$scope.Translation.CancelConfirmation,
                        ConfirmText: this.$scope.Translation.Confirm,
                        ConfirmationType: Core.ConfirmationTypeEnum.Positive
                    }).then((): void => {
                        this.stateService.go(Core.UiRouterState.DefaultMainDetailStates.Main);
                    });
                } else {
                    this.stateService.go(Core.UiRouterState.DefaultMainDetailStates.Main);
                }
            };

            var orderId = Number($routeParams.OrderId);

            if (isNaN(orderId)) {
                $scope.Return();
                return;
            }

            $scope.Model = {
                ReceiveOrder: null,
                IsReadOnly: true,
                SearchFilter: "",
                IsSelectAllItems: false,
                CanBePushedToTomorrow: false,
                CanCorrectReceive: false,
                CanChangeApplyDate: false,
                InCorrectMode: false,
                ShowAddItems: false,
                CanAddItems: authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_Receiving_CanAddItemToReceipt),
                TotalDeliveryCost: 0,
                TotalDeliveryCases: 0,
                IsPeriodClosed: false,
                CanEditPrice: authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_Receiving_EditPriceOnReceive),
                CanEditCorrectReceivePrice: authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_Receiving_EditPriceOnCorrectReceive)
            };

            translationService.GetTranslations().then((result: Core.Api.Models.ITranslations): void => {
                $scope.Translation = result.InventoryOrder;
                popupMessageService.SetPageTitle(result.InventoryOrder.ReceiveOrderDetail);

                this.GetReceiveOrder(orderId);
            });

            $scope.AddNewItems = () => {

                var addItemModel = <Inventory.IAddItemModel>{
                    ExistingCodes: _.map($scope.Model.ReceiveOrder.Items, (item) => item.ItemCode),
                    VendorId: $scope.Model.ReceiveOrder.VendorId
                }

                $modal.open({
                    templateUrl: "/Areas/Inventory/Templates/AddItems.html",
                    controller: "Inventory.AddItemsControllerOrderDetails",
                    resolve: {
                        addItemModel: () => { return addItemModel; }
                    }
                }).result.then((items: IAddItemOrdering[]) => {
                        var codes = _.map(items, (item) => item.Code);
                        return this.receiveOrderService.OrderAddItems(this.$scope.Model.ReceiveOrder.Id, codes);
                    }).then((newItems: Api.Models.IReceiveOrderDetail[]) => {
                        $.each(newItems, (item: number, detail: Api.Models.IReceiveOrderDetail) => {
                            this._initialItemValues[detail.Id] = angular.copy(detail);
                            $scope.Model.ReceiveOrder.Items.unshift(detail);
                            this.$scope.OriginalDetails.push(detail);
                        });
                    $scope.ClearCategoryFilter();
                });
            };

            $scope.ActionsEnabled = (): boolean => {
                if (receiveOrderService.IsOffline() || ($scope.Model.ReceiveOrder && $scope.Model.ReceiveOrder.HasBeenCopied)) {
                    return false;
                }

                return $scope.AreThereAnyItemsToReceive() ||
                    ($scope.InReceivingMode() && ($scope.Model.CanBePushedToTomorrow ||
                        $scope.Model.CanCorrectReceive ||
                        $scope.AreThereAnyItemsToReceive())) ||
                    $scope.ShowChangeApplyDate() ||
                    $scope.Model.InCorrectMode;
            };

            $scope.HasReceived = (): boolean => {
                return $scope.Model.ReceiveOrder && ($scope.Model.ReceiveOrder.OrderStatus === 5 || $scope.Model.ReceiveOrder.OrderStatus === 9);
            };

            $scope.IsItemReadOnly = (item: Api.Models.IReceiveOrderDetail): boolean => {
                return (item.Received || $scope.Model.ReceiveOrder.HasBeenCopied);
            };

            $scope.ItemCheckBoxDisable = (item: Api.Models.IReceiveOrderDetail): boolean => {
                return item.Received || $scope.Model.ReceiveOrder.HasBeenCopied || $scope.Model.InCorrectMode;
            };           

            $scope.HasASN = (): boolean => {
                return $scope.Model.ReceiveOrder && $scope.Model.ReceiveOrder.ReceivedShippingNotification;
            };

            $scope.ShowReceiveTextBox = (item: Api.Models.IReceiveOrderDetail): boolean => {
                return !$scope.Model.ReceiveOrder.HasBeenCopied && (!item.Received || (item.Received && $scope.Model.InCorrectMode));
            };

            $scope.NumericalInputBoxPattern = () => { return this._numericInputPattern; };

            $scope.AreThereAnyItemsToReceive = (): boolean => {
                if ($scope.Model.ReceiveOrder && $scope.Model.ReceiveOrder.Items && $scope.Model.ReceiveOrder.Items.length) {
                    return _.any($scope.Model.ReceiveOrder.Items,
                        (item: Api.Models.IReceiveOrderDetail): boolean => { return (item.IsReadyToBeReceived && !item.Received); });
                }

                return false;
            };

            $scope.SelectAllItems = (): void => {
                if (!$scope.Model.ReceiveOrder.HasBeenCopied && !$scope.Model.InCorrectMode) {
                    $scope.Model.IsSelectAllItems = !$scope.Model.IsSelectAllItems;
                    _.forEach($scope.Model.ReceiveOrder.Items, (item: Api.Models.IReceiveOrderDetail): void => {
                        if (!item.Received) {
                            item.IsReadyToBeReceived = $scope.Model.IsSelectAllItems;
                        }
                    });
                }
            };

            $scope.ItemCheckBoxClicked = (item: Api.Models.IReceiveOrderDetail): void => {
                if (!item.Received && !$scope.Model.ReceiveOrder.HasBeenCopied && !$scope.Model.InCorrectMode) {
                    item.IsReadyToBeReceived = !item.IsReadyToBeReceived;
                    $scope.Model.IsSelectAllItems = !_.any($scope.Model.ReceiveOrder.Items,
                        (x: Api.Models.IReceiveOrderDetail): boolean => { return !(x.IsReadyToBeReceived); });
                }
            };

            $scope.BeginCorrectReceive = (): void => {
                $scope.Model.InCorrectMode = true;

                this._originalValues = [];

                _.forEach($scope.Model.ReceiveOrder.Items, (item: Api.Models.IReceiveOrderDetail): void => {
                    if (item.Received) {
                        this._originalValues[item.Id] = item.ReceivedQuantity;
                    }
                });
            };

            $scope.FinishNow = (): void => {
                $modal.open({
                    templateUrl: "/Areas/Inventory/Order/Templates/FinishReceiveOrder.html",
                    controller: "Inventory.Order.FinishReceiveOrder",
                    windowClass: "narrow",
                    resolve: {
                        invoiceNumber: (): string => { return $scope.Model.ReceiveOrder.InvoiceNumber; }
                    }
                }).result.then((result: IFinishReceiveOrder): void => {
                    if (result != null) {
                        $scope.Model.ReceiveOrder.InvoiceNumber = result.InvoiceNumber;

                        receiveOrderService.FinishReceiveOrder(result.ApplyDate, $scope.Model.ReceiveOrder)
                            .then((response: boolean): void => {
                                if (response) {
                                    popupMessageService.ShowSuccess($scope.Translation.ReceiveOrderSubmitInProgress);
                                    $scope.Return(true);
                                } else {
                                    popupMessageService.ShowError($scope.Translation.ErrorHasOccuredPleaseContactSysAdmin);
                                }
                            });
                    }
                });
            };

            $scope.ChangeApplyDate = (): void => {
                $modal.open({
                    templateUrl: "/Areas/Inventory/Order/Templates/ChangeApplyDate.html",
                    controller: "Inventory.Order.ChangeApplyDate",
                    windowClass: "narrow"
                }).result.then((newApplyDate: Date): void => {
                        if (newApplyDate) {
                            receiveOrderService.ChangeApplyDate(newApplyDate, $scope.Model.ReceiveOrder)
                                .then((result: Api.Models.IChangeApplyDateResponse): void => {
                                    if (result.NewOrderId) {
                                        popupMessageService.ShowSuccess($scope.Translation.ChangeApplyDateSuccessful.format(result.NewOrderId));
                                        this.stateService.go(this.stateService.current.name, { OrderId: result.NewOrderId });
                                    } else if (result.IsPeriodClosed) {
                                        popupMessageService.ShowError($scope.Translation.PeriodIsClosed);
                                    }
                                    else {
                                        popupMessageService.ShowError($scope.Translation.ErrorHasOccuredPleaseContactSysAdmin);
                                    }
                                });
                        }
                    });
            };

            $scope.PushToTomorrow = (): void => {
                receiveOrderService.PushOrderToTomorrow($scope.Model.ReceiveOrder).then((): void => {
                    popupMessageService.ShowSuccess($scope.Translation.TheOrderHasBeenPushedToTomorrow.format($scope.Model.ReceiveOrder.OrderNumber));
                    $scope.Return();
                });
            };

            $scope.SaveChanges = (): void => {
                var containsErrors = _.any($scope.Model.ReceiveOrder.Items, function (value) {
                    return (!angular.isDefined(value.Price) || value.Price === null) || (!angular.isDefined(value.ReceivedQuantity) || value.ReceivedQuantity === null);
                });
                if (!containsErrors) {                                       
                    $scope.PeriodCloseStatusCheckAndSaveChanges();
                } else {
                    popupMessageService.ShowError($scope.Translation.InvalidHistoricalOrderForm);
                }

            };

            $scope.Change = (item: Api.Models.IReceiveOrderDetail) => {
                if (this.ItemChanged(item)) {
                    item.IsReadyToBeReceived = true;
                    $scope.UpdateTotals();
                }
            };

            $scope.UpdateTotals = () => {
                $scope.Model.TotalDeliveryCases = 0;
                $scope.Model.TotalDeliveryCost = 0;

                _.each(this.$scope.Model.ReceiveOrder.Items, (orderItem: Api.Models.IReceiveOrderDetail): void => {                  
                    $scope.Model.TotalDeliveryCases += Number(orderItem.ReceivedQuantity);
                    $scope.Model.TotalDeliveryCost += Number(orderItem.Price) * Number(orderItem.ReceivedQuantity);
                });
            };

            $scope.CancelChanges = (): void => {
                _.forEach($scope.Model.ReceiveOrder.Items, (item: Api.Models.IReceiveOrderDetail): void => {
                    if (item.Received && this._originalValues[item.Id] !== undefined) {
                        item.ReceivedQuantity = this._originalValues[item.Id];
                    }
                });

                this.ClearCorrectMode();
            };

            $scope.IsOfflineMode = (): boolean => {
                return receiveOrderService.IsOffline();
            };

            $scope.InReceivingMode = (): boolean => {
                return !($scope.Model.InCorrectMode);
            };

            $scope.ShowChangeApplyDate = (): boolean => {
                return $scope.InReceivingMode() && $scope.Model.CanChangeApplyDate;
            };

            $scope.ClearCategoryFilter = (): void => {
                $scope.CategoryText = $scope.Translation.AllCategories;

                this._currentCategory = null;
                this.FilterItems();
            };

            $scope.SetCategory = (category: Api.Models.ICategory): void => {
                $scope.CategoryText = category.Name;
                this._currentCategory = category;
                this.FilterItems();
            };

            $scope.PeriodCloseStatusCheckAndSaveChanges = (): void => {
               
                this.periodCloseService.GetPeriodLockStatus(authService.GetUser().BusinessUser.MobileSettings.EntityId, moment(receiveOrderService.GetLocalStoreDateTimeString()).format(constants.InternalDateFormat))
                    .success((result) => {                      
                        $scope.Model.IsPeriodClosed = (result.IsClosed && !this.authService.CheckPermissionAllowance(Core.Api.Models.Task.Orders_CanEditClosedPeriods)); 
                        if ($scope.Model.IsPeriodClosed) {
                            popupMessageService.ShowError(this.$scope.Translation.PeriodClosed);
                        }
                        else {
                            receiveOrderService.AdjustReceiveOrder($scope.Model.ReceiveOrder).then((response: boolean): void => {

                                if (response) {
                                    this.ClearCorrectMode();
                                    popupMessageService.ShowSuccess($scope.Translation.ReceiveAdjustmentSuccess);
                                } else {
                                    popupMessageService.ShowError($scope.Translation.ErrorHasOccuredPleaseContactSysAdmin);
                                }

                            });
                        }  
                    });
            };

            $scope.PriceInEditMode = (item: Api.Models.IReceiveOrderDetail): boolean => {

                if ($scope.Model.InCorrectMode) {
                    return $scope.Model.CanEditCorrectReceivePrice;
                }
                else {
                    if ($scope.IsItemReadOnly(item)) {
                        return false;
                    }
                    else {
                        return $scope.Model.CanEditPrice;
                    }
                }
            };
        }

        private ClearCorrectMode(): void {
            this.$scope.Model.InCorrectMode = false;

            _.each(this.$scope.Model.ReceiveOrder.Items, (item: Api.Models.IReceiveOrderDetail): void => {
                if (item.Received) {
                    this._initialItemValues[item.Id] = angular.copy(item);
                }
            });

            this._originalValues = [];
        }

        private GetReceiveOrder(orderId: number) {
            this.receiveOrderService.GetReceiveOrder(orderId).success((order: Api.Models.IReceiveOrder) => {

                this.$scope.Model.ReceiveOrder = order;
                this.$scope.OriginalDetails = order.Items.slice(0);

                var anyReceived = _.any(order.Items, (item: Api.Models.IReceiveOrderDetail): boolean => { return item.Received; }),
                    anyNotReceived = _.any(order.Items, (item: Api.Models.IReceiveOrderDetail): boolean => { return !(item.Received); }),
                    canCorrect = this.authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_Ordering_Receive_CanCorrect),
                    canChangeApplyDate = this.authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_Ordering_CanChangeApplyDate);

                this._initialItemValues = [];

                _.forEach(this.$scope.Model.ReceiveOrder.Items, (item: Api.Models.IReceiveOrderDetail):
                    void => {
                    this.SetDefaultReceivedDisplayQuantity(item);

                    this._initialItemValues[item.Id] = angular.copy(item);
                });

                this.$scope.Model.CanBePushedToTomorrow = order.CanBePushedToTomorrow;
                this.$scope.Model.CanCorrectReceive = (canCorrect && anyReceived);
                this.$scope.Model.CanChangeApplyDate = (anyReceived && canChangeApplyDate);
                this.$scope.Model.IsReadOnly = (this.$scope.HasReceived() && !anyNotReceived);
                this.$scope.Model.ShowAddItems = !anyReceived;
                this.$scope.UpdateTotals();

                this.$scope.ClearCategoryFilter();
            });
        }

        private SetDefaultReceivedDisplayQuantity(item: Api.Models.IReceiveOrderDetail) {
            if (!item.Received && !this.$scope.Model.ReceiveOrder.HasBeenCopied) {
                if (this.$scope.HasASN()) {
                    item.ReceivedQuantity = item.VendorShippedQuantity;
                } else {
                    item.ReceivedQuantity = item.OrderedQuantity;
                }
            }
        }

        private PageIsDirty(): boolean {
            return _.any(this.$scope.Model.ReceiveOrder.Items, (item: Api.Models.IReceiveOrderDetail):
                boolean => {

                var tempItem = this._initialItemValues[item.Id];

                return (tempItem.Price != item.Price ||
                    tempItem.ReceivedQuantity != item.ReceivedQuantity ||
                    tempItem.ReturnedQuantity != item.ReturnedQuantity);
            });
        }

        private ItemChanged(item: Api.Models.IReceiveOrderDetail): boolean {
            var tempItem = this._initialItemValues[item.Id];

            // warning item.Price is a string...
            return (tempItem.Price != item.Price ||
                tempItem.ReceivedQuantity !== item.ReceivedQuantity ||
                tempItem.ReturnedQuantity !== item.ReturnedQuantity);
            
        }

        private FilterItems(): void {
            var categoryTotals = {},
                totalItems = 0;

            if (!this.$scope.Model.ReceiveOrder) {
                return;
            }

            this.$scope.Model.ReceiveOrder.Items = _.filter(this.$scope.OriginalDetails, (entry: Api.Models.IReceiveOrderDetail): boolean => {
                if (categoryTotals[entry.CategoryId] === undefined) {
                    categoryTotals[entry.CategoryId] = 0;
                }

                totalItems += 1;
                categoryTotals [entry.CategoryId] += 1;

                if (this._currentCategory && entry.CategoryId !== this._currentCategory.CategoryId) {
                    return false;
                }

                return true;
            });

            _.each(this.$scope.Model.ReceiveOrder.Categories, (entry: Api.Models.ICategory): void => {
                entry.TotalItems = categoryTotals[entry.CategoryId];
            });

            this.$scope.TotalItems = totalItems;
        }       
    }

    export var receiveOrderDetailController = Core.NG.InventoryOrderModule.RegisterNamedController("ReceiveOrderDetailsController", ReceiveOrderDetailsController,
        Core.NG.$typedScope<IReceiveOrderDetailsControllerScope>(),
        Core.Auth.$authService,
        Core.NG.$typedStateParams<IReceiveOrderDetailsControllerRouteParams>(),
        Core.$translation,
        $receiveOrderService,
        Core.NG.$modal,
        Core.$confirmationService,
        Core.$popupMessageService,
        Core.NG.$state,
        Core.Constants,
        Workforce.PeriodClose.Api.$periodCloseService    
        );
}
