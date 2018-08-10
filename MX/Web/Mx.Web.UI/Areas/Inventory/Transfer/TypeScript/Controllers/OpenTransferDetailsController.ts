module Inventory.Transfer {
    "use strict";

    export interface IOpenTransferDetailsColumnDefinition {
        Title: string;
        Field?: string;
        SortHandler?: (item: Api.Models.ITransferDetail) => any;
    }

    export interface IOpenTransferDetailsParams {
        TransferRequestId: string;
    }

    export class OpenTransferDetailsController {

        private _requestId: number;

        Initialize() {

            this.$scope.Transfer = null;
            this._requestId = Number(this.$routeParams.TransferRequestId);
            this.$scope.IsReadOnly = false;

            this.$scope.Return = (): void => {
                this.$location.path("/Inventory/Transfer/OpenTransfers");
            };

            if (isNaN(this._requestId)) {
                this.$scope.Return();
                return;
            }

            this.translation.GetTranslations().then((result: Core.Api.Models.ITranslations): void => {
                var translations = this.$scope.Translations = result.InventoryTransfer;
                this.notification.SetPageTitle(translations.TransferDetails);

                this.$scope.GridDefinitions = [
                    { Title: translations.Description + " (" + translations.ItemCode + ")", Field: "Description" },
                    { Title: translations.AltUnit1, Field: "TransferQty1" },
                    { Title: translations.AltUnit2, Field: "TransferQty2" },
                    { Title: translations.AltUnit3, Field: "TransferQty4" },
                    { Title: translations.BaseUnit, Field: "TransferQty3" }
                ];
            });
        }

        constructor(
            private $scope: IOpenTransferDetailsControllerScope,
            private $routeParams: IOpenTransferDetailsParams,
            private authService: Core.Auth.IAuthService,
            private translation: Core.ITranslationService,
            private $modal: ng.ui.bootstrap.IModalService,
            private $location: ng.ILocationService,
            private transferService: ITransfersService,
            private notification: Core.IPopupMessageService,
            private entityService: Core.Api.IEntityService,
            private formatter: Core.IFormatterService,
            private $authService: Core.Auth.IAuthService,
            private $periodCloseService: Workforce.PeriodClose.Api.IPeriodCloseService,
            private constants: Core.IConstants
            ) {

            this.Initialize();

            var currentUser = authService.GetUser();
            var entityId = currentUser.BusinessUser.MobileSettings.EntityId;

            this.GetTransfer(this._requestId, entityId);

            $scope.GetRequestTotal = (): number => {
                var total = 0;
                if ($scope.Transfer && $scope.Transfer.Details.length) {
                    _.each($scope.Transfer.Details, (item: Api.Models.ITransferDetail): void => {
                        total += item.TransferCost;
                    });
                }

                return total;
            };

            $scope.Approve = (): void => {
                if (this.transferService.HasNoCostItems()) {
                    $modal.open({
                        templateUrl: "/Areas/Inventory/Count/Templates/UpdateCost.html",
                        controller: "Inventory.Count.UpdateCostTransfers",
                        resolve: {
                            IsJustReturnUpdated: (): boolean => { return false; }
                        }
                    }).result.then((result: boolean) => {
                            if (result) {
                                this.GetTransfer(this._requestId, entityId).then(() => {
                                    this.OpenDialog(true);
                                });
                            }
                        });
                } else {
                    this.OpenDialog(true);
                }
            };

            $scope.Receive = (): void => {
                this.OpenDialog(true);
            };

            $scope.Deny = (): void => {
                this.OpenDialog(false);
            };

            $scope.OnRowSelect = (e: Event): void => {
                var row = $(e.target).closest("tr"),
                    index = row.index(),
                    item = <Api.Models.ITransferDetail>this.$scope.Transfer.Details[index];

                this.$scope.SelectedItem = item;
            };

            $scope.UpdateDetails = (senderTransferDetail: Api.Models.ITransferDetail): void => {
                if (this.HasQtyValuesChangedCompareToPreviousValues(senderTransferDetail)) {
                    transferService.PutTransferDetailWithUpdatedCostAndQuantity(senderTransferDetail).then((result: Api.Models.ITransferDetail): void => {
                        var previousTransferDetail = this.GetTransferDetailById(senderTransferDetail.ItemId);

                        senderTransferDetail.Quantity = result.Quantity;
                        senderTransferDetail.TransferCost = result.TransferCost;
                        senderTransferDetail.OnHand -= this.GetUpdatedQuantity(previousTransferDetail.Quantity, result.Quantity);

                        $scope.PreviousTransfer = _.cloneDeep(this.$scope.Transfer);
                    });
                }
            };

            $scope.GetToOrFromText = (): string => {
                var toOrFrom = "";

                if ($scope.Translations) {
                    if ($scope.IsInbound()) {
                        toOrFrom = $scope.Translations.TransferFrom;
                    } else {
                        toOrFrom = $scope.Translations.TransferTo;
                    }
                }

                return toOrFrom;
            };

            $scope.IsReceive = (): boolean => {
                return $scope.IsInbound() && $scope.Transfer.RequestingEntityId === entityId;
            }

            $scope.IsInbound = (): boolean => {
                if ($scope.Transfer) {
                    return $scope.Transfer.Direction === Api.Enums.TransferDirection.TransferIn;
                }
                return false;
            };

            $scope.UpdatePeriodClosedStatus = (fromLocationId: number, toLocationId: number): void => {

                var currentDate = new Date();

                $periodCloseService.GetPeriodLockStatus(fromLocationId, moment(currentDate).format(constants.InternalDateFormat))
                    .success((result) => {

                        $scope.IsPeriodClosed = result.IsClosed && !$authService.CheckPermissionAllowance(Core.Api.Models.Task.Transfers_CanEditClosedPeriods);

                        if ($scope.IsPeriodClosed) {
                            this.notification.ShowError(this.$scope.Translations.PeriodClosed);
                        }
                        else {
                            //To Location
                            $periodCloseService.GetPeriodLockStatus(toLocationId, moment(currentDate).format(constants.InternalDateFormat))
                                .success((result) => {

                                    $scope.IsPeriodClosed = result.IsClosed && !$authService.CheckPermissionAllowance(Core.Api.Models.Task.Transfers_CanEditClosedPeriods);

                                    if ($scope.IsPeriodClosed) {
                                        this.notification.ShowError(this.$scope.Translations.PeriodClosed);
                                    }
                                });
                        }
                    });
            };
        }

        GetTransfer(requestId: number, entityId: number) {
            return this.transferService.GetByTransferIdAndEntityId(requestId, entityId).then((transfer: Api.Models.ITransfer): void => {
                if (transfer) {

                    this.$scope.UpdatePeriodClosedStatus(transfer.SendingEntityId, transfer.RequestingEntityId);

                    //restore the state
                    if (this.$scope.Transfer != null && this.$scope.Transfer.Details != null) {
                        _.forEach(transfer.Details, (newTransferItem: Api.Models.ITransferDetail) => {
                            var scopeItemElement = _.find(this.$scope.Transfer.Details, (scopeItem: Api.Models.ITransferDetail) => {
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

                    this.$scope.Transfer = transfer;
                    this.$scope.PreviousTransfer = _.cloneDeep(this.$scope.Transfer);
                    if (this.$scope.Transfer.Direction === Api.Enums.TransferDirection.TransferIn) {
                        this.SetResultingOnHandQuantitiesForTransferIn(transfer);
                    } else {
                        this.SetResultingOnHandQuantitiesForTransferOut(transfer);
                    }
                    this.transferService.SetCurrentTransfer(transfer);
                    if (transfer.RequestingEntityId) {
                        this.entityService.Get(transfer.RequestingEntityId)
                            .then((result) => {
                                var requestLocation = result.data;
                                this.$scope.RequestingLocationDisplayName = this.formatter.CreateLocationDisplayName(requestLocation);
                            });
                    } else {
                        console.info("Requesting Entity is zero, probable QA error - mismatched entities");
                    }
                    if (transfer.SendingEntityId) {
                        this.entityService.Get(transfer.SendingEntityId)
                            .then((result) => {
                                var sendingLocation = result.data;
                                this.$scope.SendingLocationDisplayName = this.formatter.CreateLocationDisplayName(sendingLocation);
                            });
                    } else {
                        console.info("Sending Entity is zero, probable QA error - mismatched entities");
                    }
                }
            });
        }

        OpenDialog(isApproval: boolean): void {
            var filteredTransfer = _.cloneDeep(this.$scope.Transfer);

            filteredTransfer.Details = _.filter(this.$scope.Transfer.Details, (item: Api.Models.ITransferDetail): boolean => {
                return this.HasQtyValuesChangedCompareToOriginalValues(item);
            });

            var instance = this.$modal.open(<ng.ui.bootstrap.IModalSettings>{
                templateUrl: "/Areas/Inventory/Transfer/Templates/ActionTransferDialog.html",
                controller: "Inventory.Transfer.ActionTransferController",
                resolve: {
                    transfer: (): Api.Models.ITransfer => { return filteredTransfer; },
                    isApproval: (): boolean => { return isApproval; },
                    transferDirection: (): Api.Enums.TransferDirection => { return this.$scope.Transfer.Direction; },
                }
            });

            instance.result.then((): void => {
                var isReceive = this.$scope.IsReceive();
                var message =
                    isApproval ?
                    (isReceive ? this.$scope.Translations.TransferReceived : this.$scope.Translations.TransferApproved)
                    : this.$scope.Translations.TransferDenied;

                this.$scope.Return();
                this.notification.ShowSuccess(message);
            });
        }

        HasQtyValuesChangedCompareToOriginalValues(transfer: Api.Models.ITransferDetail): boolean {
            var result = transfer.OriginalTransferQty1 != transfer.TransferQty1 ||
                transfer.OriginalTransferQty2 != transfer.TransferQty2 ||
                transfer.OriginalTransferQty3 != transfer.TransferQty3 ||
                transfer.OriginalTransferQty4 != transfer.TransferQty4;

            return result;
        }


        HasQtyValuesChangedCompareToPreviousValues(currentTransferDetail: Api.Models.ITransferDetail): boolean {
            var previousTransferDetail = this.GetTransferDetailById(currentTransferDetail.ItemId);

            if (!previousTransferDetail) {
                return true;
            }

            var result = currentTransferDetail.TransferQty1 != previousTransferDetail.TransferQty1 ||
                currentTransferDetail.TransferQty2 != previousTransferDetail.TransferQty2 ||
                currentTransferDetail.TransferQty3 != previousTransferDetail.TransferQty3 ||
                currentTransferDetail.TransferQty4 != previousTransferDetail.TransferQty4;

            return result;
        }

        GetTransferDetailById(itemId: number): Api.Models.ITransferDetail {
            return _.find(this.$scope.PreviousTransfer.Details, item => item.ItemId == itemId);
        }

        GetUpdatedQuantity(previousQty: number, currentQty: number): number {

            return currentQty - previousQty;
        }

        SetResultingOnHandQuantitiesForTransferOut(transfer: Api.Models.ITransfer) {
            if (transfer != null && transfer.Details != null) {
                _.forEach(transfer.Details, (item: Api.Models.ITransferDetail) => {
                    item.OnHand = item.OnHand - item.Quantity;
                });
            }
        }

        SetResultingOnHandQuantitiesForTransferIn(transfer: Api.Models.ITransfer) {
            if (transfer != null && transfer.Details != null) {
                _.forEach(transfer.Details, (item: Api.Models.ITransferDetail) => {
                    item.OnHand = item.OnHand + item.Quantity;
                });
            }
        }
    }

    Core.NG.InventoryTransferModule.RegisterRouteController("OpenTransfers/:TransferRequestId", "Templates/OpenTransferDetails.html", OpenTransferDetailsController,
        Core.NG.$typedScope<IOpenTransferDetailsControllerScope>(),
        Core.NG.$typedStateParams<IOpenTransferDetailsParams>(),
        Core.Auth.$authService,
        Core.$translation,
        Core.NG.$modal,
        Core.NG.$location,
        transfersService,
        Core.$popupMessageService,
        Core.Api.$entityService,
        Core.$formatterService,
        Core.Auth.$authService,
        Workforce.PeriodClose.Api.$periodCloseService,
        Core.Constants);
}