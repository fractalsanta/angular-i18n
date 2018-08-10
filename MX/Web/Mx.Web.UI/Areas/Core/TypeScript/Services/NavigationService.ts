module Core {
    "use strict";

    export interface INavigationService {
        NavItems(): INavigationItem[];
        NavState(): { Expanded: boolean };
    }

    export class NavigationService implements INavigationService {

        private _navItems: INavigationItem[];
        private _navState: { Expanded: boolean };
        private _countNavs: ICountNavigationItem[];
        private _updatingNavs: boolean;
        private _signalRConnected: boolean;

        constructor(
            private authService: Core.Auth.IAuthService,
            private countTypeService: Inventory.Count.Api.ICountTypeService,
            private signalR: Core.ISignalRService,
            private $translation: Core.ITranslationService,
            private settingService: Administration.Settings.Api.ISettingsService,
            $rootScope: ng.IRootScopeService,
            $modalStack: ng.ui.bootstrap.IModalStackService) {

            this._navState = { Expanded: false };
            this._navItems = [];

            this._signalRConnected = signalR.HubExists();

            this.UpdateNavs();

            this.signalR.SetSignalREventListener(<any>Core.SignalRServerMethods.CountStateChanged, (): void => {
                this.UpdateCountState();
            });

            this.signalR.SetConnectedListener((): void => {
                if (!this._signalRConnected) {
                    this._signalRConnected = true;
                    this.UpdateCountState();
                }
            });

            this.signalR.SetDisconnectedListener((): void => {
                this._signalRConnected = false;
            });

            this.signalR.SetReconnectedListener((): void => {
                this.UpdateCountState();
            });

            var overridePaths = {
                "/Core/Forbidden": true,
                "/Core/404": true
            };

            $rootScope.$on("$locationChangeStart", (e: ng.IAngularEvent, toUrl?: string): void => {
                toUrl = (toUrl) ? toUrl.split("#")[1] : "";

                if ($modalStack.getTop() && !overridePaths[toUrl]) {
                    e.preventDefault();
                } else {
                    $modalStack.dismissAll();
                }
            });

            $rootScope.$on(ApplicationEvent.ChangeStore, (): void => {
                this.UpdateCountState();
                this._navState = { Expanded: false };
            });

            $rootScope.$on(ApplicationEvent.Logout, (): void => {
                this._navState = { Expanded: false };
                this._navItems = [];
                $modalStack.dismissAll();
            });
        }

        private UpdateNavs(): void {
            if (this._updatingNavs) {
                return;
            }

            this._updatingNavs = true;

            if (this._navItems.length > 0) {
                return;
            }

            //Load Translations
            this.$translation.GetTranslations().then((result: Api.Models.ITranslations): void => {

                //List of all menu item configuration settings to load
                var configurationSettings: Core.Api.Models.ConfigurationSetting[] = [
                    Core.Api.Models.ConfigurationSetting.System_Operations_HotSchedulesSamlSsoUrl
                ];

                //Load Configuration settings used for menu items
                this.settingService.GetConfigurationSettings(configurationSettings).then((settings): void => {

                    var navigationMenu: INavigationItem[] = [
                        {
                            Title: result.Core.MenuOperations,
                            Icon: "glyphicon glyphicon-dashboard",
                            Permissions: [Api.Models.Task.Reporting_Dashboard_CanView,
                                Api.Models.Task.Operations_StoreSummary_CanAccess,
                                Api.Models.Task.Operations_AreaSummary_CanAccess,
                                Api.Models.Task.Operations_ProductMix_CanAccess],
                            SubNavs: [
                                {
                                    Title: result.Dashboard.Dashboard,
                                    Url: "/Reporting/Dashboard",
                                    Permissions: [Api.Models.Task.Reporting_Dashboard_CanView]
                                },
                                {
                                    Title: result.OperationsReportingAreaSummary.AreaSummary,
                                    Url: "/Operations/Reporting/AreaSummary",
                                    Permissions: [Api.Models.Task.Operations_AreaSummary_CanAccess]
                                },
                                {
                                    Title: result.OperationsReportingStoreSummary.StoreSummary,
                                    Url: "/Operations/Reporting/StoreSummary",
                                    Permissions: [Api.Models.Task.Operations_StoreSummary_CanAccess]
                                },
                                {
                                    Title: result.OperationsReportingInventoryMovement.InventoryMovement,
                                    Url: "/Operations/Reporting/InventoryMovement",
                                    Permissions: [Api.Models.Task.Operations_InventoryMovement_CanAccess]
                                },
                                {
                                    Title: result.OperationsReportingProductMix.ProductMix,
                                    Url: "/Operations/Reporting/ProductMix",
                                    Permissions: [Api.Models.Task.Operations_ProductMix_CanAccess]
                                }
                            ]
                        },
                        {
                            Title: result.Forecasting.MenuForecast,
                            Icon: "fa fa-bar-chart-o",
                            Permissions: [Api.Models.Task.Forecasting_CanView],
                            SubNavs: [
                                {
                                    Title: result.Forecasting.MenuSales,
                                    Url: "/Forecasting/View?metric=sales"
                                },
                                {
                                    Title: result.Forecasting.MenuTransactions,
                                    Url: "/Forecasting/View?metric=transactions"
                                },
                                {
                                    Title: result.Forecasting.MenuSalesItems,
                                    Url: "/Forecasting/View?metric=salesitems"
                                },
                                {
                                    Title: result.Forecasting.MenuPromotions,
                                    Url: "/Forecasting/Promotions",
                                    Permissions: [Api.Models.Task.Forecasting_Promotions_CanView]
                                },
                                {
                                    Title: result.Forecasting.MenuEvents,
                                    Url: "/Forecasting/Events",
                                    Permissions: [Api.Models.Task.Forecasting_Event_CanView]
                                },
                                {
                                    Title: result.Forecasting.MenuSalesItemMirroring,
                                    Url: "/Forecasting/Mirroring/SalesItems",
                                    Permissions: [Api.Models.Task.Forecasting_SalesItemMirroring_CanAccess]
                                },
                                {
                                    Title: result.Forecasting.MenuStoreMirroring,
                                    Url: "/Forecasting/Mirroring/Stores",
                                    Permissions: [Api.Models.Task.Forecasting_StoreMirroring_CanAccess]
                                }
                            ]
                        },
                        {
                            Title: result.Forecasting.MenuForecastEvaluator,
                            Url: "/Forecasting/Evaluator/Graph/Sales",
                            Icon: "fa fa-bar-chart-o",
                            Permissions: [Api.Models.Task.Forecasting_CanView]
                        },
                        {
                            Title: result.InventoryCount.InventoryCount,
                            Icon: "fa fa-truck fa-flip-horizontal",
                            SubNavs: this.GenerateCountNavItems(result)
                        },
                        {
                            Title: result.InventoryOrder.InventoryOrder,
                            Icon: "fa fa-truck fa-flip-horizontal",
                            Permissions: [Api.Models.Task.Inventory_Ordering_CanView],
                            SubNavs: [
                                {
                                    Title: result.InventoryOrder.Place,
                                    Url: "/Inventory/Order/Place",
                                    Permissions: [Api.Models.Task.Inventory_Ordering_Place_CanView]
                                },
                                {
                                    Title: result.InventoryOrder.Receive,
                                    Url: "/Inventory/Order/Receive",
                                    Permissions: [Api.Models.Task.Inventory_Ordering_Receive_CanView]
                                },
                                {
                                    Title: result.InventoryOrder.MenuReturn,
                                    Url: "/Inventory/Order/Return",
                                    Permissions: [Api.Models.Task.Inventory_Ordering_CanReturn]
                                },
                                {
                                    Title: result.InventoryOrder.History,
                                    Url: "/Inventory/Order/History",
                                    Permissions: [Api.Models.Task.Inventory_Ordering_History_CanView]
                                }
                            ]
                        },
                        {
                            Title: result.InventoryTransfer.InventoryTransfer,
                            Icon: "fa fa-truck fa-flip-horizontal",
                            Permissions: [Api.Models.Task.Inventory_Transfers_CanRequestTransferIn, Api.Models.Task.Inventory_Transfers_CanCreateTransferOut],
                            SubNavs: [
                                {
                                    Title: result.InventoryTransfer.Create,
                                    Url: "/Inventory/Transfer/InitiateTransfer/create",
                                    Permissions: [Api.Models.Task.Inventory_Transfers_CanCreateTransferOut]
                                },
                                {
                                    Title: result.InventoryTransfer.Request,
                                    Url: "/Inventory/Transfer/InitiateTransfer/request",
                                    Permissions: [Api.Models.Task.Inventory_Transfers_CanRequestTransferIn]
                                },
                                {
                                    Title: result.InventoryTransfer.OpenTransfers,
                                    Url: "/Inventory/Transfer/OpenTransfers",
                                    Permissions: [Api.Models.Task.Inventory_Transfers_CanRequestTransferIn, Api.Models.Task.Inventory_Transfers_CanCreateTransferOut]
                                },
                                {
                                    Title: result.InventoryTransfer.History,
                                    Url: "/Inventory/Transfer/History",
                                    Permissions: [Api.Models.Task.Inventory_Transfers_CanRequestTransferIn, Api.Models.Task.Inventory_Transfers_CanCreateTransferOut]
                                }
                            ]
                        },
                        {
                            Title: result.InventoryWaste.InventoryWaste,
                            Icon: "fa fa-truck fa-flip-horizontal",
                            Permissions: [Api.Models.Task.Inventory_Waste_CanView],
                            SubNavs: [
                                { Title: result.InventoryWaste.MenuRecord, Url: "/Inventory/Waste/Record" },
                                {
                                    Title: result.InventoryWaste.MenuHistory,
                                    Url: "/Inventory/Waste/History",
                                    Permissions: [Api.Models.Task.Inventory_Waste_History_CanView]
                                }
                            ]
                        },
                        {
                            Title: result.InventoryProduction.Production,
                            Icon: "fa fa-truck fa-flip-horizontal",
                            Permissions: [Api.Models.Task.Inventory_PrepAdjust_CanView],
                            SubNavs: [
                                {
                                    Title: result.InventoryProduction.PrepAdjustment,
                                    Url: "/Inventory/Production/PrepAdjust",
                                    Permissions: [Api.Models.Task.Inventory_PrepAdjust_CanView]
                                }

                            ]
                        },
                        {
                            Title: result.Hierarchy.Setup,
                            Icon: "fa fa-gears",
                            SubNavs: [
                                {
                                    Title: result.Hierarchy.Hierarchy,
                                    Url: "/Administration/Hierarchy",
                                    Permissions: [Api.Models.Task.Administration_Hierarchy_CanView]
                                },
                                {
                                    Title: result.User.UserSetup,
                                    Url: "/Administration/User",
                                    Permissions: [Api.Models.Task.Administration_UserSetup_CanView]
                                }
                            ]
                        },
                        {
                            Title: result.Core.Workforce,
                            Icon: "fa fa-book",
                            Permissions: [Api.Models.Task.Labor_EmployeePortal_CanView],
                            SubNavs: [
                                {
                                    Title: result.WorkforceMySchedule.MySchedule,
                                    Url: "/Workforce/MySchedule",
                                    Permissions: [Api.Models.Task.Labor_EmployeePortal_MySchedule_CanView]
                                },
                                {
                                    Title: result.WorkforceMyAvailability.MyAvailability,
                                    Url: "/Workforce/MyAvailability",
                                    Permissions: [Api.Models.Task.Labor_EmployeePortal_Availability_CanView]
                                },
                                {
                                    Title: result.WorkforceMyTimeCard.MyTimeCard,
                                    Url: "/Workforce/MyTimeCard",
                                    Permissions: [Api.Models.Task.Labor_EmployeePortal_TimeCard_CanView]
                                },
                                {
                                    Title: result.WorkforceMyTimeOff.MyTimeOff,
                                    Url: "/Workforce/MyTimeOff",
                                    Permissions: [Api.Models.Task.Labor_EmployeePortal_MyTimeOff_CanView]
                                },
                                {
                                    Title: result.WorkforceMyDetails.MyDetails,
                                    Url: "/Workforce/MyDetails",
                                    Permissions: [Api.Models.Task.Labor_EmployeePortal_MyDetails_CanView]
                                },
                                {
                                    Title: result.WorkforceDeliveries.Deliveries,
                                    Url: "/Workforce/Deliveries",
                                    Permissions: [Api.Models.Task.Labor_EmployeePortal_Deliveries_CanView]
                                },
                                {
                                    Title: result.WorkforceDriverDistance.DriverDistance,
                                    Url: "/Workforce/DriverDistance",
                                    Permissions: [Api.Models.Task.Labor_EmployeePortal_DriverDistance_CanView]
                                }
                            ]
                        },
                        {
                            Title: result.DataLoad.DataLoad,
                            Url: "/Administration/DataLoad",
                            Icon: "fa fa-folder-open-o",
                            Permissions: [Api.Models.Task.DataLoad_CanView]
                        },                       
                        {
                            Title: result.PartnerRedirect.PartnerRedirect,
                            Url: "/Core/PartnerRedirect",
                            Icon: "icons-hotschedules",
                            Permissions: [Api.Models.Task.Core_PartnerRedirect_CanAccess]
                        },
                        {
                            Title: result.Core.HsSsoRedirect,
                            Url: <string>settings.data.System_Operations_HotSchedulesSamlSsoUrl,
                            Icon: "icons-hotschedules",
                            Permissions: [Api.Models.Task.Operations_HotSchedulesSamlSso_CanAccess],
                            OpenLinkInNewTab: true
                        }
                    ];

                    this._navItems.push.apply(this._navItems, this.ProcessMenuPermissions(navigationMenu));

                    this.UpdateCountState();
                    this._updatingNavs = false;

                });
            });
        }

        private UpdateCountState(): void {
            var user = this.authService.GetUser();
            if (user.IsAuthenticated && user.BusinessUser && this._signalRConnected) {
                this.countTypeService.Get(user.BusinessUser.MobileSettings.EntityId).success((activeCountStates: Inventory.Count.Api.Models.ICountStatusResponse[]): void => {
                    angular.forEach(this._countNavs, (value: ICountNavigationItem): void => {
                        if (value.Type !== undefined) {
                            var status = _.find(activeCountStates, (state => { return state.CountOf === value.Type; }));
                            if (status) {
                                value.IsAvailable = true;
                                value.InProgress = status.IsActive;
                            }
                            else {
                                value.IsAvailable = false;
                            }
                        }
                    });
                });
            }
        }

        public NavItems(): INavigationItem[] {
            if (!this._navItems.length) {
                this.UpdateNavs();
            }
            return this._navItems;
        }

        public NavState(): { Expanded: boolean } {
            if (!this._navItems.length) {
                this.UpdateNavs();
            }
            return this._navState;
        }

        private GenerateCountNavItems(translations: Api.Models.ITranslations): INavigationItem[] {
            this._countNavs = [];

            if (this.authService.CheckPermissionAllowance(Api.Models.Task.Inventory_InventoryCount_CanView)) {
                this._countNavs.push(
                    { Title: translations.InventoryCount.Spot, Url: "/Inventory/Count/Edit/Spot", Type: Inventory.Count.Api.Models.CountType.Spot },
                    { Title: translations.InventoryCount.Daily, Url: "/Inventory/Count/Edit/Daily", Type: Inventory.Count.Api.Models.CountType.Daily },
                    { Title: translations.InventoryCount.Weekly, Url: "/Inventory/Count/Edit/Weekly", Type: Inventory.Count.Api.Models.CountType.Weekly },
                    { Title: translations.InventoryCount.Monthly, Url: "/Inventory/Count/Edit/Monthly", Type: Inventory.Count.Api.Models.CountType.Monthly },
                    { Title: translations.InventoryCount.Periodic, Url: "/Inventory/Count/Edit/Periodic", Type: Inventory.Count.Api.Models.CountType.Periodic }
                    );
            }

            if (this.authService.CheckPermissionAllowance(
                Api.Models.Task.Inventory_TravelPath_DailyFrequency_CanView,
                Api.Models.Task.Inventory_TravelPath_SpotFrequency_CanView,
                Api.Models.Task.Inventory_TravelPath_WeeklyFrequency_CanView,
                Api.Models.Task.Inventory_TravelPath_MonthlyFrequency_CanView,
                Api.Models.Task.Inventory_TravelPath_PeriodicFrequency_CanView)) {
                this._countNavs.push({ Title: translations.InventoryCount.TravelPath, Url: "/Inventory/Count/TravelPath" });
            }

            return this._countNavs;
        }

        private ProcessMenuPermissions(menu: INavigationItem[]): INavigationItem[] {
            var filteredMenu: INavigationItem[] = [],
                menuLength = menu.length,
                currentMenuItem: INavigationItem,
                i: number;

            for (i = 0; i < menuLength; i += 1) {
                currentMenuItem = menu[i];

                if (currentMenuItem.Permissions && currentMenuItem.Permissions.length) {
                    if (!this.authService.CheckPermissionAllowance.apply(this.authService, currentMenuItem.Permissions)) {
                        continue;
                    }
                }

                if (currentMenuItem.SubNavs && currentMenuItem.SubNavs.length) {
                    currentMenuItem.SubNavs = this.ProcessMenuPermissions(currentMenuItem.SubNavs);
                }

                filteredMenu.push(currentMenuItem);
            }

            return filteredMenu;
        }
    }

    export var $navigationService: NG.INamedDependency<INavigationService> =
        NG.CoreModule.RegisterService("Navigation",
            NavigationService,
            Auth.$authService,
            Inventory.Count.Api.$countTypeService,
            $signalR,
            $translation,
            Administration.Settings.Api.$settingsService,
            NG.$rootScope,
            NG.$modalStack);
}
