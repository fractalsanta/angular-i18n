var Inventory;
(function (Inventory) {
    var Transfer;
    (function (Transfer) {
        "use strict";
        var Task = Core.Api.Models.Task;
        var InitiateTransferController = (function () {
            function InitiateTransferController($scope, $authService, $routeParams, translationService, $modal, $location, notification, transferStoreService, requestedTransfers, entityService, formatter, confirmation, transferService, $timeout, popupMessageService, $periodCloseService, constants) {
                var _this = this;
                this.$scope = $scope;
                this.$routeParams = $routeParams;
                this.$modal = $modal;
                this.notification = notification;
                this.requestedTransfers = requestedTransfers;
                this.transferService = transferService;
                this.$timeout = $timeout;
                this.popupMessageService = popupMessageService;
                this.$periodCloseService = $periodCloseService;
                this.constants = constants;
                var user = $authService.GetUser();
                $scope.Items = [];
                $scope.IsOutbound = $routeParams.Type === "create";
                $scope.IsSubmitButtonDisabled = false;
                var canViewPage = ($scope.IsOutbound && $authService.CheckPermissionAllowance(Task.Inventory_Transfers_CanCreateTransferOut))
                    || (!$scope.IsOutbound && $authService.CheckPermissionAllowance(Task.Inventory_Transfers_CanRequestTransferIn));
                if (!canViewPage) {
                    $location.path("/Core/Forbidden");
                    return;
                }
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
                    var previousHasTransferUnit4 = $scope.HasTransferUnit4;
                    $scope.HasTransferUnit4 = checkHasProperty($scope.Items, "TransferUnit4");
                    if (previousHasTransferUnit4 === true && $scope.HasTransferUnit4 === false) {
                        $timeout(function () {
                            $(window).resize();
                        });
                    }
                }, true);
                $scope.AddNewItems = function () {
                    $modal.open({
                        templateUrl: "Areas/Inventory/Transfer/Templates/TransferAddItems.html",
                        controller: "Inventory.Transfer.transferAddItemsController",
                        resolve: {
                            existingItems: function () { return $scope.Items; },
                            fromStoreId: function () { return _this.fromLocationId; },
                            toStoreId: function () { return _this.toLocationId; },
                            direction: function () {
                                return _this.$scope.IsOutbound ?
                                    Transfer.Api.Enums.TransferDirection.TransferOut :
                                    Transfer.Api.Enums.TransferDirection.TransferIn;
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
                    if (!$scope.IsSubmitButtonDisabled) {
                        $scope.IsSubmitButtonDisabled = true;
                        var i = 0, itemsWithRequestedQty = [];
                        for (i; i < $scope.Items.length; i += 1) {
                            var currentItem = $scope.Items[i];
                            if (HasDataToTransfer(currentItem)) {
                                itemsWithRequestedQty.push(currentItem);
                            }
                        }
                        return _this.Submit($scope.IsOutbound, itemsWithRequestedQty)
                            .finally(function () {
                            $scope.IsSubmitButtonDisabled = false;
                        });
                    }
                };
                $scope.Return = function () {
                    $location.path("/Inventory/Transfer/TransferIn/" + _this.$routeParams.Type);
                };
                $scope.$on("$locationChangeStart", function (e, newUrl) {
                    var targetPath = newUrl.split("#");
                    if (!$scope.HasCancelledTransferRequest) {
                        if ($scope.Items.length && targetPath.length > 1) {
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
                        ConfirmationType: Core.ConfirmationTypeEnum.Positive,
                        ConfirmText: $scope.Translations.Continue
                    }).then(function () {
                        $scope.HasCancelledTransferRequest = true;
                    });
                    return promise;
                };
                $scope.UpdatePeriodClosedStatus = function (fromLocationId, toLocationId) {
                    var currentDate = new Date();
                    $periodCloseService.GetPeriodLockStatus(fromLocationId, moment(currentDate).format(constants.InternalDateFormat))
                        .success(function (result) {
                        $scope.IsPeriodClosed = result.IsClosed && !$authService.CheckPermissionAllowance(Core.Api.Models.Task.Transfers_CanEditClosedPeriods);
                        if ($scope.IsPeriodClosed) {
                            _this.popupMessageService.ShowError(_this.$scope.Translations.PeriodClosed);
                        }
                        else {
                            $periodCloseService.GetPeriodLockStatus(toLocationId, moment(currentDate).format(constants.InternalDateFormat))
                                .success(function (result) {
                                $scope.IsPeriodClosed = result.IsClosed && !$authService.CheckPermissionAllowance(Core.Api.Models.Task.Transfers_CanEditClosedPeriods);
                                if ($scope.IsPeriodClosed) {
                                    _this.popupMessageService.ShowError(_this.$scope.Translations.PeriodClosed);
                                }
                            });
                        }
                    });
                };
                $scope.HasCancelledTransferRequest = false;
                $scope.UpdatePeriodClosedStatus(this.fromLocationId, this.toLocationId);
            }
            InitiateTransferController.prototype.Submit = function (isOutbound, itemsWithRequestedQty) {
                var hasNoCostItems = [];
                if (isOutbound) {
                    hasNoCostItems = _.where(itemsWithRequestedQty, function (item) { return !item.InventoryUnitCost; });
                }
                if (hasNoCostItems.length) {
                    return this.PostTransferAndUpdateNoCostItems(itemsWithRequestedQty, isOutbound, hasNoCostItems);
                }
                else {
                    return this.PostTransfer(itemsWithRequestedQty, isOutbound);
                }
            };
            InitiateTransferController.prototype.PostTransfer = function (itemsWithRequestedQty, isOutbound, updateCostItems) {
                var _this = this;
                var body = {
                    Items: itemsWithRequestedQty,
                    UpdateCosts: updateCostItems || [],
                    Direction: isOutbound ? Transfer.Api.Enums.TransferDirection.TransferOut : Transfer.Api.Enums.TransferDirection.TransferIn
                };
                return this.requestedTransfers.PostCreateInventoryTransfer(this.fromLocationId, this.toLocationId, body)
                    .success(function () {
                    _this.$scope.Items = [];
                    _this.$scope.Return();
                    _this.notification.ShowSuccess(_this.$scope.Translations.TranferSubmitSuccess);
                }).error(function () {
                    _this.notification.ShowError(_this.$scope.Translations.TransferSubmitError);
                });
            };
            InitiateTransferController.prototype.PostTransferAndUpdateNoCostItems = function (itemsWithRequestedQty, isOutbound, updateCostItems) {
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
                        TransferQty1: item.TransferQty1,
                        TransferQty2: item.TransferQty2,
                        TransferQty3: item.TransferQty3,
                        TransferQty4: item.TransferQty4,
                        InventoryUnit: item.TransferUnit3
                    });
                });
                this.transferService.SetCurrentTransfer(transfer);
                return this.$modal.open({
                    templateUrl: "/Areas/Inventory/Count/Templates/UpdateCost.html",
                    controller: "Inventory.Count.UpdateCostTransfers",
                    resolve: {
                        IsJustReturnUpdated: function () { return true; }
                    }
                }).result.then(function (result) {
                    return _this.PostTransfer(itemsWithRequestedQty, isOutbound, result);
                });
            };
            return InitiateTransferController;
        }());
        Transfer.InitiateTransferController = InitiateTransferController;
        Transfer.inititateTransferController = Core.NG.InventoryTransferModule.RegisterRouteController("InitiateTransfer/:FromLocationId/:Type", "Templates/InitiateTransfer.html", InitiateTransferController, Core.NG.$typedScope(), Core.Auth.$authService, Core.NG.$typedStateParams(), Core.$translation, Core.NG.$modal, Core.NG.$location, Core.$popupMessageService, Transfer.Api.$transferStoreService, Transfer.Api.$transferService, Core.Api.$entityService, Core.$formatterService, Core.$confirmationService, Inventory.Transfer.transfersService, Core.NG.$timeout, Core.$popupMessageService, Workforce.PeriodClose.Api.$periodCloseService, Core.Constants);
    })(Transfer = Inventory.Transfer || (Inventory.Transfer = {}));
})(Inventory || (Inventory = {}));
