module Inventory.Order {
    "use strict";

    export class ReceiveOrderController {
        private _customRange: Core.IDateRange;
        private _twoWeeks = 14;

        private _idPropertyName = "DisplayId";
        private _statusPropertyName = "Status";
        private _statusReceived = "Received";

        private Initialize() {
            this.$scope.Translations = <Api.Models.IL10N>{};

            this.$scope.Model = {
                FilterText: "",
                DateRange: ""
            };

            var itemsPerPage = 20;

            this.$scope.ChangePage = (page: number): void => {
                this.$scope.CurrentPage = page;
                var index = (page - 1) * itemsPerPage;
                this.$scope.CurrentPageOrders = this.$scope.FilteredOrders.slice(index, index + this.$scope.PagingOptions.itemsPerPage);
            };

            this.$scope.PagingOptions = {
                itemsPerPage: itemsPerPage,
                numPages: 5
            };

            this.$scope.Orders = [];
            this.$scope.FilteredOrders = [];
            this.$scope.CurrentPageOrders = [];

            this.$receiveOrderService.OrderModified.SubscribeController(this.$scope, () => {
                if (this._customRange) {
                    this.LoadData(moment(this._customRange.StartDate), moment(this._customRange.EndDate));
                } else {
                    this.$scope.FilterLast(this._twoWeeks);
                }
            });
        }

        constructor(
            private $scope: IReceiveOrderControllerScope,
            private authService: Core.Auth.IAuthService,
            private receiveOrderService: Api.IReceiveOrderService,
            private $receiveOrderService: Order.IReceiveOrderService,
            private $modalService: ng.ui.bootstrap.IModalService,
            private popupMessageService: Core.IPopupMessageService,
            translationService: Core.ITranslationService,
            private stateService: ng.ui.IStateService,
            private constants: Core.IConstants,
            private searchOrderService: Order.ISearchOrderService
            ) {

            this.Initialize();

            $scope.$watch("Model.FilterText", (): void => {
                this.ApplySearchFilterAndOrder();
            });

            $scope.FilterLast = (days: number): void => {
                $scope.Model.DateRange = $scope.Translations.Last + " " + days + " " + $scope.Translations.Days;

                this._customRange = null;

                this.LoadData(moment().add("d", -days), moment());
            };

            $scope.OpenCustomRangeDialog = (): void => {
                var modalInstance = $modalService.open(<ng.ui.bootstrap.IModalSettings>{
                    templateUrl: "/Areas/Inventory/Order/Templates/CustomRange.html",
                    controller: "Inventory.Order.CustomRange",
                    windowClass: "wide-sm",
                    resolve: { customRange: (): Core.IDateRange => { return this._customRange; } }
                });

                modalInstance.result.then((result: Core.IDateRange): void => {
                    var startDate = moment(result.StartDate),
                        endDate = moment(result.EndDate),
                        format = "LL";

                    this._customRange = result;

                    $scope.Model.DateRange = startDate.format(format) + " - " + endDate.format(format);

                    this.LoadData(startDate, endDate);
                });
            };

            $scope.IsOrderReceived = (order: Api.Models.IReceiveOrderHeader): boolean => {
                return (order.Status === this._statusReceived);
            };

            $scope.RequiresPaging = (): boolean => {
                return ($scope.Orders.length > $scope.PagingOptions.itemsPerPage);
            };

            $scope.ViewOrder = (order: Api.Models.IReceiveOrderHeader): void=> {    
                if (this.stateService.current.name === Core.UiRouterState.ReceiveOrderStates.ReceiveOrder) {
                    this.stateService.go(Core.UiRouterState.ReceiveOrderStates.ReceiveOrderDetails, { OrderId: order.DisplayId });           
                }
                if (this.stateService.current.name === Core.UiRouterState.ReceiveOrderStates.ReceiveOrderExist) {
                    this.stateService.go(Core.UiRouterState.ReceiveOrderStates.ReceiveOrderExistDetails, { OrderId: order.DisplayId });
                }                
            };

            translationService.GetTranslations().then((result: Core.Api.Models.ITranslations): void => {

                $scope.Translations = result.InventoryOrder;
                this.SetPageTitle();
                $scope.FilterLast(14);

                this.$scope.$on(Core.ApplicationEvent.UiRouterStateChangeSuccess, () => {
                    if (this.stateService.current.name === Core.UiRouterState.ReceiveOrderStates.ReceiveOrder) {
                        this.SetPageTitle();
                    }
                });

                if (this.stateService.current.name === Core.UiRouterState.ReceiveOrderStates.ReceiveOrderExist) {
                    this.OpenOrdersExistDialog();
                }
            });
        }

        private SetPageTitle(): void {
            this.popupMessageService.SetPageTitle(this.$scope.Translations.ReceiveOrder);
        }

        private ApplySearchFilterAndOrder(): void {
            var searchFilterText = this.$scope.Model.FilterText;
            this.$scope.FilteredOrders =
                _.filter(this.$scope.Orders, item => this.searchOrderService.Filter(<ISearchOrder>item, searchFilterText));

            this.$scope.FilteredOrders = _.sortBy(this.$scope.FilteredOrders, [this._statusPropertyName, this._idPropertyName]);

            this.$scope.ChangePage(1);
        }

        private OpenOrdersExistDialog(): void {
            this.popupMessageService.ShowError(this.$scope.Translations.PlacedOrdersExist);
        }

        private LoadData(startDate: Moment, endDate: Moment): void {
            var user = this.authService.GetUser();

            this.receiveOrderService.GetPlacedAndReceivedOrders(user.BusinessUser.MobileSettings.EntityId, startDate.format(this.constants.InternalDateFormat)
                , endDate.format(this.constants.InternalDateFormat))
                .success((results: Api.Models.IReceiveOrderHeader[]): void => {
                    this.$scope.Orders = results;
                    this.ApplySearchFilterAndOrder();
                });
        }
    }

    export var receiveOrderController = Core.NG.InventoryOrderModule.RegisterNamedController("ReceiveOrderController", ReceiveOrderController,
        Core.NG.$typedScope<IReceiveOrderControllerScope>(),
        Core.Auth.$authService,
        Api.$receiveOrderService,
        Order.$receiveOrderService,
        Core.NG.$modal,
        Core.$popupMessageService,
        Core.$translation,
        Core.NG.$state,
        Core.Constants,
        Order.$searchOrderService
        );

} 