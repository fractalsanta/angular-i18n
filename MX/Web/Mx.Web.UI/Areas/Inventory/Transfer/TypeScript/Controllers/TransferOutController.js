var Inventory;
(function (Inventory) {
    (function (Transfer) {
        "use strict";

        var TransferOutController = (function () {
            function TransferOutController($scope, $authService, $location, translationService, notification, $q, pendingTransfers, entityService, formatter) {
                var _this = this;
                this.$scope = $scope;
                this.$authService = $authService;
                this.$location = $location;
                this.$q = $q;
                this.pendingTransfers = pendingTransfers;
                this.entityService = entityService;
                this.formatter = formatter;
                var user = $authService.GetUser(), entityId = user.BusinessUser.MobileSettings.EntityId, showTransferOut = $authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_Transfers_CanCreateTransferOut), showTransferIn = $authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_Transfers_CanRequestTransferIn);

                this.$scope.StoreDisplayNames = [];

                this.$scope.ShowDirection = showTransferOut && showTransferIn;
                if (this.$scope.ShowDirection) {
                    this.DateColumnIndex = 2;
                } else {
                    this.DateColumnIndex = 1;
                }

                translationService.GetTranslations().then(function (result) {
                    var translations = $scope.Translations = result.InventoryTransfer;
                    notification.SetPageTitle(result.InventoryTransfer.OpenTransfers);

                    var performSort = function () {
                        $scope.PendingTransfers = $scope.Header.DefaultSort(_this.$scope.PendingTransfers);
                    };
                    var emptyDefaultSort = function (data) {
                        return data;
                    };

                    if ($scope.ShowDirection) {
                        $scope.Header = {
                            Columns: [
                                { Fields: ["Direction"], Title: translations.Direction },
                                { Fields: ["StoreName"], Title: translations.Store },
                                { Fields: ["RequestDate"], Title: translations.Date },
                                { Fields: ["RequestedBy"], Title: translations.Creator },
                                { Fields: ["TransferQty"], Title: translations.Items },
                                { Fields: ["StatusName"], Title: translations.Status },
                                { Title: "" }
                            ],
                            OnSortEvent: performSort,
                            DefaultSort: emptyDefaultSort
                        };
                    } else {
                        $scope.Header = {
                            Columns: [
                                { Fields: ["StoreName"], Title: translations.Store },
                                { Fields: ["RequestDate"], Title: translations.Date },
                                { Fields: ["RequestedBy"], Title: translations.Creator },
                                { Fields: ["TransferQty"], Title: translations.Items },
                                { Fields: ["StatusName"], Title: translations.Status },
                                { Title: "" }
                            ],
                            OnSortEvent: performSort,
                            DefaultSort: emptyDefaultSort
                        };
                    }
                });

                pendingTransfers.GetPendingTransfersFromStoreByEntityId(entityId, showTransferIn, showTransferOut).success(function (transfers) {
                    var i = 0, storeIds = [];

                    for (i; i < transfers.length; i += 1) {
                        if (entityId == transfers[i].TransferToEntityId) {
                            transfers[i].Direction = $scope.Translations.From;
                            transfers[i].StatusName = $scope.Translations.ReadyToReceive;
                            storeIds.push(transfers[i].TransferFromEntityId);
                        } else if (entityId == transfers[i].TransferFromEntityId) {
                            transfers[i].Direction = $scope.Translations.To;
                            transfers[i].StatusName = $scope.Translations.PendingApproval;
                            storeIds.push(transfers[i].TransferToEntityId);
                        }
                    }

                    if (storeIds.length > 0) {
                        $scope.PendingTransfers = transfers;
                        _this.PopulateLocationDisplayNames(storeIds);
                    } else {
                        $scope.PendingTransfers = [];
                    }

                    _this.SetDefaultSort();
                });

                $scope.ViewTransfer = function (transferId) {
                    $location.path("/Inventory/Transfer/Pending/" + transferId);
                };

                $scope.IsInBound = function (transfer) {
                    return (transfer.TransferToEntityId === entityId);
                };
            }
            TransferOutController.prototype.SetDefaultSort = function () {
                this.$scope.Header.Selected = this.$scope.Header.Columns[this.DateColumnIndex];
                this.$scope.Header.IsAscending = false;
                this.$scope.PendingTransfers = this.$scope.Header.DefaultSort(this.$scope.PendingTransfers);
            };

            TransferOutController.prototype.PopulateLocationDisplayNames = function (storeIds) {
                var _this = this;
                var deferred = this.$q.defer();

                this.entityService.GetEntitiesByIds(storeIds).success(function (stores) {
                    _.each(stores, function (store) {
                        _this.$scope.StoreDisplayNames[store.Id] = _this.formatter.CreateLocationDisplayName(store);
                    });

                    _.each(_this.$scope.PendingTransfers, function (transfer) {
                        if (transfer.Direction === _this.$scope.Translations.From) {
                            transfer.StoreName = _this.$scope.StoreDisplayNames[transfer.TransferFromEntityId];
                        } else if (transfer.Direction === _this.$scope.Translations.To) {
                            transfer.StoreName = _this.$scope.StoreDisplayNames[transfer.TransferToEntityId];
                        }
                    });

                    deferred.resolve(_this.$scope.StoreDisplayNames);
                });

                return deferred.promise;
            };
            return TransferOutController;
        })();
        Transfer.TransferOutController = TransferOutController;

        Core.NG.InventoryTransferModule.RegisterRouteController("TransferOut", "Templates/TransferOut.html", TransferOutController, Core.NG.$typedScope(), Core.Auth.$authService, Core.NG.$location, Core.$translation, Core.$popupMessageService, Core.NG.$q, Inventory.Transfer.Api.$transferService, Core.Api.$entityService, Core.$formatterService);
    })(Inventory.Transfer || (Inventory.Transfer = {}));
    var Transfer = Inventory.Transfer;
})(Inventory || (Inventory = {}));
//# sourceMappingURL=TransferOutController.js.map
