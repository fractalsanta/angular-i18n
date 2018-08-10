module Inventory.Transfer {
    "use strict";

    import Task = Core.Api.Models.Task;

    export interface ITransferHistoryControllerScope extends ng.IScope {
        Translations: Api.Models.IL10N;
        Model: {
            FilterText: string; // text used in the 'filter search' box
        };
        TransferHeaders: ITransferHeaderForHistory[];
        FilteredTransferHeaders: ITransferHeaderForHistory[];
        CurrentPageTransferHeaders: ITransferHeaderForHistory[];

        PagingOptions: ng.ui.bootstrap.IPaginationConfig;
        RequiresPaging(): boolean;
        ChangePage(page: number): void;
        CurrentPage: number;

        ViewHistoryDetails(Id: number): void;
        Header: Core.Directives.IGridHeader;
        ChangeDates(): void;
        Dates: Core.IDateRange;
    }

    export interface ITransferHeaderForHistory extends Api.Models.ITransferHeaderWithEntities {
        DirectionName: string;
        StoreName: string;
        StatusName: string;
    }

    export class TransferHistoryController {
        private _initialDays = 14;
        private _StatusNameMap: any;

        constructor(
            private $scope: ITransferHistoryControllerScope,
            private authService: Core.Auth.IAuthService,
            translationService: Core.ITranslationService,
            notification: Core.IPopupMessageService,
            $location: ng.ILocationService,
            private stateService: ng.ui.IStateService,
            private transferHeaderService: Api.ITransferHistoryService,
            private constants: Core.IConstants
            ) {
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
            this.$scope.ChangePage = (page: number): void => {
                this.$scope.CurrentPage = page;
                var index = (page - 1) * $scope.PagingOptions.itemsPerPage;
                this.$scope.CurrentPageTransferHeaders = this.$scope.FilteredTransferHeaders.slice(index, index + this.$scope.PagingOptions.itemsPerPage);
            };

            $scope.PagingOptions = {
                itemsPerPage: 20,
                numPages: 5
            };

            $scope.RequiresPaging = (): boolean => {
                return ($scope.FilteredTransferHeaders.length > $scope.PagingOptions.itemsPerPage);
            };

            $scope.$watch("Model.FilterText", (): void => {
                this.ApplySearchFilterAndOrder();
            });

            $scope.ViewHistoryDetails = (transferId: number): void => {
                this.stateService.go(Core.UiRouterState.TransferHistoryStates.TransferDetails, { TransferRequestId: transferId });
            };

            $scope.ChangeDates = (): void => {
                this.LoadData(moment($scope.Dates.StartDate), moment($scope.Dates.EndDate));
            };

            translationService.GetTranslations().then((result: Core.Api.Models.ITranslations): void => {
                var translations = $scope.Translations = result.InventoryTransfer;
                notification.SetPageTitle(translations.TransferHistory);
                $scope.ChangeDates();
                var performSort = (): void => {
                    $scope.FilteredTransferHeaders = $scope.Header.DefaultSort(this.$scope.FilteredTransferHeaders);
                    $scope.ChangePage(1);
                };
                var emptyDefaultSort = (data: any[]): any[]=> {
                    return data;
                };
                $scope.Header = <Core.Directives.IGridHeader> {
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

                this._StatusNameMap = {
                    "ReadyToReceive": translations.ReadyToReceive,
                    "TransferSent": translations.TransferSent,
                    "RequestSent": translations.RequestSent,
                    "ReadyToApprove": translations.ReadyToApprove
                };
            });
            this.$scope.ChangePage(1);
        }

        public LoadData(startDate: Moment, endDate: Moment): void {
            var user = this.authService.GetUser();
            this.transferHeaderService.GetTransfersWithEntitiesByStoreAndDateRange(user.BusinessUser.MobileSettings.EntityId,
                startDate.format(this.constants.InternalDateTimeFormat), endDate.format(this.constants.InternalDateTimeFormat))
                .success((results: ITransferHeaderForHistory[]): void => {
                    this.$scope.TransferHeaders = results;
                    this.SetCalculatedDataForTransfers();
                    this.$scope.TransferHeaders = _.sortBy(this.$scope.TransferHeaders, "RequestDate");
                    this.SetDefaultSort();
                    this.ApplySearchFilterAndOrder();
                });
        }

        private SetDefaultSort(): void {
            this.$scope.Header.Selected = this.$scope.Header.Columns[2];
            this.$scope.Header.IsAscending = false;
            this.$scope.TransferHeaders = this.$scope.Header.DefaultSort(this.$scope.TransferHeaders);
        }

        private ApplySearchFilterAndOrder(): void {
            var upperCaseSearchFilterText = this.$scope.Model.FilterText.toUpperCase();
            this.$scope.FilteredTransferHeaders = _.filter(this.$scope.TransferHeaders, (item: ITransferHeaderForHistory): boolean => {
                if (item.StoreName == null) {
                    return true;
                }
                if (item.StoreName.toUpperCase().indexOf(upperCaseSearchFilterText) > -1) {
                    return true;
                }
                return false;
            });
            this.$scope.ChangePage(1);
        }

        private SetCalculatedDataForTransfers(): void {
            var user = this.authService.GetUser();
            var entityId = user.BusinessUser.MobileSettings.EntityId;
            var translations = this.$scope.Translations;
            _.forEach(this.$scope.TransferHeaders, (item: ITransferHeaderForHistory):
                void => {
                if (item.TransferToEntityId === entityId) {
                    item.DirectionName = translations.From;
                    item.StoreName = item.FromEntityName != null ? item.FromEntityName : translations.Dash;
                }
                else if (item.TransferFromEntityId === entityId) {
                    item.DirectionName = this.$scope.Translations.To;
                    item.StoreName = item.ToEntityName != null ? item.ToEntityName : translations.Dash;
                }

                item.StatusName = this.GetStatusName(item, entityId);
            });
        }

        private GetStatusName(item: ITransferHeaderForHistory, entityId: number): string {
            var status: string = item.TransferStatus;

            if (item.TransferStatus === "Requested") {
                // Requested does not apply to Transfer out
                status = item.TransferToEntityId === entityId ? "RequestSent" : "ReadyToApprove";
            }

            if (item.TransferStatus === "Pending") {
                status = item.TransferToEntityId === entityId  ? "ReadyToReceive" : "TransferSent";
            }
            
            return this._StatusNameMap[status] || item.TransferStatus;
        }
    }

    export var transferHistoryController = Core.NG.InventoryTransferModule.RegisterNamedController("OrderHistoryController", TransferHistoryController,
        Core.NG.$typedScope<ITransferHistoryControllerScope>(),
        Core.Auth.$authService,
        Core.$translation,
        Core.$popupMessageService,
        Core.NG.$location,
        Core.NG.$state,
        Api.$transferHistoryService,
        Core.Constants);
}