module Inventory.Transfer {
    "use strict";

    import Task = Core.Api.Models.Task;

    export interface ITransferHistoryDetailsColumnDefinition {
        Title: string;
        Field?: string;
    }

    export interface ITransferHistoryDetailsControllerScope extends ng.IScope {
        Translations: Api.Models.IL10N;
        Transfer: Api.Models.ITransferReporting;
        EntityDisplayName: string;
        GridDefinitions: ITransferHistoryDetailsColumnDefinition[];

        GetRequestTotal(): number;
        GetToOrFromText(): string;
        Return(): void;
        IsTransferDenied(): boolean;
    }

    export interface ITransferHistoryDetailsParams {
        TransferRequestId: string;
    }

    export class TransferHistoryDetailsController {
        constructor(
            private $scope: ITransferHistoryDetailsControllerScope,
            $routeParams: ITransferHistoryDetailsParams,
            authService: Core.Auth.IAuthService,
            $location: ng.ILocationService,
            translationService: Core.ITranslationService,
            notification: Core.IPopupMessageService,
            transfers: Api.ITransferHistoryService,
            entityService: Core.Api.IEntityService,
            formatter: Core.IFormatterService,
            private stateService: ng.ui.IStateService,
            private $timeout: ng.ITimeoutService
            ) {
            var canViewPage = authService.CheckPermissionAllowance(Task.Inventory_Transfers_CanRequestTransferIn)
                || authService.CheckPermissionAllowance(Task.Inventory_Transfers_CanCreateTransferOut);

            if (!canViewPage) {
                $location.path("/Core/Forbidden");
                return;
            }

            var requestId = Number($routeParams.TransferRequestId);

            var currentUser = authService.GetUser();
            var entityId = currentUser.BusinessUser.MobileSettings.EntityId;

            $scope.Return = (): void => {
                this.stateService.go(Core.UiRouterState.TransferHistoryStates.History);
                this.$timeout(() => {
                    $(window).resize();
                });

            };

            if (isNaN(requestId)) {
                $scope.Return();
                return;
            }

            transfers.GetByTransferIdWithReportingUnits(requestId, entityId).success((transfer: Api.Models.ITransferReporting): void => {
                if (transfer) {
                    $scope.Transfer = transfer;

                    var otherEntityId = 0;

                    if ($scope.Transfer.RequestingEntityId === entityId) {
                        otherEntityId = $scope.Transfer.SendingEntityId;
                    } else if ($scope.Transfer.SendingEntityId === entityId) {
                        otherEntityId = $scope.Transfer.RequestingEntityId;
                    }

                    entityService.Get(otherEntityId).success((location: Core.Api.Models.IEntityModel): void => {
                        $scope.EntityDisplayName = formatter.CreateLocationDisplayName(location);
                    });

                    this.EnsureReportingUomIsSet();
                }
            });

            translationService.GetTranslations().then((result: Core.Api.Models.ITranslations): void => {
                var translations = $scope.Translations = result.InventoryTransfer;
                notification.SetPageTitle(translations.TransferHistory);

                $scope.GridDefinitions = [
                    { Title: translations.Description + " (" + translations.ItemCode + ")", Field: "Description" },
                    { Title: translations.Unit, Field: "Unit" },
                    { Title: translations.QtyRequested, Field: "RequestQty" },
                    { Title: translations.QtyTransferred, Field: "RequestQty" },
                    { Title: translations.ResultingOnHand, Field: "OnHand" },
                    { Title: translations.UnitCost, Field: "UnitCost" },
                    { Title: translations.ExtendedCost, Field: "TransferCost" },
                ];
            });

            $scope.GetRequestTotal = (): number => {
                var total = 0;

                if ($scope.Transfer && $scope.Transfer.Details.length) {
                    _.each($scope.Transfer.Details, item => {
                        total += item.TransferCost;
                    });
                }

                return total;
            };

            $scope.GetToOrFromText = (): string => {
                var toOrFrom = "";

                if ($scope.Transfer && $scope.Translations) {
                    if ($scope.Transfer.RequestingEntityId == entityId) {
                        toOrFrom = $scope.Translations.TransferFrom;
                    } else {
                        toOrFrom = $scope.Translations.TransferTo;
                    }
                }

                return toOrFrom;
            };

            $scope.IsTransferDenied = (): boolean => {
                var isDenied = $scope.Transfer && $scope.Transfer.Status === "Denied";
                return isDenied;
            };
        }

        EnsureReportingUomIsSet(): void {
            if (this.$scope.Transfer && this.$scope.Transfer.Details.length) {
                _.each(this.$scope.Transfer.Details, (item: Api.Models.ITransferDetailReporting): void => {
                    if (!item.ReportingUom) {
                        item.ReportingUom = item.TransferUnit3;
                        item.ReportingOnHand = item.OnHand;
                        item.ReportingRequested = item.OriginalTransferQty;
                        item.ReportingTransferred = item.Quantity;
                        item.ReportingUnitCost = item.UnitCost;
                    }

                    if (this.$scope.Transfer.Status == "Denied") {
                        item.ReportingTransferred = 0;
                    } else if (this.$scope.Transfer.Status == "Pending" || this.$scope.Transfer.Status == "Requested") {
                        item.ReportingTransferred = -1;
                    }
                });
            }
        }
    }
    export var transferHistoryDetailsController = Core.NG.InventoryTransferModule.RegisterNamedController(
        "TransferHistoryDetailsController",
        TransferHistoryDetailsController,
        Core.NG.$typedScope<ITransferHistoryDetailsControllerScope>(),
        Core.NG.$typedStateParams<ITransferHistoryDetailsParams>(),
        Core.Auth.$authService,
        Core.NG.$location,
        Core.$translation,
        Core.$popupMessageService,
        Inventory.Transfer.Api.$transferHistoryService,
        Core.Api.$entityService,
        Core.$formatterService,
        Core.NG.$state,
        Core.NG.$timeout);
}