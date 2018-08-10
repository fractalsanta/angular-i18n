module Inventory.Order {
    "use strict";

    class OrderHistoryController {

        private SetupGrid() {
            this.$scope.DisplayOptions = {
                SortProperty: "OrderDate",
                SortAscending: false
            };

            this.$scope.OrdersHistoryGridDefinitions = [
                { Field: "VendorName", Title: this.$scope.L10N.Supplier },
                { Field: "DisplayId", Title: this.$scope.L10N.OrderNumber },
                { Field: "OrderDate", Title: this.$scope.L10N.OrderDate },
                { Field: "ReceivedDate", Title: this.$scope.L10N.DeliveryDate },
                { Field: "Status", Title: this.$scope.L10N.Status },
                { Field: "TotalItems", Title: this.$scope.L10N.ItemsInDelivery },
                { Title: "", Field: "" }
            ];
        }

        private Initialize() {

            this.translationService.GetTranslations().then((result: Core.Api.Models.ITranslations): void => {

                this.$scope.L10N = result.InventoryOrder;
                this.SetPageTitle();
                this.SetupGrid();

                this.$scope.$on(Core.ApplicationEvent.UiRouterStateChangeSuccess, () => {
                    if (this.stateService.current.name === Core.UiRouterState.OrderHistoryStates.History) {
                        this.$scope.ChangePage(this.$scope.CurrentPage);
                        this.SetPageTitle();
                    }
                });
            });

            var today = moment();
            this.$scope.Model = {
                DatesRange: {
                    EndDate: today.toDate(),
                    StartDate: today.subtract('days', 14).toDate()
                },
                FilterText: ""
            }

            this.$scope.ChangePage= (page: number): void => {
                this.$scope.CurrentPage = page;
                var index = (page - 1) * this.$scope.PagingOptions.itemsPerPage;
                this.$scope.CurrentPageOrders = this.$scope.FilteredOrders.slice(index, index + this.$scope.PagingOptions.itemsPerPage);
            }

            this.$scope.PagingOptions = {
                itemsPerPage: 20,
                numPages: 5
            };

            this.$scope.Orders = [];
            this.$scope.FilteredOrders = [];
            this.$scope.CurrentPageOrders = [];

            this.$receiveOrderService.OrderModified.SubscribeController(this.$scope, () => this.GetOrdersHistory());
        }

        constructor(
            private $scope: IOrderHistoryControllerScope,
            private $authService: Core.Auth.IAuthService,
            private translationService: Core.ITranslationService,
            private $orderHistoryService: Api.IOrderHistoryService,
            private $receiveOrderService: Order.IReceiveOrderService,
            private popupMessageService: Core.IPopupMessageService,
            private stateService: ng.ui.IStateService,
            private constants: Core.IConstants,
            private searchOrderService: Order.ISearchOrderService) {

            this.Initialize();
            $scope.SelectDatesRange = () => this.SelectDatesRange();
            $scope.RequiresPaging = (): boolean => {
                return ($scope.Orders.length > $scope.PagingOptions.itemsPerPage);
            };

            $scope.ApplySearchFilter = () => this.ApplySearchFilter();
            $scope.SortByColumn = (field: string) => this.SortByColumn(field);
            $scope.ViewOrder = (order: Api.Models.IOrderHeader) => this.ViewOrder(order);
        }

        private SetPageTitle(): void {
            this.popupMessageService.SetPageTitle(this.$scope.L10N.OrderHistory);
        }
        
        SelectDatesRange() {
            this.GetOrdersHistory();
        }

        GetOrdersHistory() {
            var user = this.$authService.GetUser();
            if (user != null && user.BusinessUser != null) {
                this.$orderHistoryService.GetOrdersByRange(user.BusinessUser.MobileSettings.EntityId,
                    moment(this.$scope.Model.DatesRange.StartDate).format(this.constants.InternalDateTimeFormat)
                    , moment(this.$scope.Model.DatesRange.EndDate).format(this.constants.InternalDateTimeFormat)).then((result) => {
                    _.each(result.data, (order: Api.Models.IOrderHeader) => {
                        order.TotalCases = Math.round(order.TotalCases * 100) / 100;
                    });
                    this.$scope.Orders = result.data;
                    this.ApplySearchFilter();
                });
            }
        }

        ApplySearchFilter(): void {
            var searchFilterText = this.$scope.Model.FilterText;
            this.$scope.FilteredOrders =
                _.filter(this.$scope.Orders, item => this.searchOrderService.Filter(<ISearchOrder>item, searchFilterText));

            this.$scope.ChangePage(1);
        }

        SortByColumn(field: string) {

            if (this.$scope.DisplayOptions.SortProperty === field) {
                this.$scope.DisplayOptions.SortAscending = !this.$scope.DisplayOptions.SortAscending;
            } else {
                this.$scope.DisplayOptions.SortProperty = field;
                this.$scope.DisplayOptions.SortAscending = true;
            }

            this.$scope.Orders = _.sortBy(this.$scope.Orders, (order: any) => {
                return order[field] != null ? order[field] : "";
            });

            if (!this.$scope.DisplayOptions.SortAscending) {
                this.$scope.Orders.reverse();
            }

            this.ApplySearchFilter();
        }

        ViewOrder(order: Api.Models.IOrderHeader) {
            if (this.popupMessageService.IsOffline()) {
                return;
            }
            if (order.OrderStatus == Api.Models.OrderStatus.Cancelled) {
                this.stateService.go(Core.UiRouterState.OrderHistoryStates.PlacedOrderDetails, { OrderId: order.Id });

            }
            if (order.OrderStatus == Api.Models.OrderStatus.Received
                || order.OrderStatus == Api.Models.OrderStatus.AutoReceived) {
                this.stateService.go(Core.UiRouterState.OrderHistoryStates.ReceivedOrderDetails, { OrderId: order.DisplayId });
            }
        }
    }

    export var orderHistoryController = Core.NG.InventoryOrderModule.RegisterNamedController("OrderHistoryController", OrderHistoryController,
        Core.NG.$typedScope<IOrderHistoryControllerScope>(),
        Core.Auth.$authService,
        Core.$translation,
        Api.$orderHistoryService,
        Order.$receiveOrderService,
        Core.$popupMessageService,
        Core.NG.$state,
        Core.Constants,
        Order.$searchOrderService
        );
}
