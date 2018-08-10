var Inventory;
(function (Inventory) {
    var Transfer;
    (function (Transfer) {
        "use strict";
        var OpenTransfersController = (function () {
            function OpenTransfersController($scope, $authService, $location, translationService, notification, $q, openTransfers, entityService, formatter) {
                var _this = this;
                this.$scope = $scope;
                this.$authService = $authService;
                this.$location = $location;
                this.$q = $q;
                this.openTransfers = openTransfers;
                this.entityService = entityService;
                this.formatter = formatter;
                var user = $authService.GetUser(), entityId = user.BusinessUser.MobileSettings.EntityId, showTransferOut = $authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_Transfers_CanCreateTransferOut), showTransferIn = $authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_Transfers_CanRequestTransferIn);
                this.$scope.StoreDisplayNames = [];
                translationService.GetTranslations()
                    .then(function (result) {
                    $scope.Translations = result.InventoryTransfer;
                    notification.SetPageTitle(result.InventoryTransfer.OpenTransfers);
                    _this.SetShowDirection(showTransferOut && showTransferIn);
                    openTransfers.GetPendingTransfersFromStoreByEntityId(entityId, showTransferIn, showTransferOut)
                        .success(function (transfers) {
                        var i = 0, storeIds = [];
                        for (i; i < transfers.length; i += 1) {
                            if (transfers[i].Direction ===
                                Inventory.Transfer.Api.Enums.TransferDirection.TransferOut) {
                                transfers[i].DirectionName = $scope.Translations.To;
                                transfers[i].StatusName = $scope.Translations.ReadyToApprove;
                                storeIds.push(transfers[i].TransferToEntityId);
                                _this.SetShowDirection(true);
                            }
                            else if (transfers[i].Direction ===
                                Inventory.Transfer.Api.Enums.TransferDirection.TransferIn) {
                                transfers[i].DirectionName = $scope.Translations.From;
                                transfers[i].StatusName = $scope.Translations.ReadyToReceive;
                                storeIds.push(transfers[i].TransferFromEntityId);
                            }
                        }
                        if (storeIds.length > 0) {
                            $scope.OpenTransfers = transfers;
                            _this.PopulateLocationDisplayNames(storeIds);
                        }
                        else {
                            $scope.OpenTransfers = [];
                        }
                        _this.SetDefaultSort();
                    });
                });
                $scope.ViewTransfer = function (transferId) {
                    $location.path("/Inventory/Transfer/OpenTransfers/" + transferId);
                };
            }
            OpenTransfersController.prototype.SetShowDirection = function (show) {
                this.$scope.ShowDirection = show;
                if (show) {
                    this.DateColumnIndex = 2;
                }
                else {
                    this.DateColumnIndex = 1;
                }
                this.SetColumnHeaders();
            };
            OpenTransfersController.prototype.SetColumnHeaders = function () {
                var _this = this;
                var performSort = function () {
                    _this.$scope.OpenTransfers = _this.$scope.Header.DefaultSort(_this.$scope.OpenTransfers);
                };
                var emptyDefaultSort = function (data) {
                    return data;
                };
                if (this.$scope.ShowDirection) {
                    this.$scope.Header = {
                        Columns: [
                            { Fields: ["Direction"], Title: this.$scope.Translations.Direction },
                            { Fields: ["StoreName"], Title: this.$scope.Translations.Store },
                            { Fields: ["CreateDate"], Title: this.$scope.Translations.Date },
                            { Fields: ["InitiatedBy"], Title: this.$scope.Translations.Creator },
                            { Fields: ["TransferQty"], Title: this.$scope.Translations.Items },
                            { Fields: ["StatusName"], Title: this.$scope.Translations.Status },
                            { Title: "" }
                        ],
                        OnSortEvent: performSort,
                        DefaultSort: emptyDefaultSort
                    };
                }
                else {
                    this.$scope.Header = {
                        Columns: [
                            { Fields: ["StoreName"], Title: this.$scope.Translations.Store },
                            { Fields: ["CreateDate"], Title: this.$scope.Translations.Date },
                            { Fields: ["InitiatedBy"], Title: this.$scope.Translations.Creator },
                            { Fields: ["TransferQty"], Title: this.$scope.Translations.Items },
                            { Fields: ["StatusName"], Title: this.$scope.Translations.Status },
                            { Title: "" }
                        ],
                        OnSortEvent: performSort,
                        DefaultSort: emptyDefaultSort
                    };
                }
            };
            OpenTransfersController.prototype.SetDefaultSort = function () {
                this.$scope.Header.Selected = this.$scope.Header.Columns[this.DateColumnIndex];
                this.$scope.Header.IsAscending = false;
                this.$scope.OpenTransfers = this.$scope.Header.DefaultSort(this.$scope.OpenTransfers);
            };
            OpenTransfersController.prototype.PopulateLocationDisplayNames = function (storeIds) {
                var _this = this;
                var deferred = this.$q.defer();
                this.entityService.GetEntitiesByIds(storeIds).success(function (stores) {
                    _.each(stores, function (store) {
                        _this.$scope.StoreDisplayNames[store.Id] = _this.formatter.CreateLocationDisplayName(store);
                    });
                    _.each(_this.$scope.OpenTransfers, function (transfer) {
                        if (transfer.Direction === Inventory.Transfer.Api.Enums.TransferDirection.TransferIn) {
                            transfer.StoreName = _this.$scope.StoreDisplayNames[transfer.TransferFromEntityId];
                        }
                        else if (transfer.Direction === Inventory.Transfer.Api.Enums.TransferDirection.TransferOut) {
                            transfer.StoreName = _this.$scope.StoreDisplayNames[transfer.TransferToEntityId];
                        }
                    });
                    deferred.resolve(_this.$scope.StoreDisplayNames);
                });
                return deferred.promise;
            };
            return OpenTransfersController;
        }());
        Transfer.OpenTransfersController = OpenTransfersController;
        Core.NG.InventoryTransferModule.RegisterRouteController("OpenTransfers", "Templates/OpenTransfers.html", OpenTransfersController, Core.NG.$typedScope(), Core.Auth.$authService, Core.NG.$location, Core.$translation, Core.$popupMessageService, Core.NG.$q, Inventory.Transfer.Api.$transferService, Core.Api.$entityService, Core.$formatterService);
    })(Transfer = Inventory.Transfer || (Inventory.Transfer = {}));
})(Inventory || (Inventory = {}));
