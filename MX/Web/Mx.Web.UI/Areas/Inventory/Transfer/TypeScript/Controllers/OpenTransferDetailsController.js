var Inventory;
(function (Inventory) {
    var Transfer;
    (function (Transfer) {
        "use strict";
        var OpenTransferDetailsController = (function () {
            function OpenTransferDetailsController($scope, $routeParams, authService, translation, $modal, $location, transferService, notification, entityService, formatter, $authService, $periodCloseService, constants) {
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
                this.$authService = $authService;
                this.$periodCloseService = $periodCloseService;
                this.constants = constants;
                this.Initialize();
                var currentUser = authService.GetUser();
                var entityId = currentUser.BusinessUser.MobileSettings.EntityId;
                this.GetTransfer(this._requestId, entityId);
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
                            controller: "Inventory.Count.UpdateCostTransfers",
                            resolve: {
                                IsJustReturnUpdated: function () { return false; }
                            }
                        }).result.then(function (result) {
                            if (result) {
                                _this.GetTransfer(_this._requestId, entityId).then(function () {
                                    _this.OpenDialog(true);
                                });
                            }
                        });
                    }
                    else {
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
                            senderTransferDetail.OnHand -= _this.GetUpdatedQuantity(previousTransferDetail.Quantity, result.Quantity);
                            $scope.PreviousTransfer = _.cloneDeep(_this.$scope.Transfer);
                        });
                    }
                };
                $scope.GetToOrFromText = function () {
                    var toOrFrom = "";
                    if ($scope.Translations) {
                        if ($scope.IsInbound()) {
                            toOrFrom = $scope.Translations.TransferFrom;
                        }
                        else {
                            toOrFrom = $scope.Translations.TransferTo;
                        }
                    }
                    return toOrFrom;
                };
                $scope.IsReceive = function () {
                    return $scope.IsInbound() && $scope.Transfer.RequestingEntityId === entityId;
                };
                $scope.IsInbound = function () {
                    if ($scope.Transfer) {
                        return $scope.Transfer.Direction === Transfer.Api.Enums.TransferDirection.TransferIn;
                    }
                    return false;
                };
                $scope.UpdatePeriodClosedStatus = function (fromLocationId, toLocationId) {
                    var currentDate = new Date();
                    $periodCloseService.GetPeriodLockStatus(fromLocationId, moment(currentDate).format(constants.InternalDateFormat))
                        .success(function (result) {
                        $scope.IsPeriodClosed = result.IsClosed && !$authService.CheckPermissionAllowance(Core.Api.Models.Task.Transfers_CanEditClosedPeriods);
                        if ($scope.IsPeriodClosed) {
                            _this.notification.ShowError(_this.$scope.Translations.PeriodClosed);
                        }
                        else {
                            $periodCloseService.GetPeriodLockStatus(toLocationId, moment(currentDate).format(constants.InternalDateFormat))
                                .success(function (result) {
                                $scope.IsPeriodClosed = result.IsClosed && !$authService.CheckPermissionAllowance(Core.Api.Models.Task.Transfers_CanEditClosedPeriods);
                                if ($scope.IsPeriodClosed) {
                                    _this.notification.ShowError(_this.$scope.Translations.PeriodClosed);
                                }
                            });
                        }
                    });
                };
            }
            OpenTransferDetailsController.prototype.Initialize = function () {
                var _this = this;
                this.$scope.Transfer = null;
                this._requestId = Number(this.$routeParams.TransferRequestId);
                this.$scope.IsReadOnly = false;
                this.$scope.Return = function () {
                    _this.$location.path("/Inventory/Transfer/OpenTransfers");
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
            OpenTransferDetailsController.prototype.GetTransfer = function (requestId, entityId) {
                var _this = this;
                return this.transferService.GetByTransferIdAndEntityId(requestId, entityId).then(function (transfer) {
                    if (transfer) {
                        _this.$scope.UpdatePeriodClosedStatus(transfer.SendingEntityId, transfer.RequestingEntityId);
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
                        if (_this.$scope.Transfer.Direction === Transfer.Api.Enums.TransferDirection.TransferIn) {
                            _this.SetResultingOnHandQuantitiesForTransferIn(transfer);
                        }
                        else {
                            _this.SetResultingOnHandQuantitiesForTransferOut(transfer);
                        }
                        _this.transferService.SetCurrentTransfer(transfer);
                        if (transfer.RequestingEntityId) {
                            _this.entityService.Get(transfer.RequestingEntityId)
                                .then(function (result) {
                                var requestLocation = result.data;
                                _this.$scope.RequestingLocationDisplayName = _this.formatter.CreateLocationDisplayName(requestLocation);
                            });
                        }
                        else {
                            console.info("Requesting Entity is zero, probable QA error - mismatched entities");
                        }
                        if (transfer.SendingEntityId) {
                            _this.entityService.Get(transfer.SendingEntityId)
                                .then(function (result) {
                                var sendingLocation = result.data;
                                _this.$scope.SendingLocationDisplayName = _this.formatter.CreateLocationDisplayName(sendingLocation);
                            });
                        }
                        else {
                            console.info("Sending Entity is zero, probable QA error - mismatched entities");
                        }
                    }
                });
            };
            OpenTransferDetailsController.prototype.OpenDialog = function (isApproval) {
                var _this = this;
                var filteredTransfer = _.cloneDeep(this.$scope.Transfer);
                filteredTransfer.Details = _.filter(this.$scope.Transfer.Details, function (item) {
                    return _this.HasQtyValuesChangedCompareToOriginalValues(item);
                });
                var instance = this.$modal.open({
                    templateUrl: "/Areas/Inventory/Transfer/Templates/ActionTransferDialog.html",
                    controller: "Inventory.Transfer.ActionTransferController",
                    resolve: {
                        transfer: function () { return filteredTransfer; },
                        isApproval: function () { return isApproval; },
                        transferDirection: function () { return _this.$scope.Transfer.Direction; }
                    }
                });
                instance.result.then(function () {
                    var isReceive = _this.$scope.IsReceive();
                    var message = isApproval ?
                        (isReceive ? _this.$scope.Translations.TransferReceived : _this.$scope.Translations.TransferApproved)
                        : _this.$scope.Translations.TransferDenied;
                    _this.$scope.Return();
                    _this.notification.ShowSuccess(message);
                });
            };
            OpenTransferDetailsController.prototype.HasQtyValuesChangedCompareToOriginalValues = function (transfer) {
                var result = transfer.OriginalTransferQty1 != transfer.TransferQty1 ||
                    transfer.OriginalTransferQty2 != transfer.TransferQty2 ||
                    transfer.OriginalTransferQty3 != transfer.TransferQty3 ||
                    transfer.OriginalTransferQty4 != transfer.TransferQty4;
                return result;
            };
            OpenTransferDetailsController.prototype.HasQtyValuesChangedCompareToPreviousValues = function (currentTransferDetail) {
                var previousTransferDetail = this.GetTransferDetailById(currentTransferDetail.ItemId);
                if (!previousTransferDetail) {
                    return true;
                }
                var result = currentTransferDetail.TransferQty1 != previousTransferDetail.TransferQty1 ||
                    currentTransferDetail.TransferQty2 != previousTransferDetail.TransferQty2 ||
                    currentTransferDetail.TransferQty3 != previousTransferDetail.TransferQty3 ||
                    currentTransferDetail.TransferQty4 != previousTransferDetail.TransferQty4;
                return result;
            };
            OpenTransferDetailsController.prototype.GetTransferDetailById = function (itemId) {
                return _.find(this.$scope.PreviousTransfer.Details, function (item) { return item.ItemId == itemId; });
            };
            OpenTransferDetailsController.prototype.GetUpdatedQuantity = function (previousQty, currentQty) {
                return currentQty - previousQty;
            };
            OpenTransferDetailsController.prototype.SetResultingOnHandQuantitiesForTransferOut = function (transfer) {
                if (transfer != null && transfer.Details != null) {
                    _.forEach(transfer.Details, function (item) {
                        item.OnHand = item.OnHand - item.Quantity;
                    });
                }
            };
            OpenTransferDetailsController.prototype.SetResultingOnHandQuantitiesForTransferIn = function (transfer) {
                if (transfer != null && transfer.Details != null) {
                    _.forEach(transfer.Details, function (item) {
                        item.OnHand = item.OnHand + item.Quantity;
                    });
                }
            };
            return OpenTransferDetailsController;
        }());
        Transfer.OpenTransferDetailsController = OpenTransferDetailsController;
        Core.NG.InventoryTransferModule.RegisterRouteController("OpenTransfers/:TransferRequestId", "Templates/OpenTransferDetails.html", OpenTransferDetailsController, Core.NG.$typedScope(), Core.NG.$typedStateParams(), Core.Auth.$authService, Core.$translation, Core.NG.$modal, Core.NG.$location, Transfer.transfersService, Core.$popupMessageService, Core.Api.$entityService, Core.$formatterService, Core.Auth.$authService, Workforce.PeriodClose.Api.$periodCloseService, Core.Constants);
    })(Transfer = Inventory.Transfer || (Inventory.Transfer = {}));
})(Inventory || (Inventory = {}));
