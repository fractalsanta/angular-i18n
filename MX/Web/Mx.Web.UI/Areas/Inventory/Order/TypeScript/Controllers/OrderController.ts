module Inventory.Order {
    "use strict";

    enum ActiveTab {
        Orders,
        Scheduled
    }

    class OrderController {
        private _customRange: Core.IDateRange;
        private _user: Core.Auth.IUser;
        private _twoWeeks = 14;
        private dateFormat = "MMM Do, YYYY";        


        constructor(
            private $scope: IOrderControllerScope,
            $rootScope: ng.IRootScopeService,
            private $authService: Core.Auth.IAuthService,
            private $orderService: Order.IOrderService,
            $modalService: ng.ui.bootstrap.IModalService,
            private stateService: ng.ui.IStateService,
            private popupMessageService: Core.IPopupMessageService,
            translationService: Core.ITranslationService,
            signalr: Core.ISignalRService,
            private constants: Core.IConstants,
            private searchOrderService: Order.ISearchOrderService,
            private periodCloseService: Workforce.PeriodClose.Api.IPeriodCloseService) {

            $scope.HeaderRefresh = { call: null };
            $scope.HeaderRefreshScheduled = { call: null };
            $scope.PeriodClosed = false;

            this._user = $authService.GetUser();

            var onlineHandler = (): void => {

                $scope.IsOffline = false;

                var currentActiveTab = this.GetCurrentActiveTab();

                if (currentActiveTab === ActiveTab.Orders) {
                    if (this._customRange) {
                        this.GetOrdersByRange(moment(this._customRange.StartDate), moment(this._customRange.EndDate));
                    } else {
                        $scope.FilterLast(this._twoWeeks);
                    }
                } else if (currentActiveTab === ActiveTab.Scheduled) {
                    this.GetScheduledOrders();
                }
            };

            $scope.DisplayOptions = {
                SearchText: "",
                SortProperty: "",
                SortAscending: true,
                OrderTabActive: (stateService.current.name === Core.UiRouterState.OrderStates.Place || stateService.current.name === Core.UiRouterState.OrderStates.Details ),
                ScheduledTabActive: (stateService.current.name === Core.UiRouterState.OrderStates.Scheduled || stateService.current.name === Core.UiRouterState.OrderStates.ScheduledOverdue || stateService.current.name === Core.UiRouterState.OrderStates.ScheduledOverdueDetails),
                CanCreateOrder: $authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_Ordering_CanCreate),
                FilterText: ""
            };

            signalr.SetConnectedListener(onlineHandler, $scope);
            signalr.SetReconnectedListener(onlineHandler, $scope);
            signalr.SetDisconnectedListener((): void => { $scope.IsOffline = true; }, $scope);

            $orderService.OrderModified.SubscribeController($scope, onlineHandler);

            $scope.GoToScheduledOrders = () => {
                this.stateService.go(Core.UiRouterState.OrderStates.Scheduled);
            };

            // #region Regular Order Functionality
            this.$scope.ChangePage = (page: number): void => {
                this.$scope.CurrentPage = page;
                var index = (page - 1) * this.$scope.PagingOptions.itemsPerPage;
                this.$scope.CurrentPageOrders = this.$scope.FilteredOrders.slice(index, index + this.$scope.PagingOptions.itemsPerPage);
            };

            this.$scope.PagingOptions = {
                itemsPerPage: 20,
                numPages: 5
            };

            $scope.RequiresPaging = (): boolean => ($scope.OrderSummaryData && $scope.OrderSummaryData.length > $scope.PagingOptions.itemsPerPage);
            $scope.ApplySearchFilter = () => this.ApplySearchFilter();

            this.$scope.OrderSummaryData = [];
            this.$scope.FilteredOrders = [];
            this.$scope.CurrentPageOrders = [];

            $scope.FilterLast = (days: number): void => {
                if ($scope.IsOffline) {
                    return;
                }

                $scope.DisplayOptions.FilterText = $scope.Translations.Last + " " + days + " " + $scope.Translations.Days;

                this._customRange = null;

                // TODO:   Use current store time
                this.GetOrdersByRange(moment().add("d", -days), moment());
            };

            $scope.OpenCustomRangeDialog = (): void => {
                if ($scope.IsOffline) {
                    return;
                }

                var modalInstance = $modalService.open(<ng.ui.bootstrap.IModalSettings>{
                    templateUrl: "/Areas/Inventory/Order/Templates/CustomRange.html",
                    controller: "Inventory.Order.CustomRange",
                    windowClass: "wide-sm",
                    resolve: { customRange: (): Core.IDateRange => { return this._customRange; } }
                });

                modalInstance.result.then((result: Core.IDateRange): void => {

                    this._customRange = result;

                    $scope.DisplayOptions.FilterText = moment(result.StartDate).format(this.dateFormat) + " - " + moment(result.EndDate).format(this.dateFormat);

                    this.GetOrdersByRange(moment(result.StartDate), moment(result.EndDate));
                });
            };

            $scope.OpenNewOrderDialog = (): void => {
                if ($scope.IsOffline) {
                    return;
                }

                $modalService.open(<ng.ui.bootstrap.IModalSettings>{
                    templateUrl: "/Areas/Inventory/Order/Templates/NewOrder.html",
                    controller: "Inventory.Order.NewOrder",
                    windowClass: "smaller"
                });
            };

            $scope.ViewOrder = (order: Api.Models.IOrderHeader): void => {
                if ($scope.IsOffline) {
                    return;
                }

                this.stateService.go(Core.UiRouterState.OrderStates.Details, { OrderId: order.Id });
            };

            $scope.SortColumn = (property: string): void => {
                var options = $scope.DisplayOptions,
                    sortPath = property.split("."),
                    length = sortPath.length,
                    sortHandler = (order: any): any => {
                        var value = order,
                            i: number;

                        for (i = 0; i < length; i += 1) {
                            value = value[sortPath[i]];
                        }

                        return value;
                    };

                options.SortAscending = !options.SortAscending;

                if (options.SortProperty !== property) {
                    options.SortAscending = true;
                }

                options.SortProperty = property;

                if ($scope.DisplayOptions.OrderTabActive) {

                    $scope.OrderSummaryData = _.sortBy($scope.OrderSummaryData, sortHandler);

                    if (!options.SortAscending) {
                        $scope.OrderSummaryData.reverse();
                    }

                    this.ApplySearchFilter();

                } else {
                    $scope.ScheduledOrderSummaryData = _.sortBy($scope.ScheduledOrderSummaryData, sortHandler);

                    if (!options.SortAscending) {
                        $scope.ScheduledOrderSummaryData.reverse();
                    }

                    this.ApplySearchFilterScheduled();
                }
            };

            this.$scope.ChangePage(1);

            // #endregion

            // #region Scheduled Order Functionality
            this.$scope.ChangePageScheduled = (page: number): void => {
                this.$scope.CurrentPageScheduled = page;
                var index = (page - 1) * this.$scope.PagingOptionsScheduled.itemsPerPage;
                this.$scope.CurrentPageOrdersScheduled = this.$scope.FilteredOrdersScheduled.slice(index, index + this.$scope.PagingOptionsScheduled.itemsPerPage);
            };

            this.$scope.PagingOptionsScheduled = {
                itemsPerPage: 20,
                numPages: 5
            };

            $scope.RequiresPagingScheduled = (): boolean => ($scope.ScheduledOrderSummaryData && $scope.ScheduledOrderSummaryData.length > $scope.PagingOptionsScheduled.itemsPerPage);
            $scope.ApplySearchFilterScheduled = () => this.ApplySearchFilterScheduled();

            this.$scope.ScheduledOrderSummaryData = [];
            this.$scope.FilteredOrdersScheduled = [];
            this.$scope.CurrentPageOrdersScheduled = [];

            $scope.DayPickerOptions = <Core.NG.IMxDayPickerOptions>{
                Date: new Date(),
                DayOffset: 1,
                MonthOffset: null
            };

            $scope.IsInOverdueMode = () => {
                return this.stateService.current.name === Core.UiRouterState.OrderStates.ScheduledOverdue;
            };

            $scope.FilterScheduledOrdersByDate = (): void => {
                if ($scope.IsOffline) {
                    return;
                }

                this.GetScheduledOrders();
            };

            $scope.SkipScheduledOrder = (order: Api.Models.IScheduledOrderHeader): void => {
                if ($scope.IsOffline) {
                    return;
                }

                $orderService.PutVoidedScheduledOrder(
                    this._user.BusinessUser.MobileSettings.EntityId,
                    order.ActionItemDate.toString(),
                    order.ActionItemInstanceId,
                    this._user.BusinessUser.UserName,
                    order.ActionItemId).then(() => {
                        this.GetScheduledOrders();
                    });
            };

            $scope.CreateScheduledOrder = (order: Api.Models.IScheduledOrderHeader): void => {
                if ($scope.IsOffline) {
                    return;
                }

                $orderService.PostGenerateSalesOrderFromScheduledOrder(
                    this._user.BusinessUser.MobileSettings.EntityId,
                    order.ActionItemDate.toString(),
                    order.ActionItemId, order.ActionItemInstanceId).then(result => {
                        this.stateService.go(Core.UiRouterState.OrderStates.Details, { OrderId: result });
                    });
            };

            $scope.ViewScheduledOrderDetail = (order: Api.Models.IScheduledOrderHeader): void => {
                if ($scope.IsOffline) {
                    return;
                }

                if (order.TransactionSalesOrderId > 0) {

                    if (this.stateService.current.name === Core.UiRouterState.OrderStates.ScheduledOverdue) {
                        this.stateService.go(Core.UiRouterState.OrderStates.ScheduledOverdueDetails, { OrderId: order.TransactionSalesOrderId });
                    } else {
                        this.stateService.go(Core.UiRouterState.OrderStates.Details, { OrderId: order.TransactionSalesOrderId });
                    }
                }
            };

            // #endregion

            $scope.OrdersTabClick = (): void => {
                this.SetPageTitle(ActiveTab.Orders);
                $scope.FilterLast(this._twoWeeks);
            };

            $scope.ScheduledTabClick = (): void => {
                if ($scope.IsOffline) {
                    return;
                }
                this.SetPageTitle(ActiveTab.Scheduled);
                this.GetScheduledOrders();
            };

            $rootScope.$on(Core.ApplicationEvent.HttpError, (event: ng.IAngularEvent, ...args: any[]): void => {
                if (args != null && args.length > 0) {
                    var response = <ng.IHttpPromiseCallbackArg<any>>args[0];
                    if (response.status === 0) {
                        event.preventDefault();
                    }
                }
            });

            translationService.GetTranslations().then((result: Core.Api.Models.ITranslations): void => {
                $scope.Translations = result.InventoryOrder;

                $scope.ActiveOrdersGridDefinitions = [
                    { Field: "VendorName", Title: $scope.Translations.Supplier },
                    { Field: "DisplayId", Title: $scope.Translations.OrderNumber },
                    { Field: "OrderDate", Title: $scope.Translations.OrderDate },
                    { Field: "DeliveryDate", Title: $scope.Translations.DeliveryDate },
                    { Field: "CoverUntilDate", Title: $scope.Translations.CoverUntil },
                    { Field: "Status", Title: $scope.Translations.Status },
                    { Title: "", Field: "" }
                ];

                $scope.ScheduledOrdersGridDefinitions = [
                    { Field: "Supplier", Title: $scope.Translations.Supplier },
                    { Field: "DeliveryDate", Title: $scope.Translations.DeliveryDate },
                    { Field: "CutoffTime", Title: $scope.Translations.Cutoff },
                    { Field: "Status", Title: $scope.Translations.Status },
                    { Title: "", Field: "" },
                    { Title: "", Field: "" }
                ];

                if (stateService.current.name === Core.UiRouterState.OrderStates.Scheduled || stateService.current.name === Core.UiRouterState.OrderStates.ScheduledOverdue) {
                    $scope.GridDefinitions = $scope.ScheduledOrdersGridDefinitions;
                } else {
                    $scope.GridDefinitions = $scope.ActiveOrdersGridDefinitions;
                }

                this.$scope.$on(Core.ApplicationEvent.UiRouterStateChangeSuccess, () => {
                    if (stateService.current.name === Core.UiRouterState.OrderStates.Place
                        || stateService.current.name === Core.UiRouterState.OrderStates.Scheduled
                        || stateService.current.name === Core.UiRouterState.OrderStates.ScheduledOverdue) {
                        if (angular.isFunction(this.$scope.HeaderRefresh.call)) {
                            this.$scope.HeaderRefresh.call();
                        }
                        if (angular.isFunction(this.$scope.HeaderRefreshScheduled.call)) {
                            this.$scope.HeaderRefreshScheduled.call();
                        }
                        this.SetPageTitle(this.GetCurrentActiveTab());
                    }
                });
            });
        }

        private GetCurrentActiveTab(): ActiveTab {
            if (this.$scope.DisplayOptions.OrderTabActive) {
                return ActiveTab.Orders;
            } else {
                return ActiveTab.Scheduled;
            }
        }

        private SetPageTitle(tab: ActiveTab): void {
            if (tab === ActiveTab.Orders) {
                this.popupMessageService.SetPageTitle(this.$scope.Translations.Orders);
            } else if (tab === ActiveTab.Scheduled
                && this.stateService.current.name === Core.UiRouterState.OrderStates.ScheduledOverdue) {
                this.popupMessageService.SetPageTitle(this.$scope.Translations.OverdueScheduledOrders);
            } else {
                this.popupMessageService.SetPageTitle(this.$scope.Translations.ScheduledOrders);
            }
        }

        private GetOrdersByRange(fromDate: Moment, toDate: Moment): void {
            this.$scope.ScheduledOrderSummaryData = null;
            this.$scope.GridDefinitions = this.$scope.ActiveOrdersGridDefinitions;

            this.$orderService.GetOrdersByRange(this._user.BusinessUser.MobileSettings.EntityId
                , fromDate.format(this.constants.InternalDateTimeFormat)
                , toDate.format(this.constants.InternalDateTimeFormat))
                .then(results => {
                    // Initial sort should be by Order Date, descending.
                    if (!this.$scope.OrderSummaryData || !this.$scope.DisplayOptions.SortProperty) {
                        this.$scope.DisplayOptions.SortAscending = false;
                        this.$scope.DisplayOptions.SortProperty = "OrderDate";
                    }

                    this.$scope.OrderSummaryData = results;
                    this.SortWithoutDirectionChange(this.$scope.DisplayOptions.SortProperty);
                    this.ApplySearchFilter();
                });
        }
        
        ApplySearchFilter(): void {
            var searchFilterText = this.$scope.DisplayOptions.SearchText;
            this.$scope.FilteredOrders =
                _.filter(this.$scope.OrderSummaryData, item => this.searchOrderService.Filter(<ISearchOrder>item, searchFilterText));

            this.$scope.ChangePage(1);
        }

        private GetScheduledOrders(): void {
            
            this.$scope.OrderSummaryData = null;
            this.$scope.GridDefinitions = this.$scope.ScheduledOrdersGridDefinitions;

            var date = moment(this.$scope.DayPickerOptions.Date);
            var scheduledOrdersPromise: ng.IPromise<Api.Models.IScheduledOrderHeader[]>;

            this.UpdatePeriodCloseStatus();

            if (this.$scope.IsInOverdueMode()) {
                scheduledOrdersPromise = this.$orderService.GetOverdueScheduledOrders(
                    this._user.BusinessUser.MobileSettings.EntityId);
            } else {
                scheduledOrdersPromise = this.$orderService.GetScheduledOrders(
                    this._user.BusinessUser.MobileSettings.EntityId,
                    date.format(this.constants.InternalDateFormat));
            }

            scheduledOrdersPromise.then(results => {
                    // Initial sort should be Delivery Date, descending.
                    if (!this.$scope.ScheduledOrderSummaryData || !this.$scope.DisplayOptions.SortProperty) {
                        this.$scope.DisplayOptions.SortAscending = false;
                        this.$scope.DisplayOptions.SortProperty = "DeliveryDate";
                    }

                    this.$scope.ScheduledOrderSummaryData = results;
                    this.SortWithoutDirectionChange(this.$scope.DisplayOptions.SortProperty);
                    this.ApplySearchFilterScheduled();
                });
        }

        private UpdatePeriodCloseStatus() {            
            this.periodCloseService.GetPeriodLockStatus(this._user.BusinessUser.MobileSettings.EntityId, moment(this.$scope.DayPickerOptions.Date).format(this.constants.InternalDateFormat))
                .success((result) => {
                    this.$scope.PeriodClosed = (result.IsClosed && !this.$authService.CheckPermissionAllowance(Core.Api.Models.Task.Orders_CanEditClosedPeriods));

                    if (this.$scope.PeriodClosed) {
                        this.popupMessageService.ShowError(this.$scope.Translations.PeriodIsClosed);
                    }
                });            
        }

        ApplySearchFilterScheduled(): void {
            var searchFilterText = this.$scope.DisplayOptions.SearchText.toLowerCase();
            this.$scope.FilteredOrdersScheduled = _.filter(this.$scope.ScheduledOrderSummaryData, (item) => {
                if (item.Supplier.toLowerCase().indexOf(searchFilterText) > -1
                    || item.Status.toLowerCase().indexOf(searchFilterText) > -1
                    ) {
                    return true;
                }
                return false;
            });

            this.$scope.ChangePageScheduled(1);
        }

        private SortWithoutDirectionChange(property: string): void {
            this.$scope.DisplayOptions.SortAscending = !this.$scope.DisplayOptions.SortAscending;
            this.$scope.SortColumn(property);
        }
    }

    export var orderController = Core.NG.InventoryOrderModule.RegisterNamedController("OrderController", OrderController,
        Core.NG.$typedScope<IOrderControllerScope>(),
        Core.NG.$rootScope,
        Core.Auth.$authService,
        Order.$orderService,
        Core.NG.$modal,
        Core.NG.$state,
        Core.$popupMessageService,
        Core.$translation,
        Core.$signalR,
        Core.Constants,
        Order.$searchOrderService,
        Workforce.PeriodClose.Api.$periodCloseService
        );
}