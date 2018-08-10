module Inventory.Order {
    "use strict";

    export class ReturnOrderController {
        private _customRange: Core.IDateRange;

        private _idPropertyName = "Id";

        constructor(
            private $scope: IReturnOrderControllerScope,
            private authService: Core.Auth.IAuthService,
            private returnOrderService: Api.IReturnOrderService,
            $location: ng.ILocationService,
            private popupMessageService: Core.IPopupMessageService,
            private $modalService: ng.ui.bootstrap.IModalService,
            translationService: Core.ITranslationService,
            private constants: Core.IConstants)
            {

            var authorizedToAccessReturns = authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_Ordering_CanReturn);
            if (!authorizedToAccessReturns) {
                $location.path("/Core/Forbidden");
                return;
            }

            $scope.Translations = <Api.Models.IL10N>{};

            $scope.Model = {
                FilterText: "",
                DateRange: ""
            };

                this.$scope.ChangePage = (page: number): void => {
                    this.$scope.CurrentPage = page;
                    var index = (page - 1) * $scope.PagingOptions.itemsPerPage;
                    this.$scope.CurrentPageOrders = this.$scope.FilteredOrders.slice(index, index + this.$scope.PagingOptions.itemsPerPage);
                };

                $scope.PagingOptions = {
                    itemsPerPage: 20,
                    numPages: 5
                };

            $scope.Orders = [];
            $scope.FilteredOrders = [];
            $scope.CurrentPageOrders = [];

            $scope.$watch("Model.FilterText", (): void => {
                this.ApplySearchFilterAndOrder();
            });

            $scope.FilterLast = (days: number): void => {
                $scope.Model.DateRange = $scope.Translations.Last + " " + days + " " + $scope.Translations.Days;

                this.LoadData(moment().add("d", -days), moment());
            };

            $scope.RequiresPaging = (): boolean => {
                return ($scope.Orders.length > $scope.PagingOptions.itemsPerPage);
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

            translationService.GetTranslations().then((result: Core.Api.Models.ITranslations): void => {
                $scope.Translations = result.InventoryOrder;
                popupMessageService.SetPageTitle(result.InventoryOrder.ReturnOrder);
                $scope.FilterLast(14);
            });

            $scope.ViewOrder = (order: Api.Models.IReceiveOrderHeader): void=> {
                $location.path("/Inventory/Order/Return/Details/" + order.DisplayId);
            };

        }

        private LoadData(startDate: Moment, endDate: Moment): void {
            var user = this.authService.GetUser();

            this.returnOrderService.GetReceivedOrders(
                user.BusinessUser.MobileSettings.EntityId,
                startDate.format(this.constants.InternalDateTimeFormat),
                endDate.format(this.constants.InternalDateTimeFormat))
                .success((results: Api.Models.IReceiveOrderHeader[]): void => {
                    this.$scope.Orders = results;
                    this.ApplySearchFilterAndOrder();
                });
        }

        private ApplySearchFilterAndOrder(): void {
            var upperCaseSearchFilterText = this.$scope.Model.FilterText.toUpperCase();
            this.$scope.FilteredOrders = _.filter(this.$scope.Orders, (item: Api.Models.IReceiveOrderHeader): boolean => {
                if (item.VendorName.toUpperCase().indexOf(upperCaseSearchFilterText) > -1) {
                    return true;
                }

                var orderIdString: string = item.DisplayId.toString();
                if (orderIdString.indexOf(upperCaseSearchFilterText) > -1) {
                    return true;
                }

                return false;
            });

            this.$scope.FilteredOrders = _.sortBy(this.$scope.FilteredOrders, [this._idPropertyName]);

            this.$scope.ChangePage(1);
        }
    }

    Core.NG.InventoryOrderModule.RegisterRouteController("Return", "Templates/Return.html", ReturnOrderController,
        Core.NG.$typedScope<IReturnOrderControllerScope>(),
        Core.Auth.$authService,
        Api.$returnOrderService,
        Core.NG.$location,
        Core.$popupMessageService,
        Core.NG.$modal,
        Core.$translation,
        Core.Constants
        );
}