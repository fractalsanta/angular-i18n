var Inventory;
(function (Inventory) {
    (function (Transfer) {
        "use strict";

        var RequestTransferController = (function () {
            function RequestTransferController($scope, $authService, $routeParams, translationService, $modal, $location, notification, transferStoreService, requestedTransfers, entityService, formatter, confirmation, transferService) {
                var _this = this;
                this.$scope = $scope;
                this.$routeParams = $routeParams;
                this.$modal = $modal;
                this.notification = notification;
                this.requestedTransfers = requestedTransfers;
                this.transferService = transferService;
                var user = $authService.GetUser();

                $scope.Items = [];
                $scope.IsOutbound = $routeParams.Type === "create";

                this.fromLocationId = $scope.IsOutbound ? user.BusinessUser.MobileSettings.EntityId : Number($routeParams.FromLocationId);
                this.toLocationId = $scope.IsOutbound ? Number($routeParams.FromLocationId) : user.BusinessUser.MobileSettings.EntityId;

                entityService.Get(this.fromLocationId).success(function (location) {
                    $scope.RequestingLocationDisplayName = formatter.CreateLocationDisplayName(location);
                });

                entityService.Get(this.toLocationId).success(function (location) {
                    $scope.SendingLocationDisplayName = formatter.CreateLocationDisplayName(location);
                });

                translationService.GetTranslations().then(function (result) {
                    var translations = $scope.Translations = result.InventoryTransfer, title = _this.$scope.IsOutbound ? result.InventoryTransfer.CreateTransfer : result.InventoryTransfer.RequestTransfer;
                    notification.SetPageTitle(title);
                });

                var checkHasTransferItem = function (items) {
                    var i;

                    for (i = 0; i < items.length; i += 1) {
                        var item = items[i];
                        if (+item.TransferQty1 || +item.TransferQty2 || +item.TransferQty3 || +item.TransferQty4) {
                            return true;
                        }
                    }

                    return false;
                };

                var checkHasTransferItemWithoutQuantity = function (items) {
                    if (!$scope.HasTransferItem) {
                        return true;
                    }

                    var i;

                    for (i = 0; i < items.length; i += 1) {
                        var item = items[i];
                        if (!(+item.TransferQty1 || +item.TransferQty2 || +item.TransferQty3 || +item.TransferQty4)) {
                            return true;
                        }
                    }

                    return false;
                };

                var checkHasProperty = function (items, property) {
                    var i;

                    for (i = 0; i < items.length; i += 1) {
                        var item = items[i];
                        if (item[property]) {
                            return true;
                        }
                    }

                    return false;
                };

                var HasDataToTransfer = function (item) {
                    if (item.TransferQty1 || item.TransferQty2 || item.TransferQty3 || item.TransferQty4) {
                        return true;
                    }

                    return false;
                };

                $scope.$watch("Items", function () {
                    $scope.HasTransferItem = checkHasTransferItem($scope.Items);
                    $scope.HasTransferItemWithoutQuantity = checkHasTransferItemWithoutQuantity($scope.Items);
                    $scope.HasTransferUnit4 = checkHasProperty($scope.Items, "TransferUnit4");
                }, true);

                $scope.AddNewItems = function () {
                    $modal.open({
                        templateUrl: "Areas/Inventory/Transfer/Templates/TransferAddItems.html",
                        controller: "Inventory.Transfer.transferAddItemsController",
                        resolve: {
                            existingItems: function () {
                                return $scope.Items;
                            },
                            fromStoreId: function () {
                                return _this.fromLocationId;
                            },
                            toStoreId: function () {
                                return _this.toLocationId;
                            },
                            direction: function () {
                                return _this.$scope.IsOutbound ? 0 /* TransferOut */ : 1 /* TransferIn */;
                            }
                        }
                    }).result.then(function (result) {
                        $scope.Items = $scope.Items.concat(result);
                    });
                };

                $scope.RemoveItemAtIndex = function (index) {
                    $scope.Items.splice(index, 1);
                };

                $scope.SubmitRequest = function () {
                    var i = 0, itemsWithRequestedQty = [];

                    for (i; i < $scope.Items.length; i += 1) {
                        var currentItem = $scope.Items[i];
                        if (HasDataToTransfer(currentItem)) {
                            itemsWithRequestedQty.push(currentItem);
                        }
                    }

                    _this.Submit($scope.IsOutbound, itemsWithRequestedQty);
                };

                $scope.Return = function () {
                    $location.path("/Inventory/Transfer/TransferIn/" + _this.$routeParams.Type);
                };

                $scope.$on("$locationChangeStart", function (e, newUrl) {
                    var targetPath = newUrl.split("#");

                    if (!$scope.HasCancelledTransferRequest) {
                        if ($scope.HasTransferItem && targetPath.length > 1) {
                            $scope.DiscardNewRequest().then(function () {
                                $location.url(targetPath[1]);
                            });

                            e.preventDefault();
                        }
                    }
                });

                $scope.DiscardNewRequest = function () {
                    var promise = confirmation.Confirm({
                        Title: $scope.Translations.DiscardNewTransferConfirmation,
                        Message: $scope.Translations.TransferNotSubmitted,
                        ConfirmationType: 1 /* Positive */,
                        ConfirmText: $scope.Translations.Continue
                    }).then(function () {
                        $scope.HasCancelledTransferRequest = true;
                    });

                    return promise;
                };

                $scope.HasCancelledTransferRequest = false;
            }
            RequestTransferController.prototype.Submit = function (isOutbound, itemsWithRequestedQty) {
                var hasNoCostItems = [];

                if (isOutbound) {
                    hasNoCostItems = _.where(itemsWithRequestedQty, function (item) {
                        return !item.InventoryUnitCost;
                    });
                }

                if (hasNoCostItems.length) {
                    this.PostTransferAndUpdateNoCostItems(itemsWithRequestedQty, isOutbound, hasNoCostItems);
                } else {
                    this.PostTransfer(itemsWithRequestedQty, isOutbound);
                }
            };

            RequestTransferController.prototype.PostTransfer = function (itemsWithRequestedQty, isOutbound, updateCostItems) {
                var _this = this;
                var body = {
                    Items: itemsWithRequestedQty,
                    UpdateCosts: updateCostItems || [],
                    Direction: isOutbound ? 0 /* TransferOut */ : 1 /* TransferIn */
                };

                this.requestedTransfers.PostCreateInventoryTransfer(this.fromLocationId, this.toLocationId, body).success(function () {
                    _this.$scope.Items = [];
                    _this.$scope.Return();
                    _this.notification.ShowSuccess(_this.$scope.Translations.RequestSuccess);
                }).error(function () {
                    _this.notification.ShowError(_this.$scope.Translations.RequestError);
                });
            };

            RequestTransferController.prototype.PostTransferAndUpdateNoCostItems = function (itemsWithRequestedQty, isOutbound, updateCostItems) {
                var _this = this;
                var transfer = {
                    Details: []
                };

                _.each(updateCostItems, function (item) {
                    transfer.Details.push({
                        ItemId: item.Id,
                        Description: item.Description,
                        TransferCost: 0,
                        UnitCost: 0,
                        OuterUom: item.TransferUnit1,
                        TransferQty3: item.TransferQty3,
                        InventoryUnit: item.TransferUnit3
                    });
                });

                this.transferService.SetCurrentTransfer(transfer);

                this.$modal.open({
                    templateUrl: "/Areas/Inventory/Count/Templates/UpdateCost.html",
                    controller: "Inventory.Count.UpdateCostTransfers",
                    resolve: {
                        IsJustReturnUpdated: function () {
                            return true;
                        }
                    }
                }).result.then(function (result) {
                    _this.PostTransfer(itemsWithRequestedQty, isOutbound, result);
                });
            };
            return RequestTransferController;
        })();
        Transfer.RequestTransferController = RequestTransferController;

        Core.NG.InventoryTransferModule.RegisterRouteController("Request/:FromLocationId/:Type", "Templates/RequestTransfer.html", RequestTransferController, Core.NG.$typedScope(), Core.Auth.$authService, Core.NG.$typedStateParams(), Core.$translation, Core.NG.$modal, Core.NG.$location, Core.$popupMessageService, Transfer.Api.$transferStoreService, Transfer.Api.$transferService, Core.Api.$entityService, Core.$formatterService, Core.$confirmationService, Inventory.Transfer.transfersService);
    })(Inventory.Transfer || (Inventory.Transfer = {}));
    var Transfer = Inventory.Transfer;
})(Inventory || (Inventory = {}));
//# sourceMappingURL=RequestTransferController.js.map
