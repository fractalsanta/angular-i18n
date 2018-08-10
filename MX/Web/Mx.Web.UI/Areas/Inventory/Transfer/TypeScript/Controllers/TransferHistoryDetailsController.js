var Inventory;
(function (Inventory) {
    var Transfer;
    (function (Transfer) {
        "use strict";
        var Task = Core.Api.Models.Task;
        var TransferHistoryDetailsController = (function () {
            function TransferHistoryDetailsController($scope, $routeParams, authService, $location, translationService, notification, transfers, entityService, formatter, stateService, $timeout) {
                var _this = this;
                this.$scope = $scope;
                this.stateService = stateService;
                this.$timeout = $timeout;
                var canViewPage = authService.CheckPermissionAllowance(Task.Inventory_Transfers_CanRequestTransferIn)
                    || authService.CheckPermissionAllowance(Task.Inventory_Transfers_CanCreateTransferOut);
                if (!canViewPage) {
                    $location.path("/Core/Forbidden");
                    return;
                }
                var requestId = Number($routeParams.TransferRequestId);
                var currentUser = authService.GetUser();
                var entityId = currentUser.BusinessUser.MobileSettings.EntityId;
                $scope.Return = function () {
                    _this.stateService.go(Core.UiRouterState.TransferHistoryStates.History);
                    _this.$timeout(function () {
                        $(window).resize();
                    });
                };
                if (isNaN(requestId)) {
                    $scope.Return();
                    return;
                }
                transfers.GetByTransferIdWithReportingUnits(requestId, entityId).success(function (transfer) {
                    if (transfer) {
                        $scope.Transfer = transfer;
                        var otherEntityId = 0;
                        if ($scope.Transfer.RequestingEntityId === entityId) {
                            otherEntityId = $scope.Transfer.SendingEntityId;
                        }
                        else if ($scope.Transfer.SendingEntityId === entityId) {
                            otherEntityId = $scope.Transfer.RequestingEntityId;
                        }
                        entityService.Get(otherEntityId).success(function (location) {
                            $scope.EntityDisplayName = formatter.CreateLocationDisplayName(location);
                        });
                        _this.EnsureReportingUomIsSet();
                    }
                });
                translationService.GetTranslations().then(function (result) {
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
                $scope.GetRequestTotal = function () {
                    var total = 0;
                    if ($scope.Transfer && $scope.Transfer.Details.length) {
                        _.each($scope.Transfer.Details, function (item) {
                            total += item.TransferCost;
                        });
                    }
                    return total;
                };
                $scope.GetToOrFromText = function () {
                    var toOrFrom = "";
                    if ($scope.Transfer && $scope.Translations) {
                        if ($scope.Transfer.RequestingEntityId == entityId) {
                            toOrFrom = $scope.Translations.TransferFrom;
                        }
                        else {
                            toOrFrom = $scope.Translations.TransferTo;
                        }
                    }
                    return toOrFrom;
                };
                $scope.IsTransferDenied = function () {
                    var isDenied = $scope.Transfer && $scope.Transfer.Status === "Denied";
                    return isDenied;
                };
            }
            TransferHistoryDetailsController.prototype.EnsureReportingUomIsSet = function () {
                var _this = this;
                if (this.$scope.Transfer && this.$scope.Transfer.Details.length) {
                    _.each(this.$scope.Transfer.Details, function (item) {
                        if (!item.ReportingUom) {
                            item.ReportingUom = item.TransferUnit3;
                            item.ReportingOnHand = item.OnHand;
                            item.ReportingRequested = item.OriginalTransferQty;
                            item.ReportingTransferred = item.Quantity;
                            item.ReportingUnitCost = item.UnitCost;
                        }
                        if (_this.$scope.Transfer.Status == "Denied") {
                            item.ReportingTransferred = 0;
                        }
                        else if (_this.$scope.Transfer.Status == "Pending" || _this.$scope.Transfer.Status == "Requested") {
                            item.ReportingTransferred = -1;
                        }
                    });
                }
            };
            return TransferHistoryDetailsController;
        }());
        Transfer.TransferHistoryDetailsController = TransferHistoryDetailsController;
        Transfer.transferHistoryDetailsController = Core.NG.InventoryTransferModule.RegisterNamedController("TransferHistoryDetailsController", TransferHistoryDetailsController, Core.NG.$typedScope(), Core.NG.$typedStateParams(), Core.Auth.$authService, Core.NG.$location, Core.$translation, Core.$popupMessageService, Inventory.Transfer.Api.$transferHistoryService, Core.Api.$entityService, Core.$formatterService, Core.NG.$state, Core.NG.$timeout);
    })(Transfer = Inventory.Transfer || (Inventory.Transfer = {}));
})(Inventory || (Inventory = {}));
