var Inventory;
(function (Inventory) {
    var Transfer;
    (function (Transfer) {
        "use strict";
        var Task = Core.Api.Models.Task;
        var TransferHistoryController = (function () {
            function TransferHistoryController($scope, authService, translationService, notification, $location, stateService, transferHeaderService, constants) {
                var _this = this;
                this.$scope = $scope;
                this.authService = authService;
                this.stateService = stateService;
                this.transferHeaderService = transferHeaderService;
                this.constants = constants;
                this._initialDays = 14;
                var canViewPage = authService.CheckPermissionAllowance(Task.Inventory_Transfers_CanRequestTransferIn)
                    || authService.CheckPermissionAllowance(Task.Inventory_Transfers_CanCreateTransferOut);
                if (!canViewPage) {
                    $location.path("/Core/Forbidden");
                    return;
                }
                $scope.Dates = {
                    StartDate: moment().add("d", -this._initialDays).toDate(),
                    EndDate: moment().toDate()
                };
                $scope.Model = {
                    FilterText: ""
                };
                $scope.TransferHeaders = [];
                $scope.FilteredTransferHeaders = [];
                $scope.CurrentPageTransferHeaders = [];
                this.$scope.ChangePage = function (page) {
                    _this.$scope.CurrentPage = page;
                    var index = (page - 1) * $scope.PagingOptions.itemsPerPage;
                    _this.$scope.CurrentPageTransferHeaders = _this.$scope.FilteredTransferHeaders.slice(index, index + _this.$scope.PagingOptions.itemsPerPage);
                };
                $scope.PagingOptions = {
                    itemsPerPage: 20,
                    numPages: 5
                };
                $scope.RequiresPaging = function () {
                    return ($scope.FilteredTransferHeaders.length > $scope.PagingOptions.itemsPerPage);
                };
                $scope.$watch("Model.FilterText", function () {
                    _this.ApplySearchFilterAndOrder();
                });
                $scope.ViewHistoryDetails = function (transferId) {
                    _this.stateService.go(Core.UiRouterState.TransferHistoryStates.TransferDetails, { TransferRequestId: transferId });
                };
                $scope.ChangeDates = function () {
                    _this.LoadData(moment($scope.Dates.StartDate), moment($scope.Dates.EndDate));
                };
                translationService.GetTranslations().then(function (result) {
                    var translations = $scope.Translations = result.InventoryTransfer;
                    notification.SetPageTitle(translations.TransferHistory);
                    $scope.ChangeDates();
                    var performSort = function () {
                        $scope.FilteredTransferHeaders = $scope.Header.DefaultSort(_this.$scope.FilteredTransferHeaders);
                        $scope.ChangePage(1);
                    };
                    var emptyDefaultSort = function (data) {
                        return data;
                    };
                    $scope.Header = {
                        Columns: [
                            { Fields: ["DirectionName"], Title: translations.Direction },
                            { Fields: ["StoreName"], Title: translations.Store },
                            { Fields: ["CreateDate"], Title: translations.RequestDate },
                            { Fields: ["InitiatedBy"], Title: translations.Requester },
                            { Fields: ["TransferQty"], Title: translations.ItemsRequested },
                            { Fields: ["StatusName"], Title: translations.Status },
                            { Title: "" }
                        ],
                        OnSortEvent: performSort,
                        DefaultSort: emptyDefaultSort
                    };
                    _this._StatusNameMap = {
                        "ReadyToReceive": translations.ReadyToReceive,
                        "TransferSent": translations.TransferSent,
                        "RequestSent": translations.RequestSent,
                        "ReadyToApprove": translations.ReadyToApprove
                    };
                });
                this.$scope.ChangePage(1);
            }
            TransferHistoryController.prototype.LoadData = function (startDate, endDate) {
                var _this = this;
                var user = this.authService.GetUser();
                this.transferHeaderService.GetTransfersWithEntitiesByStoreAndDateRange(user.BusinessUser.MobileSettings.EntityId, startDate.format(this.constants.InternalDateTimeFormat), endDate.format(this.constants.InternalDateTimeFormat))
                    .success(function (results) {
                    _this.$scope.TransferHeaders = results;
                    _this.SetCalculatedDataForTransfers();
                    _this.$scope.TransferHeaders = _.sortBy(_this.$scope.TransferHeaders, "RequestDate");
                    _this.SetDefaultSort();
                    _this.ApplySearchFilterAndOrder();
                });
            };
            TransferHistoryController.prototype.SetDefaultSort = function () {
                this.$scope.Header.Selected = this.$scope.Header.Columns[2];
                this.$scope.Header.IsAscending = false;
                this.$scope.TransferHeaders = this.$scope.Header.DefaultSort(this.$scope.TransferHeaders);
            };
            TransferHistoryController.prototype.ApplySearchFilterAndOrder = function () {
                var upperCaseSearchFilterText = this.$scope.Model.FilterText.toUpperCase();
                this.$scope.FilteredTransferHeaders = _.filter(this.$scope.TransferHeaders, function (item) {
                    if (item.StoreName == null) {
                        return true;
                    }
                    if (item.StoreName.toUpperCase().indexOf(upperCaseSearchFilterText) > -1) {
                        return true;
                    }
                    return false;
                });
                this.$scope.ChangePage(1);
            };
            TransferHistoryController.prototype.SetCalculatedDataForTransfers = function () {
                var _this = this;
                var user = this.authService.GetUser();
                var entityId = user.BusinessUser.MobileSettings.EntityId;
                var translations = this.$scope.Translations;
                _.forEach(this.$scope.TransferHeaders, function (item) {
                    if (item.TransferToEntityId === entityId) {
                        item.DirectionName = translations.From;
                        item.StoreName = item.FromEntityName != null ? item.FromEntityName : translations.Dash;
                    }
                    else if (item.TransferFromEntityId === entityId) {
                        item.DirectionName = _this.$scope.Translations.To;
                        item.StoreName = item.ToEntityName != null ? item.ToEntityName : translations.Dash;
                    }
                    item.StatusName = _this.GetStatusName(item, entityId);
                });
            };
            TransferHistoryController.prototype.GetStatusName = function (item, entityId) {
                var status = item.TransferStatus;
                if (item.TransferStatus === "Requested") {
                    status = item.TransferToEntityId === entityId ? "RequestSent" : "ReadyToApprove";
                }
                if (item.TransferStatus === "Pending") {
                    status = item.TransferToEntityId === entityId ? "ReadyToReceive" : "TransferSent";
                }
                return this._StatusNameMap[status] || item.TransferStatus;
            };
            return TransferHistoryController;
        }());
        Transfer.TransferHistoryController = TransferHistoryController;
        Transfer.transferHistoryController = Core.NG.InventoryTransferModule.RegisterNamedController("OrderHistoryController", TransferHistoryController, Core.NG.$typedScope(), Core.Auth.$authService, Core.$translation, Core.$popupMessageService, Core.NG.$location, Core.NG.$state, Transfer.Api.$transferHistoryService, Core.Constants);
    })(Transfer = Inventory.Transfer || (Inventory.Transfer = {}));
})(Inventory || (Inventory = {}));
