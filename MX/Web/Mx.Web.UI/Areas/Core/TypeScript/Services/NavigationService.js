var Core;
(function (Core) {
    "use strict";
    var NavigationService = (function () {
        function NavigationService(authService, countTypeService, signalR, $translation, settingService, $rootScope, $modalStack) {
            var _this = this;
            this.authService = authService;
            this.countTypeService = countTypeService;
            this.signalR = signalR;
            this.$translation = $translation;
            this.settingService = settingService;
            this._navState = { Expanded: false };
            this._navItems = [];
            this._signalRConnected = signalR.HubExists();
            this.UpdateNavs();
            this.signalR.SetSignalREventListener(Core.SignalRServerMethods.CountStateChanged, function () {
                _this.UpdateCountState();
            });
            this.signalR.SetConnectedListener(function () {
                if (!_this._signalRConnected) {
                    _this._signalRConnected = true;
                    _this.UpdateCountState();
                }
            });
            this.signalR.SetDisconnectedListener(function () {
                _this._signalRConnected = false;
            });
            this.signalR.SetReconnectedListener(function () {
                _this.UpdateCountState();
            });
            var overridePaths = {
                "/Core/Forbidden": true,
                "/Core/404": true
            };
            $rootScope.$on("$locationChangeStart", function (e, toUrl) {
                toUrl = (toUrl) ? toUrl.split("#")[1] : "";
                if ($modalStack.getTop() && !overridePaths[toUrl]) {
                    e.preventDefault();
                }
                else {
                    $modalStack.dismissAll();
                }
            });
            $rootScope.$on(Core.ApplicationEvent.ChangeStore, function () {
                _this.UpdateCountState();
                _this._navState = { Expanded: false };
            });
            $rootScope.$on(Core.ApplicationEvent.Logout, function () {
                _this._navState = { Expanded: false };
                _this._navItems = [];
                $modalStack.dismissAll();
            });
        }
        NavigationService.prototype.UpdateNavs = function () {
            var _this = this;
            if (this._updatingNavs) {
                return;
            }
            this._updatingNavs = true;
            if (this._navItems.length > 0) {
                return;
            }
            this.$translation.GetTranslations().then(function (result) {
                var configurationSettings = [
                    Core.Api.Models.ConfigurationSetting.System_Operations_HotSchedulesSamlSsoUrl
                ];
                _this.settingService.GetConfigurationSettings(configurationSettings).then(function (settings) {
                    var navigationMenu = [
                        {
                            Title: result.Core.MenuOperations,
                            Icon: "glyphicon glyphicon-dashboard",
                            Permissions: [Core.Api.Models.Task.Reporting_Dashboard_CanView,
                                Core.Api.Models.Task.Operations_StoreSummary_CanAccess,
                                Core.Api.Models.Task.Operations_AreaSummary_CanAccess,
                                Core.Api.Models.Task.Operations_ProductMix_CanAccess],
                            SubNavs: [
                                {
                                    Title: result.Dashboard.Dashboard,
                                    Url: "/Reporting/Dashboard",
                                    Permissions: [Core.Api.Models.Task.Reporting_Dashboard_CanView]
                                },
                                {
                                    Title: result.OperationsReportingAreaSummary.AreaSummary,
                                    Url: "/Operations/Reporting/AreaSummary",
                                    Permissions: [Core.Api.Models.Task.Operations_AreaSummary_CanAccess]
                                },
                                {
                                    Title: result.OperationsReportingStoreSummary.StoreSummary,
                                    Url: "/Operations/Reporting/StoreSummary",
                                    Permissions: [Core.Api.Models.Task.Operations_StoreSummary_CanAccess]
                                },
                                {
                                    Title: result.OperationsReportingInventoryMovement.InventoryMovement,
                                    Url: "/Operations/Reporting/InventoryMovement",
                                    Permissions: [Core.Api.Models.Task.Operations_InventoryMovement_CanAccess]
                                },
                                {
                                    Title: result.OperationsReportingProductMix.ProductMix,
                                    Url: "/Operations/Reporting/ProductMix",
                                    Permissions: [Core.Api.Models.Task.Operations_ProductMix_CanAccess]
                                }
                            ]
                        },
                        {
                            Title: result.Forecasting.MenuForecast,
                            Icon: "fa fa-umbrella",
                            Permissions: [Core.Api.Models.Task.Forecasting_CanView],
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
                                    Permissions: [Core.Api.Models.Task.Forecasting_Promotions_CanView]
                                },
                                {
                                    Title: result.Forecasting.MenuEvents,
                                    Url: "/Forecasting/Events",
                                    Permissions: [Core.Api.Models.Task.Forecasting_Event_CanView]
                                },
                                {
                                    Title: result.Forecasting.MenuSalesItemMirroring,
                                    Url: "/Forecasting/Mirroring/SalesItems",
                                    Permissions: [Core.Api.Models.Task.Forecasting_SalesItemMirroring_CanAccess]
                                },
                                {
                                    Title: result.Forecasting.MenuStoreMirroring,
                                    Url: "/Forecasting/Mirroring/Stores",
                                    Permissions: [Core.Api.Models.Task.Forecasting_StoreMirroring_CanAccess]
                                }
                            ]
                        },
                        {
                            Title: result.Forecasting.MenuForecastEvaluator,
                            Url: "/Forecasting/Evaluator/Graph/Sales",
                            Icon: "fa fa-umbrella",
                            Permissions: [Core.Api.Models.Task.Forecasting_CanView]
                        },
                        {
                            Title: result.InventoryCount.InventoryCount,
                            Icon: "fa fa-truck",
                            SubNavs: _this.GenerateCountNavItems(result)
                        },
                        {
                            Title: result.InventoryOrder.InventoryOrder,
                            Icon: "fa fa-truck",
                            Permissions: [Core.Api.Models.Task.Inventory_Ordering_CanView],
                            SubNavs: [
                                {
                                    Title: result.InventoryOrder.Place,
                                    Url: "/Inventory/Order/Place",
                                    Permissions: [Core.Api.Models.Task.Inventory_Ordering_Place_CanView]
                                },
                                {
                                    Title: result.InventoryOrder.Receive,
                                    Url: "/Inventory/Order/Receive",
                                    Permissions: [Core.Api.Models.Task.Inventory_Ordering_Receive_CanView]
                                },
                                {
                                    Title: result.InventoryOrder.MenuReturn,
                                    Url: "/Inventory/Order/Return",
                                    Permissions: [Core.Api.Models.Task.Inventory_Ordering_CanReturn]
                                },
                                {
                                    Title: result.InventoryOrder.History,
                                    Url: "/Inventory/Order/History",
                                    Permissions: [Core.Api.Models.Task.Inventory_Ordering_History_CanView]
                                }
                            ]
                        },
                        {
                            Title: result.InventoryTransfer.InventoryTransfer,
                            Icon: "fa fa-truck",
                            Permissions: [Core.Api.Models.Task.Inventory_Transfers_CanRequestTransferIn, Core.Api.Models.Task.Inventory_Transfers_CanCreateTransferOut],
                            SubNavs: [
                                {
                                    Title: result.InventoryTransfer.Create,
                                    Url: "/Inventory/Transfer/InitiateTransfer/create",
                                    Permissions: [Core.Api.Models.Task.Inventory_Transfers_CanCreateTransferOut]
                                },
                                {
                                    Title: result.InventoryTransfer.Request,
                                    Url: "/Inventory/Transfer/InitiateTransfer/request",
                                    Permissions: [Core.Api.Models.Task.Inventory_Transfers_CanRequestTransferIn]
                                },
                                {
                                    Title: result.InventoryTransfer.OpenTransfers,
                                    Url: "/Inventory/Transfer/OpenTransfers",
                                    Permissions: [Core.Api.Models.Task.Inventory_Transfers_CanRequestTransferIn, Core.Api.Models.Task.Inventory_Transfers_CanCreateTransferOut]
                                },
                                {
                                    Title: result.InventoryTransfer.History,
                                    Url: "/Inventory/Transfer/History",
                                    Permissions: [Core.Api.Models.Task.Inventory_Transfers_CanRequestTransferIn, Core.Api.Models.Task.Inventory_Transfers_CanCreateTransferOut]
                                }
                            ]
                        },
                        {
                            Title: result.InventoryWaste.InventoryWaste,
                            Icon: "fa fa-truck",
                            Permissions: [Core.Api.Models.Task.Inventory_Waste_CanView],
                            SubNavs: [
                                { Title: result.InventoryWaste.MenuRecord, Url: "/Inventory/Waste/Record" },
                                {
                                    Title: result.InventoryWaste.MenuHistory,
                                    Url: "/Inventory/Waste/History",
                                    Permissions: [Core.Api.Models.Task.Inventory_Waste_History_CanView]
                                }
                            ]
                        },
                        {
                            Title: result.InventoryProduction.Production,
                            Icon: "fa fa-truck",
                            Permissions: [Core.Api.Models.Task.Inventory_PrepAdjust_CanView],
                            SubNavs: [
                                {
                                    Title: result.InventoryProduction.PrepAdjustment,
                                    Url: "/Inventory/Production/PrepAdjust",
                                    Permissions: [Core.Api.Models.Task.Inventory_PrepAdjust_CanView]
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
                                    Permissions: [Core.Api.Models.Task.Administration_Hierarchy_CanView]
                                },
                                {
                                    Title: result.User.UserSetup,
                                    Url: "/Administration/User",
                                    Permissions: [Core.Api.Models.Task.Administration_UserSetup_CanView]
                                }
                            ]
                        },
                        {
                            Title: result.Core.Workforce,
                            Icon: "fa fa-book",
                            Permissions: [Core.Api.Models.Task.Labor_EmployeePortal_CanView],
                            SubNavs: [
                                {
                                    Title: result.WorkforceMySchedule.MySchedule,
                                    Url: "/Workforce/MySchedule",
                                    Permissions: [Core.Api.Models.Task.Labor_EmployeePortal_MySchedule_CanView]
                                },
                                {
                                    Title: result.WorkforceMyAvailability.MyAvailability,
                                    Url: "/Workforce/MyAvailability",
                                    Permissions: [Core.Api.Models.Task.Labor_EmployeePortal_Availability_CanView]
                                },
                                {
                                    Title: result.WorkforceMyTimeCard.MyTimeCard,
                                    Url: "/Workforce/MyTimeCard",
                                    Permissions: [Core.Api.Models.Task.Labor_EmployeePortal_TimeCard_CanView]
                                },
                                {
                                    Title: result.WorkforceMyTimeOff.MyTimeOff,
                                    Url: "/Workforce/MyTimeOff",
                                    Permissions: [Core.Api.Models.Task.Labor_EmployeePortal_MyTimeOff_CanView]
                                },
                                {
                                    Title: result.WorkforceMyDetails.MyDetails,
                                    Url: "/Workforce/MyDetails",
                                    Permissions: [Core.Api.Models.Task.Labor_EmployeePortal_MyDetails_CanView]
                                },
                                {
                                    Title: result.WorkforceDeliveries.Deliveries,
                                    Url: "/Workforce/Deliveries",
                                    Permissions: [Core.Api.Models.Task.Labor_EmployeePortal_Deliveries_CanView]
                                },
                                {
                                    Title: result.WorkforceDriverDistance.DriverDistance,
                                    Url: "/Workforce/DriverDistance",
                                    Permissions: [Core.Api.Models.Task.Labor_EmployeePortal_DriverDistance_CanView]
                                }
                            ]
                        },
                        {
                            Title: result.DataLoad.DataLoad,
                            Url: "/Administration/DataLoad",
                            Icon: "fa fa-folder-open-o",
                            Permissions: [Core.Api.Models.Task.DataLoad_CanView]
                        },
                        {
                            Title: result.PartnerRedirect.PartnerRedirect,
                            Url: "/Core/PartnerRedirect",
                            Icon: "icons-hotschedules",
                            Permissions: [Core.Api.Models.Task.Core_PartnerRedirect_CanAccess]
                        },
                        {
                            Title: result.Core.HsSsoRedirect,
                            Url: settings.data.System_Operations_HotSchedulesSamlSsoUrl,
                            Icon: "icons-hotschedules",
                            Permissions: [Core.Api.Models.Task.Operations_HotSchedulesSamlSso_CanAccess],
                            OpenLinkInNewTab: true
                        }
                    ];
                    _this._navItems.push.apply(_this._navItems, _this.ProcessMenuPermissions(navigationMenu));
                    _this.UpdateCountState();
                    _this._updatingNavs = false;
                });
            });
        };
        NavigationService.prototype.UpdateCountState = function () {
            var _this = this;
            var user = this.authService.GetUser();
            if (user.IsAuthenticated && user.BusinessUser && this._signalRConnected) {
                this.countTypeService.Get(user.BusinessUser.MobileSettings.EntityId).success(function (activeCountStates) {
                    angular.forEach(_this._countNavs, function (value) {
                        if (value.Type !== undefined) {
                            var status = _.find(activeCountStates, (function (state) { return state.CountOf === value.Type; }));
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
        };
        NavigationService.prototype.NavItems = function () {
            if (!this._navItems.length) {
                this.UpdateNavs();
            }
            return this._navItems;
        };
        NavigationService.prototype.NavState = function () {
            if (!this._navItems.length) {
                this.UpdateNavs();
            }
            return this._navState;
        };
        NavigationService.prototype.GenerateCountNavItems = function (translations) {
            this._countNavs = [];
            if (this.authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_InventoryCount_CanView)) {
                this._countNavs.push({ Title: translations.InventoryCount.Spot, Url: "/Inventory/Count/Edit/Spot", Type: Inventory.Count.Api.Models.CountType.Spot }, { Title: translations.InventoryCount.Daily, Url: "/Inventory/Count/Edit/Daily", Type: Inventory.Count.Api.Models.CountType.Daily }, { Title: translations.InventoryCount.Weekly, Url: "/Inventory/Count/Edit/Weekly", Type: Inventory.Count.Api.Models.CountType.Weekly }, { Title: translations.InventoryCount.Monthly, Url: "/Inventory/Count/Edit/Monthly", Type: Inventory.Count.Api.Models.CountType.Monthly }, { Title: translations.InventoryCount.Periodic, Url: "/Inventory/Count/Edit/Periodic", Type: Inventory.Count.Api.Models.CountType.Periodic });
            }
            if (this.authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_TravelPath_DailyFrequency_CanView, Core.Api.Models.Task.Inventory_TravelPath_SpotFrequency_CanView, Core.Api.Models.Task.Inventory_TravelPath_WeeklyFrequency_CanView, Core.Api.Models.Task.Inventory_TravelPath_MonthlyFrequency_CanView, Core.Api.Models.Task.Inventory_TravelPath_PeriodicFrequency_CanView)) {
                this._countNavs.push({ Title: translations.InventoryCount.TravelPath, Url: "/Inventory/Count/TravelPath" });
            }
            return this._countNavs;
        };
        NavigationService.prototype.ProcessMenuPermissions = function (menu) {
            var filteredMenu = [], menuLength = menu.length, currentMenuItem, i;
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
        };
        return NavigationService;
    }());
    Core.NavigationService = NavigationService;
    Core.$navigationService = Core.NG.CoreModule.RegisterService("Navigation", NavigationService, Core.Auth.$authService, Inventory.Count.Api.$countTypeService, Core.$signalR, Core.$translation, Administration.Settings.Api.$settingsService, Core.NG.$rootScope, Core.NG.$modalStack);
})(Core || (Core = {}));
