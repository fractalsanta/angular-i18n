module Inventory.Order {
    "use strict";

    class NewOrderController {
        constructor(
            $scope: INewOrderControllerScope,
            $modalInstance: ng.ui.bootstrap.IModalServiceInstance,
            $authService: Core.Auth.IAuthService,
            $vendorService: Api.IVendorService,
            $orderService: Order.IOrderService,
            $stateService: ng.ui.IStateService,
            translationService: Core.ITranslationService,
            private constants: Core.IConstants,
            private userSettingService: Administration.User.Services.IUserSettingsService,
            $periodCloseService: Workforce.PeriodClose.Api.IPeriodCloseService
        ) {

            var user = $authService.GetUser(),
                daysToCover = 0;

            $scope.Translations = <Api.Models.IL10N>{};

            $scope.FormData = {
                ShowDeliveryDate: false,
                ShowCoverDate: false,
                Vendors: [],
                SelectedVendor: null,
                DeliveryMinimumDate: new Date(),
                DeliveryDate: null,
                CoverMinimumDate: null,
                CoverUntilDate: null,
                PreferredVendorId: null,
                PeriodClosed: false
            };            

            $vendorService.Get(user.BusinessUser.MobileSettings.EntityId)
                .success((results: Order.Api.Models.IVendor[]): void => {
                    results = _.sortBy(results, "Name");
                    $scope.FormData.Vendors = results;
                    userSettingService.GetUserSetting(Administration.User.Api.Models.UserSettingEnum.DefaultSupplierPreference).then(result => {
                        $scope.FormData.PreferredVendorId = parseInt(result);
                    }).catch((): void => {
                        $scope.FormData.PreferredVendorId = -1;
                    }).finally(() =>
                    {
                        var favoriteVendor = _.filter($scope.FormData.Vendors, (filterVendor) => filterVendor.Id == $scope.FormData.PreferredVendorId);

                        $scope.SelectVendor(favoriteVendor.length > 0 ? favoriteVendor[0] : results[0]);                        
                    });

                    $scope.UpdatePeriodClosedStatus();
                });                        

            $scope.OpenDeliveryDate = ($event: Event): void => {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.FormData.ShowDeliveryDate = !$scope.FormData.ShowDeliveryDate;
                $scope.FormData.ShowCoverDate = false;
            };

            $scope.OpenCoverDate = ($event: Event): void => {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.FormData.ShowCoverDate = !$scope.FormData.ShowCoverDate;
                $scope.FormData.ShowDeliveryDate = false;
            };

            $scope.OnDeliveryChange = (newDate: Date): void => {
                if (!newDate) {
                    $scope.FormData.DeliveryDate = newDate = new Date();
                }

                $scope.FormData.CoverMinimumDate = moment(newDate).add("d", 1).toDate();

                if ($scope.FormData.CoverUntilDate < $scope.FormData.CoverMinimumDate) {
                    $scope.FormData.CoverUntilDate = $scope.FormData.CoverMinimumDate;
                }

                $scope.OnCoverChange($scope.FormData.CoverUntilDate);
            };

            $scope.OnCoverChange = (newDate: Date): void => {
                if ($scope.FormData.DeliveryDate) {
                    daysToCover = moment(newDate).diff(moment($scope.FormData.DeliveryDate), "days");
                }
            };

            $scope.CollapseCalendars = (): void => {
                $scope.FormData.ShowCoverDate = false;
                $scope.FormData.ShowDeliveryDate = false;
            };

            $scope.Cancel = (): void => {
                $modalInstance.dismiss();
            };

            $scope.Confirm = (): void => {                
                $orderService.PostCreateAutoSelectTemplate(
                        user.BusinessUser.MobileSettings.EntityId,
                        $scope.FormData.SelectedVendor.Id,
                        moment($scope.FormData.DeliveryDate).format(constants.InternalDateTimeFormat),
                        daysToCover)
                    .then(result => {
                        $modalInstance.close();
                        $stateService.go(Core.UiRouterState.OrderStates.Details, { OrderId: result });
                    });
            };

            translationService.GetTranslations().then(result => {
                $scope.Translations = result.InventoryOrder;
            });

            $scope.SelectVendor = (vendor: Api.Models.IVendor): void => {
                $scope.FormData.SelectedVendor = vendor;
            };
            $scope.SetPreferredVendor = ($event: Event, vendorId: number): void => {

                if (vendorId == $scope.FormData.PreferredVendorId)
                    vendorId = -1;

                userSettingService.SetUserSetting(Administration.User.Api.Models.UserSettingEnum.DefaultSupplierPreference, vendorId.toString());
                $scope.FormData.PreferredVendorId = vendorId;
                $event.preventDefault();
                $event.stopPropagation();
            };

            $scope.UpdatePeriodClosedStatus = () => {
                $orderService.GetStoreLocalDateTimeString()
                    .success((result) => {
                        $periodCloseService.GetPeriodLockStatus(user.BusinessUser.MobileSettings.EntityId, moment(result).format(this.constants.InternalDateFormat))
                            .success((result) => {
                                $scope.FormData.PeriodClosed = (result.IsClosed && !$authService.CheckPermissionAllowance(Core.Api.Models.Task.Orders_CanEditClosedPeriods));
                            });
                    });
            };
        }
    }

    Core.NG.InventoryOrderModule.RegisterNamedController("NewOrder", NewOrderController,
        Core.NG.$typedScope<INewOrderControllerScope>(),
        Core.NG.$modalInstance,
        Core.Auth.$authService,
        Api.$vendorService,
        Order.$orderService,
        Core.NG.$state,
        Core.$translation,
        Core.Constants,
        Administration.User.Services.$userSettingService,
        Workforce.PeriodClose.Api.$periodCloseService);
}