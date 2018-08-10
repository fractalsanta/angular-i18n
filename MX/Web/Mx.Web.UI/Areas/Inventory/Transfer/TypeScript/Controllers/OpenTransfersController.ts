module Inventory.Transfer {
    "use strict";

    export interface IOpenTransfersControllerColumnDefinition {
        Title: string;
        Field?: string;
        SortHandler?: (item: Api.Models.ITransferDetail) => any;
        Width?: string
    }

    export interface IOpenTransfersControllerScope extends ng.IScope {
        OpenTransfers: IOpenTransferHeader[];
        StoreDisplayNames: string[];
        ShowDirection: boolean;

        Translations: Api.Models.IL10N;
        
        ViewTransfer(transferId: number): void;

        Header: Core.Directives.IGridHeader;
    }

    export interface IOpenTransferHeader extends Api.Models.ITransferHeader {
        DirectionName: string;
        StoreName: string;
        StatusName: string;
    }

    export class OpenTransfersController {
        private DateColumnIndex: number;

        constructor(
            private $scope: IOpenTransfersControllerScope,
            private $authService: Core.Auth.IAuthService,
            private $location: ng.ILocationService,
            translationService: Core.ITranslationService,
            notification: Core.IPopupMessageService,
            private $q: ng.IQService,
            private openTransfers: Api.ITransferService,
            private entityService: Core.Api.IEntityService,
            private formatter: Core.IFormatterService
            ) {
            var user = $authService.GetUser(),
                entityId = user.BusinessUser.MobileSettings.EntityId,
                showTransferOut = $authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_Transfers_CanCreateTransferOut),
                showTransferIn = $authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_Transfers_CanRequestTransferIn);

            this.$scope.StoreDisplayNames = [];

            translationService.GetTranslations()
                .then((result: Core.Api.Models.ITranslations): void => {
                    $scope.Translations = result.InventoryTransfer;
                    notification.SetPageTitle(result.InventoryTransfer.OpenTransfers);
                    this.SetShowDirection(showTransferOut && showTransferIn);

                    openTransfers.GetPendingTransfersFromStoreByEntityId(entityId, showTransferIn, showTransferOut)
                        .success((transfers: IOpenTransferHeader[]): void => {
                            var i: number = 0,
                                storeIds: number[] = [];

                            for (i; i < transfers.length; i += 1) {
                                if (transfers[i].Direction ===
                                    Inventory.Transfer.Api.Enums.TransferDirection.TransferOut) {
                                    transfers[i].DirectionName = $scope.Translations.To;
                                    transfers[i].StatusName = $scope.Translations.ReadyToApprove;
                                    storeIds.push(transfers[i].TransferToEntityId);
                                    this.SetShowDirection(true);
                                } else if (transfers[i].Direction ===
                                    Inventory.Transfer.Api.Enums.TransferDirection.TransferIn) {
                                    transfers[i].DirectionName = $scope.Translations.From;
                                    transfers[i].StatusName = $scope.Translations.ReadyToReceive;
                                    storeIds.push(transfers[i].TransferFromEntityId);
                                }
                            }

                            if (storeIds.length > 0) {
                                $scope.OpenTransfers = transfers;
                                this.PopulateLocationDisplayNames(storeIds);
                            } else {
                                $scope.OpenTransfers = [];
                            }

                            this.SetDefaultSort();
                        });
                });

            $scope.ViewTransfer = (transferId: number): void => {
                $location.path("/Inventory/Transfer/OpenTransfers/" + transferId);
            };
        }

        private SetShowDirection(show: boolean): void {
            this.$scope.ShowDirection = show;
            if (show) {
                this.DateColumnIndex = 2;
            } else {
                this.DateColumnIndex = 1;
            }
            this.SetColumnHeaders();
        }

        private SetColumnHeaders(): void {
            var performSort = (): void => {
                this.$scope.OpenTransfers = this.$scope.Header.DefaultSort(this.$scope.OpenTransfers);
            };
            var emptyDefaultSort = (data: any[]): any[]=> {
                return data;
            };
            if (this.$scope.ShowDirection) {
                this.$scope.Header = <Core.Directives.IGridHeader> {
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
            } else {
                this.$scope.Header = <Core.Directives.IGridHeader> {
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
        }

        private SetDefaultSort(): void {
            this.$scope.Header.Selected = this.$scope.Header.Columns[this.DateColumnIndex];
            this.$scope.Header.IsAscending = false;
            this.$scope.OpenTransfers = this.$scope.Header.DefaultSort(this.$scope.OpenTransfers);
        }

        private PopulateLocationDisplayNames(storeIds: number[]): ng.IPromise<string[]> {
            var deferred = this.$q.defer();

            this.entityService.GetEntitiesByIds(storeIds).success((stores: Core.Api.Models.IEntityModel[]): void => {

                _.each(stores, (store: Core.Api.Models.IEntityModel): void => {
                    this.$scope.StoreDisplayNames[store.Id] = this.formatter.CreateLocationDisplayName(store);
                });

                _.each(this.$scope.OpenTransfers, (transfer: IOpenTransferHeader): void => {
                    if (transfer.Direction === Inventory.Transfer.Api.Enums.TransferDirection.TransferIn) {
                        transfer.StoreName = this.$scope.StoreDisplayNames[transfer.TransferFromEntityId];
                    } else if (transfer.Direction === Inventory.Transfer.Api.Enums.TransferDirection.TransferOut) {
                        transfer.StoreName = this.$scope.StoreDisplayNames[transfer.TransferToEntityId];
                    }
                });

                deferred.resolve(this.$scope.StoreDisplayNames);
            });

            return deferred.promise;
        }
    }

    Core.NG.InventoryTransferModule.RegisterRouteController("OpenTransfers", "Templates/OpenTransfers.html", OpenTransfersController,
        Core.NG.$typedScope<IOpenTransfersControllerScope>(),
        Core.Auth.$authService,
        Core.NG.$location,
        Core.$translation,
        Core.$popupMessageService,
        Core.NG.$q,
        Inventory.Transfer.Api.$transferService,
        Core.Api.$entityService,
        Core.$formatterService);
}
