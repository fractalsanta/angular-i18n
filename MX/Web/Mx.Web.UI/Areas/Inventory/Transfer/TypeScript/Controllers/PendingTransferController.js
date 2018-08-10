var Inventory;
(function (Inventory) {
    (function (Transfer) {
        "use strict";

        var PendingTransferController = (function () {
            function PendingTransferController($scope, $routeParams, authService, translation, $modal, $location, transferService, notification, entityService, formatter) {
                var _this = this;
                this.$scope = $scope;
                this.$routeParams = $routeParams;
                this.authService = authService;
                this.translation = translation;
                this.$modal = $modal;
                this.$location = $location;
                this.transferService = transferService;
                this.notification = notification;
                this.entityService = entityService;
                this.formatter = formatter;
                this.Initialize();
                this.GetTransfer(this._requestId);

                var currentUser = authService.GetUser();
                var entityId = currentUser.BusinessUser.MobileSettings.EntityId;

                $scope.GetRequestTotal = function () {
                    var total = 0;
                    if ($scope.Transfer && $scope.Transfer.Details.length) {
                        _.each($scope.Transfer.Details, function (item) {
                            total += item.TransferCost;
                        });
                    }

                    return total;
                };

                $scope.Approve = function () {
                    if (_this.transferService.HasNoCostItems()) {
                        $modal.open({
                            templateUrl: "/Areas/Inventory/Count/Templates/UpdateCost.html",
                            controller: "Inventory.Count.UpdateCostTransfers"
                        }).result.then(function (result) {
                            if (result) {
                                _this.GetTransfer(_this._requestId).then(function () {
                                    _this.OpenDialog(true);
                                });
                            }
                        });
                    } else {
                        _this.OpenDialog(true);
                    }
                };

                $scope.Receive = function () {
                    _this.OpenDialog(true);
                };

                $scope.Deny = function () {
                    _this.OpenDialog(false);
                };

                $scope.OnRowSelect = function (e) {
                    var row = $(e.target).closest("tr"), index = row.index(), item = _this.$scope.Transfer.Details[index];

                    _this.$scope.SelectedItem = item;
                };

                $scope.UpdateDetails = function (senderTransferDetail) {
                    if (_this.HasQtyValuesChangedCompareToPreviousValues(senderTransferDetail)) {
                        transferService.PutTransferDetailWithUpdatedCostAndQuantity(senderTransferDetail).then(function (result) {
                            var previousTransferDetail = _this.GetTransferDetailById(senderTransferDetail.ItemId);

                            senderTransferDetail.Quantity = result.Quantity;
                            senderTransferDetail.TransferCost = result.TransferCost;
                            senderTransferDetail.OnHand -= _this.GetUpdatedQuantity(previousTransferDetail.Quantity, senderTransferDetail.Quantity);

                            $scope.PreviousTransfer = _.cloneDeep(_this.$scope.Transfer);
                        });
                    }
                };

                $scope.GetToOrFromText = function () {
                    var toOrFrom = "";

                    if ($scope.IsInbound() && $scope.Translations) {
                        toOrFrom = $scope.Translations.TransferFrom;
                    } else {
                        toOrFrom = $scope.Translations.TransferTo;
                    }

                    return toOrFrom;
                };

                $scope.IsInbound = function () {
                    var isInBound = false;

                    if ($scope.Transfer) {
                        if ($scope.Transfer.RequestingEntityId == entityId) {
                            isInBound = true;
                        } else {
                            isInBound = false;
                        }
                    }

                    return isInBound;
                };
            }
            PendingTransferController.prototype.Initialize = function () {
                var _this = this;
                this.$scope.Transfer = null;
                this._requestId = Number(this.$routeParams.TransferRequestId);
                this.$scope.IsReadOnly = false;

                this.$scope.Return = function () {
                    _this.$location.path("/Inventory/Transfer/TransferOut");
                };

                if (isNaN(this._requestId)) {
                    this.$scope.Return();
                    return;
                }

                this.translation.GetTranslations().then(function (result) {
                    var translations = _this.$scope.Translations = result.InventoryTransfer;
                    _this.notification.SetPageTitle(translations.TransferDetails);

                    _this.$scope.GridDefinitions = [
                        { Title: translations.Description + " (" + translations.ItemCode + ")", Field: "Description" },
                        { Title: translations.AltUnit1, Field: "TransferQty1" },
                        { Title: translations.AltUnit2, Field: "TransferQty2" },
                        { Title: translations.AltUnit3, Field: "TransferQty4" },
                        { Title: translations.BaseUnit, Field: "TransferQty3" }
                    ];
                });
            };

            PendingTransferController.prototype.GetTransfer = function (requestId) {
                var _this = this;
                return this.transferService.GetByTransferId(requestId).then(function (transfer) {
                    if (transfer) {
                        if (_this.$scope.Transfer != null && _this.$scope.Transfer.Details != null) {
                            _.forEach(transfer.Details, function (newTransferItem) {
                                var scopeItemElement = _.find(_this.$scope.Transfer.Details, function (scopeItem) {
                                    return scopeItem.ItemId == newTransferItem.ItemId && scopeItem.Id == newTransferItem.Id;
                                });
                                if (scopeItemElement != undefined) {
                                    newTransferItem.TransferQty = scopeItemElement.TransferQty;
                                    newTransferItem.TransferQty1 = scopeItemElement.TransferQty1;
                                    newTransferItem.TransferQty2 = scopeItemElement.TransferQty2;
                                    newTransferItem.TransferQty3 = scopeItemElement.TransferQty3;
                                    newTransferItem.TransferQty4 = scopeItemElement.TransferQty4;
                                }
                            });
                        }

                        _this.$scope.Transfer = transfer;
                        _this.$scope.PreviousTransfer = _.cloneDeep(_this.$scope.Transfer);
                        _this.transferService.SetCurrentTransfer(transfer);
                        _this.entityService.Get(transfer.RequestingEntityId).then(function (result) {
                            var requestLocation = result.data;
                            _this.$scope.RequestingLocationDisplayName = _this.formatter.CreateLocationDisplayName(requestLocation);
                        });
                        _this.entityService.Get(transfer.SendingEntityId).then(function (result) {
                            var sendingLocation = result.data;
                            _this.$scope.SendingLocationDisplayName = _this.formatter.CreateLocationDisplayName(sendingLocation);
                        });
                    }
                });
            };

            PendingTransferController.prototype.OpenDialog = function (isApproval) {
                var _this = this;
                var filteredTransfer = _.cloneDeep(this.$scope.Transfer);

                filteredTransfer.Details = _.filter(this.$scope.Transfer.Details, function (item) {
                    return _this.HasQtyValuesChangedCompareToOriginalValues(item);
                });

                var direction = this.$scope.IsInbound() ? 0 /* TransferOut */ : 1 /* TransferIn */;

                var instance = this.$modal.open({
                    templateUrl: "/Areas/Inventory/Transfer/Templates/ActionTransferDialog.html",
                    controller: "Inventory.Transfer.ActionTransferController",
                    resolve: {
                        transfer: function () {
                            return filteredTransfer;
                        },
                        isApproval: function () {
                            return isApproval;
                        },
                        transferDirection: function () {
                            return direction;
                        }
                    }
                });

                instance.result.then(function () {
                    _this.$scope.Return();
                    _this.notification.ShowSuccess(isApproval ? _this.$scope.Translations.TransferApproved : _this.$scope.Translations.TransferDenied);
                });
            };

            PendingTransferController.prototype.HasQtyValuesChangedCompareToOriginalValues = function (transfer) {
                var result = transfer.OriginalTransferQty1 != transfer.TransferQty1 || transfer.OriginalTransferQty2 != transfer.TransferQty2 || transfer.OriginalTransferQty3 != transfer.TransferQty3 || transfer.OriginalTransferQty4 != transfer.TransferQty4;

                return result;
            };

            PendingTransferController.prototype.HasQtyValuesChangedCompareToPreviousValues = function (currentTransferDetail) {
                var previousTransferDetail = this.GetTransferDetailById(currentTransferDetail.ItemId);

                if (!previousTransferDetail) {
                    return true;
                }

                var result = currentTransferDetail.TransferQty1 != previousTransferDetail.TransferQty1 || currentTransferDetail.TransferQty2 != previousTransferDetail.TransferQty2 || currentTransferDetail.TransferQty3 != previousTransferDetail.TransferQty3 || currentTransferDetail.TransferQty4 != previousTransferDetail.TransferQty4;

                return result;
            };

            PendingTransferController.prototype.GetTransferDetailById = function (itemId) {
                return _.find(this.$scope.PreviousTransfer.Details, function (item) {
                    return item.ItemId == itemId;
                });
            };

            PendingTransferController.prototype.GetUpdatedQuantity = function (previousQty, currentQty) {
                return currentQty - previousQty;
            };
            return PendingTransferController;
        })();
        Transfer.PendingTransferController = PendingTransferController;

        Core.NG.InventoryTransferModule.RegisterRouteController("Pending/:TransferRequestId", "Templates/PendingTransfer.html", PendingTransferController, Core.NG.$typedScope(), Core.NG.$typedStateParams(), Core.Auth.$authService, Core.$translation, Core.NG.$modal, Core.NG.$location, Transfer.transfersService, Core.$popupMessageService, Core.Api.$entityService, Core.$formatterService);
    })(Inventory.Transfer || (Inventory.Transfer = {}));
    var Transfer = Inventory.Transfer;
})(Inventory || (Inventory = {}));
//# sourceMappingURL=PendingTransferController.js.map
