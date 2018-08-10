module Inventory.Transfer {
    "use strict";

    import Task = Core.Api.Models.Task;

    export interface IInitiateTransferControllerScope extends ng.IScope {
        Translations: Api.Models.IL10N;
        Items: Api.Models.ITransferableItem[];
        Transfer: Api.Models.ITransfer;
        RequestingLocationDisplayName: string;
        SendingLocationDisplayName: string;
        Ascending: boolean;
        HasTransferItem: boolean;
        HasTransferItemWithoutQuantity: boolean;
        AddNewItems(): void;
        RemoveItemAtIndex(index: number): void;
        HasTransferUnit4: boolean;

        SubmitRequest(): ng.IHttpPromise<{}>;
        Return(): void;
        DiscardNewRequest(): ng.IPromise<void>;
        HasCancelledTransferRequest: boolean;
        IsOutbound: boolean;
        IsPeriodClosed: boolean;
        IsSubmitButtonDisabled: boolean;

        UpdatePeriodClosedStatus(fromLocationId: number, toLocationId: number): void;
    }

    export interface IInitiateTransferRouteParams {
        FromLocationId: string;
        Type: string;
    }

    export class InitiateTransferController {
        private fromLocationId: number;
        private toLocationId: number;

        constructor(
            private $scope: IInitiateTransferControllerScope,
            $authService: Core.Auth.IAuthService,
            private $routeParams: IInitiateTransferRouteParams,
            translationService: Core.ITranslationService,
            private $modal: ng.ui.bootstrap.IModalService,
            $location: ng.ILocationService,
            private notification: Core.IPopupMessageService,
            transferStoreService: Api.ITransferStoreService,
            private requestedTransfers: Api.ITransferService,
            entityService: Core.Api.IEntityService,
            formatter: Core.IFormatterService,
            confirmation: Core.IConfirmationService,
            private transferService: ITransfersService,
            private $timeout: ng.ITimeoutService,
            private popupMessageService: Core.IPopupMessageService,
            private $periodCloseService: Workforce.PeriodClose.Api.IPeriodCloseService,
            private constants: Core.IConstants
            ) {

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

            entityService.Get(this.fromLocationId).success((location: Core.Api.Models.IEntityModel): void => {

                $scope.RequestingLocationDisplayName = formatter.CreateLocationDisplayName(location);
            });

            entityService.Get(this.toLocationId).success((location: Core.Api.Models.IEntityModel): void => {

                $scope.SendingLocationDisplayName = formatter.CreateLocationDisplayName(location);
            });

            translationService.GetTranslations().then((result: Core.Api.Models.ITranslations): void => {
                var translations = $scope.Translations = result.InventoryTransfer,
                    title: string = this.$scope.IsOutbound ? result.InventoryTransfer.CreateTransfer : result.InventoryTransfer.RequestTransfer;
                notification.SetPageTitle(title);
            });

            var checkHasTransferItem = (items: Api.Models.ITransferableItem[]): boolean => {
                var i;

                for (i = 0; i < items.length; i += 1) {
                    var item = items[i];
                    if (+item.TransferQty1 || +item.TransferQty2 || +item.TransferQty3 || +item.TransferQty4) {
                        return true;
                    }
                }

                return false;
            };

            var checkHasTransferItemWithoutQuantity = (items: Api.Models.ITransferableItem[]): boolean => {
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

            var checkHasProperty = (items: Api.Models.ITransferableItem[], property: string): boolean => {
                var i;

                for (i = 0; i < items.length; i += 1) {
                    var item: Api.Models.ITransferableItem = items[i];
                    if (item[property]) {
                        return true;
                    }
                }

                return false;
            };

            var HasDataToTransfer = (item: Api.Models.ITransferableItem): boolean => {

                if (item.TransferQty1 || item.TransferQty2 || item.TransferQty3 || item.TransferQty4) {
                    return true;
                }

                return false;
            };

            $scope.$watch("Items", (): void => {
                $scope.HasTransferItem = checkHasTransferItem($scope.Items);
                $scope.HasTransferItemWithoutQuantity = checkHasTransferItemWithoutQuantity($scope.Items);
                var previousHasTransferUnit4 = $scope.HasTransferUnit4;
                $scope.HasTransferUnit4 = checkHasProperty($scope.Items, "TransferUnit4");
                if (previousHasTransferUnit4 === true && $scope.HasTransferUnit4 === false) {
                    $timeout(() => {
                        $(window).resize();
                    });
                }
            }, true);

            $scope.AddNewItems = (): void => {
                $modal.open({
                    templateUrl: "Areas/Inventory/Transfer/Templates/TransferAddItems.html",
                    controller: "Inventory.Transfer.transferAddItemsController",
                    resolve: {
                        existingItems: (): Api.Models.ITransferableItem[]=> { return $scope.Items; },
                        fromStoreId: (): number => { return this.fromLocationId; },
                        toStoreId: (): number => { return this.toLocationId; },
                        direction: (): Api.Enums.TransferDirection => {
                            return this.$scope.IsOutbound ?
                                Api.Enums.TransferDirection.TransferOut :
                                Api.Enums.TransferDirection.TransferIn;
                        }
                    }
                }).result.then((result: Api.Models.ITransferableItem[]): void => {
                        $scope.Items = $scope.Items.concat(result);
                    });
            };

            $scope.RemoveItemAtIndex = (index: number): void => {
                $scope.Items.splice(index, 1);
            };

            $scope.SubmitRequest = (): ng.IHttpPromise<{}> => {

                if (!$scope.IsSubmitButtonDisabled) {
                    $scope.IsSubmitButtonDisabled = true;
                    var i: number = 0,
                        itemsWithRequestedQty: Api.Models.ITransferableItem[] = [];

                    for (i; i < $scope.Items.length; i += 1) {
                        var currentItem = $scope.Items[i];
                        if (HasDataToTransfer(currentItem)) {
                            itemsWithRequestedQty.push(currentItem);
                        }
                    }

                    return this.Submit($scope.IsOutbound, itemsWithRequestedQty)
                        .finally(() => {
                            $scope.IsSubmitButtonDisabled = false;
                        });
                }
            };

            $scope.Return = (): void => {
                $location.path("/Inventory/Transfer/TransferIn/" + this.$routeParams.Type);
            };

            $scope.$on("$locationChangeStart", (e: ng.IAngularEvent, newUrl: string): void => {
                var targetPath = newUrl.split("#");

                if (!$scope.HasCancelledTransferRequest) {
                    if ($scope.Items.length && targetPath.length > 1) {
                        $scope.DiscardNewRequest().then((): void => {
                            $location.url(targetPath[1]);
                        });

                        e.preventDefault();
                    }
                }
            });

            $scope.DiscardNewRequest = (): ng.IPromise<any> => {

                var promise = confirmation.Confirm({
                    Title: $scope.Translations.DiscardNewTransferConfirmation,
                    Message: $scope.Translations.TransferNotSubmitted,
                    ConfirmationType: Core.ConfirmationTypeEnum.Positive,
                    ConfirmText: $scope.Translations.Continue
                }).then((): void => {
                        $scope.HasCancelledTransferRequest = true;
                    });

                return promise;
            };

            $scope.UpdatePeriodClosedStatus = (fromLocationId: number, toLocationId: number): void => {

                var currentDate = new Date();

                $periodCloseService.GetPeriodLockStatus(fromLocationId, moment(currentDate).format(constants.InternalDateFormat))
                    .success((result) => {

                        $scope.IsPeriodClosed = result.IsClosed && !$authService.CheckPermissionAllowance(Core.Api.Models.Task.Transfers_CanEditClosedPeriods);

                        if ($scope.IsPeriodClosed) {
                            this.popupMessageService.ShowError(this.$scope.Translations.PeriodClosed);
                        }
                        else {
                            //To Location
                            $periodCloseService.GetPeriodLockStatus(toLocationId, moment(currentDate).format(constants.InternalDateFormat))
                                .success((result) => {

                                    $scope.IsPeriodClosed = result.IsClosed && !$authService.CheckPermissionAllowance(Core.Api.Models.Task.Transfers_CanEditClosedPeriods);

                                    if ($scope.IsPeriodClosed) {
                                        this.popupMessageService.ShowError(this.$scope.Translations.PeriodClosed);
                                    }
                                });
                        }
                    });
            };

            $scope.HasCancelledTransferRequest = false;

            $scope.UpdatePeriodClosedStatus(this.fromLocationId, this.toLocationId);
        }

        Submit(isOutbound: boolean, itemsWithRequestedQty: Api.Models.ITransferableItem[]) {
            var hasNoCostItems: Api.Models.ITransferableItem[] = [];

            if (isOutbound) {
                hasNoCostItems = _.where(itemsWithRequestedQty, (item: Api.Models.ITransferableItem) => !item.InventoryUnitCost);
            }

            if (hasNoCostItems.length) {
                return this.PostTransferAndUpdateNoCostItems(itemsWithRequestedQty, isOutbound, hasNoCostItems);

            } else {
                return this.PostTransfer(itemsWithRequestedQty, isOutbound);
            }
        }

        PostTransfer(itemsWithRequestedQty: Api.Models.ITransferableItem[], isOutbound: boolean, updateCostItems?: Count.Api.Models.IUpdateCostViewModel[]) {
            var body = <Api.Models.ITransferItemsRequest>{
                Items: itemsWithRequestedQty,
                UpdateCosts: updateCostItems || [],
                Direction: isOutbound ? Api.Enums.TransferDirection.TransferOut : Api.Enums.TransferDirection.TransferIn
            };

            return this.requestedTransfers.PostCreateInventoryTransfer(this.fromLocationId, this.toLocationId, body)
                .success((): void => {
                    this.$scope.Items = [];
                    this.$scope.Return();
                    this.notification.ShowSuccess(this.$scope.Translations.TranferSubmitSuccess);
                }).error((): void => {
                    this.notification.ShowError(this.$scope.Translations.TransferSubmitError);
                });
        }

        PostTransferAndUpdateNoCostItems(itemsWithRequestedQty: Api.Models.ITransferableItem[], isOutbound: boolean, updateCostItems: Api.Models.ITransferableItem[]) {
            var transfer: Api.Models.ITransfer = <Api.Models.ITransfer>{
                Details: []
            };

            _.each(updateCostItems, (item: Api.Models.ITransferableItem): void => {
                transfer.Details.push(<Api.Models.ITransferDetail>{
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
                    IsJustReturnUpdated: (): boolean => { return true; }
                }
            }).result.then((result: Count.Api.Models.IUpdateCostViewModel[]) => {
                return this.PostTransfer(itemsWithRequestedQty, isOutbound, result);
            });
        }
    }

    export var inititateTransferController = Core.NG.InventoryTransferModule.RegisterRouteController("InitiateTransfer/:FromLocationId/:Type", "Templates/InitiateTransfer.html", InitiateTransferController,
        Core.NG.$typedScope<IInitiateTransferControllerScope>(),
        Core.Auth.$authService,
        Core.NG.$typedStateParams<IInitiateTransferRouteParams>(),
        Core.$translation,
        Core.NG.$modal,
        Core.NG.$location,
        Core.$popupMessageService,
        Api.$transferStoreService,
        Api.$transferService,
        Core.Api.$entityService,
        Core.$formatterService,
        Core.$confirmationService,
        Inventory.Transfer.transfersService,
        Core.NG.$timeout,
        Core.$popupMessageService,
        Workforce.PeriodClose.Api.$periodCloseService,
        Core.Constants
        );
}
