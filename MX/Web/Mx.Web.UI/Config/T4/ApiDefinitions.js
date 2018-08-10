var Forecasting;
(function (Forecasting) {
    var Api;
    (function (Api) {
        var Enums;
        (function (Enums) {
            (function (PromotionStatus) {
                PromotionStatus[PromotionStatus["Deleted"] = 0] = "Deleted";
                PromotionStatus[PromotionStatus["Active"] = 1] = "Active";
            })(Enums.PromotionStatus || (Enums.PromotionStatus = {}));
            var PromotionStatus = Enums.PromotionStatus;
        })(Enums = Api.Enums || (Api.Enums = {}));
    })(Api = Forecasting.Api || (Forecasting.Api = {}));
})(Forecasting || (Forecasting = {}));
var Forecasting;
(function (Forecasting) {
    var Api;
    (function (Api) {
        var Enums;
        (function (Enums) {
            (function (PromotionTimeline) {
                PromotionTimeline[PromotionTimeline["Uninitialized"] = -10] = "Uninitialized";
                PromotionTimeline[PromotionTimeline["Completed"] = -1] = "Completed";
                PromotionTimeline[PromotionTimeline["InProgress"] = 0] = "InProgress";
                PromotionTimeline[PromotionTimeline["Pending"] = 1] = "Pending";
            })(Enums.PromotionTimeline || (Enums.PromotionTimeline = {}));
            var PromotionTimeline = Enums.PromotionTimeline;
        })(Enums = Api.Enums || (Api.Enums = {}));
    })(Api = Forecasting.Api || (Forecasting.Api = {}));
})(Forecasting || (Forecasting = {}));
var Administration;
(function (Administration) {
    var Settings;
    (function (Settings) {
        var Api;
        (function (Api) {
            var Models;
            (function (Models) {
                (function (SettingEnums) {
                    SettingEnums[SettingEnums["Application"] = 0] = "Application";
                    SettingEnums[SettingEnums["Global"] = 1] = "Global";
                    SettingEnums[SettingEnums["Store"] = 2] = "Store";
                })(Models.SettingEnums || (Models.SettingEnums = {}));
                var SettingEnums = Models.SettingEnums;
            })(Models = Api.Models || (Api.Models = {}));
        })(Api = Settings.Api || (Settings.Api = {}));
    })(Settings = Administration.Settings || (Administration.Settings = {}));
})(Administration || (Administration = {}));
var Administration;
(function (Administration) {
    var Settings;
    (function (Settings) {
        var Api;
        (function (Api) {
            var Models;
            (function (Models) {
                (function (SettingToleranceFormatEnums) {
                    SettingToleranceFormatEnums[SettingToleranceFormatEnums["Currency"] = 0] = "Currency";
                    SettingToleranceFormatEnums[SettingToleranceFormatEnums["Percentage"] = 1] = "Percentage";
                    SettingToleranceFormatEnums[SettingToleranceFormatEnums["Number"] = 2] = "Number";
                })(Models.SettingToleranceFormatEnums || (Models.SettingToleranceFormatEnums = {}));
                var SettingToleranceFormatEnums = Models.SettingToleranceFormatEnums;
            })(Models = Api.Models || (Api.Models = {}));
        })(Api = Settings.Api || (Settings.Api = {}));
    })(Settings = Administration.Settings || (Administration.Settings = {}));
})(Administration || (Administration = {}));
var Core;
(function (Core) {
    var Api;
    (function (Api) {
        var Models;
        (function (Models) {
            (function (ConfigurationSetting) {
                ConfigurationSetting[ConfigurationSetting["System_Operations_HotSchedulesSamlSsoUrl"] = 84001] = "System_Operations_HotSchedulesSamlSsoUrl";
            })(Models.ConfigurationSetting || (Models.ConfigurationSetting = {}));
            var ConfigurationSetting = Models.ConfigurationSetting;
        })(Models = Api.Models || (Api.Models = {}));
    })(Api = Core.Api || (Core.Api = {}));
})(Core || (Core = {}));
var Administration;
(function (Administration) {
    var User;
    (function (User) {
        var Api;
        (function (Api) {
            var Models;
            (function (Models) {
                (function (UserSettingEnum) {
                    UserSettingEnum[UserSettingEnum["OrderColumnPreferences"] = 1] = "OrderColumnPreferences";
                    UserSettingEnum[UserSettingEnum["DefaultSupplierPreference"] = 2] = "DefaultSupplierPreference";
                    UserSettingEnum[UserSettingEnum["StoreSummaryFavouriteView"] = 3] = "StoreSummaryFavouriteView";
                    UserSettingEnum[UserSettingEnum["AreaSummaryFavoriteView"] = 4] = "AreaSummaryFavoriteView";
                    UserSettingEnum[UserSettingEnum["InventoryMovementFavouriteView"] = 5] = "InventoryMovementFavouriteView";
                    UserSettingEnum[UserSettingEnum["InventoryCountViewPreference"] = 6] = "InventoryCountViewPreference";
                    UserSettingEnum[UserSettingEnum["ProductMixFavouriteView"] = 7] = "ProductMixFavouriteView";
                })(Models.UserSettingEnum || (Models.UserSettingEnum = {}));
                var UserSettingEnum = Models.UserSettingEnum;
            })(Models = Api.Models || (Api.Models = {}));
        })(Api = User.Api || (User.Api = {}));
    })(User = Administration.User || (Administration.User = {}));
})(Administration || (Administration = {}));
var Core;
(function (Core) {
    var Api;
    (function (Api) {
        var Models;
        (function (Models) {
            (function (EntityType) {
                EntityType[EntityType["Corporate"] = 1] = "Corporate";
                EntityType[EntityType["Principle"] = 2] = "Principle";
                EntityType[EntityType["Master"] = 3] = "Master";
                EntityType[EntityType["Store"] = 4] = "Store";
            })(Models.EntityType || (Models.EntityType = {}));
            var EntityType = Models.EntityType;
        })(Models = Api.Models || (Api.Models = {}));
    })(Api = Core.Api || (Core.Api = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Api;
    (function (Api) {
        var Models;
        (function (Models) {
            var BusinessUser;
            (function (BusinessUser) {
                (function (BusinessUserStatusEnum) {
                    BusinessUserStatusEnum[BusinessUserStatusEnum["Unknown"] = 0] = "Unknown";
                    BusinessUserStatusEnum[BusinessUserStatusEnum["Active"] = 1] = "Active";
                    BusinessUserStatusEnum[BusinessUserStatusEnum["OnLeave"] = 2] = "OnLeave";
                    BusinessUserStatusEnum[BusinessUserStatusEnum["Terminated"] = 3] = "Terminated";
                })(BusinessUser.BusinessUserStatusEnum || (BusinessUser.BusinessUserStatusEnum = {}));
                var BusinessUserStatusEnum = BusinessUser.BusinessUserStatusEnum;
            })(BusinessUser = Models.BusinessUser || (Models.BusinessUser = {}));
        })(Models = Api.Models || (Api.Models = {}));
    })(Api = Core.Api || (Core.Api = {}));
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Api;
    (function (Api) {
        var Models;
        (function (Models) {
            (function (Task) {
                Task[Task["EmployeeManager_CanAccess"] = 60] = "EmployeeManager_CanAccess";
                Task[Task["Security_CanAccessAllGroups"] = 141] = "Security_CanAccessAllGroups";
                Task[Task["EntityManager_FullAccess"] = 172] = "EntityManager_FullAccess";
                Task[Task["EntityManager_CanAccess"] = 654] = "EntityManager_CanAccess";
                Task[Task["Inventory_InventoryCount_CanView"] = 1217] = "Inventory_InventoryCount_CanView";
                Task[Task["Inventory_InventoryCount_CanUpdate"] = 1218] = "Inventory_InventoryCount_CanUpdate";
                Task[Task["Reporting_Dashboard_CanView"] = 1219] = "Reporting_Dashboard_CanView";
                Task[Task["Labor_EmployeePortal_CanView"] = 1220] = "Labor_EmployeePortal_CanView";
                Task[Task["Inventory_Transfers_CanRequestTransferIn"] = 1221] = "Inventory_Transfers_CanRequestTransferIn";
                Task[Task["Labor_EmployeePortal_TimeCard_CanView"] = 1222] = "Labor_EmployeePortal_TimeCard_CanView";
                Task[Task["Labor_EmployeePortal_Availability_CanView"] = 1223] = "Labor_EmployeePortal_Availability_CanView";
                Task[Task["Labor_EmployeePortal_MyDetails_CanView"] = 1224] = "Labor_EmployeePortal_MyDetails_CanView";
                Task[Task["Inventory_Waste_CanView"] = 1225] = "Inventory_Waste_CanView";
                Task[Task["Inventory_Ordering_CanView"] = 1226] = "Inventory_Ordering_CanView";
                Task[Task["Labor_EmployeePortal_MyDetails_CanUpdate"] = 1227] = "Labor_EmployeePortal_MyDetails_CanUpdate";
                Task[Task["Labor_EmployeePortal_Availability_CanUpdate"] = 1228] = "Labor_EmployeePortal_Availability_CanUpdate";
                Task[Task["Administration_Settings_Dashboard_Application_CanUpdate"] = 1229] = "Administration_Settings_Dashboard_Application_CanUpdate";
                Task[Task["Administration_Settings_Dashboard_Global_CanUpdate"] = 1230] = "Administration_Settings_Dashboard_Global_CanUpdate";
                Task[Task["Administration_Settings_Dashboard_Store_CanUpdate"] = 1231] = "Administration_Settings_Dashboard_Store_CanUpdate";
                Task[Task["Labor_EmployeePortal_MyTimeOff_CanView"] = 1232] = "Labor_EmployeePortal_MyTimeOff_CanView";
                Task[Task["Inventory_InventoryCount_CanView_Variance"] = 1233] = "Inventory_InventoryCount_CanView_Variance";
                Task[Task["Inventory_InventoryCount_CanView_Review"] = 1234] = "Inventory_InventoryCount_CanView_Review";
                Task[Task["Inventory_InventoryCount_CanUpdate_Cost"] = 1235] = "Inventory_InventoryCount_CanUpdate_Cost";
                Task[Task["Inventory_Receiving_CanReceive"] = 1236] = "Inventory_Receiving_CanReceive";
                Task[Task["Inventory_TravelPath_SpotFrequency_CanView"] = 1237] = "Inventory_TravelPath_SpotFrequency_CanView";
                Task[Task["Inventory_TravelPath_DailyFrequency_CanView"] = 1238] = "Inventory_TravelPath_DailyFrequency_CanView";
                Task[Task["Inventory_TravelPath_WeeklyFrequency_CanView"] = 1239] = "Inventory_TravelPath_WeeklyFrequency_CanView";
                Task[Task["Inventory_TravelPath_MonthlyFrequency_CanView"] = 1240] = "Inventory_TravelPath_MonthlyFrequency_CanView";
                Task[Task["Inventory_TravelPath_PeriodicFrequency_CanView"] = 1241] = "Inventory_TravelPath_PeriodicFrequency_CanView";
                Task[Task["Inventory_Ordering_CanCreate"] = 1242] = "Inventory_Ordering_CanCreate";
                Task[Task["Inventory_TravelPath_CanDeleteItem"] = 1243] = "Inventory_TravelPath_CanDeleteItem";
                Task[Task["Inventory_TravelPath_CanDeleteLocation"] = 1244] = "Inventory_TravelPath_CanDeleteLocation";
                Task[Task["Labor_EmployeePortal_MySchedule_CanViewTeamMembers"] = 1245] = "Labor_EmployeePortal_MySchedule_CanViewTeamMembers";
                Task[Task["Forecasting_CanView"] = 1248] = "Forecasting_CanView";
                Task[Task["DataLoad_CanView"] = 1251] = "DataLoad_CanView";
                Task[Task["Forecasting_PastDates_CanEdit"] = 1252] = "Forecasting_PastDates_CanEdit";
                Task[Task["Inventory_Ordering_Place_CanView"] = 1253] = "Inventory_Ordering_Place_CanView";
                Task[Task["Inventory_Ordering_Receive_CanView"] = 1254] = "Inventory_Ordering_Receive_CanView";
                Task[Task["Forecasting_CanEdit"] = 1255] = "Forecasting_CanEdit";
                Task[Task["Forecasting_History"] = 1256] = "Forecasting_History";
                Task[Task["Forecasting_Reset"] = 1257] = "Forecasting_Reset";
                Task[Task["Administration_Hierarchy_CanView"] = 1258] = "Administration_Hierarchy_CanView";
                Task[Task["Administration_UserSetup_CanView"] = 1259] = "Administration_UserSetup_CanView";
                Task[Task["Labor_EmployeePortal_MySchedule_CanView"] = 1260] = "Labor_EmployeePortal_MySchedule_CanView";
                Task[Task["Inventory_Ordering_Receive_CanCorrect"] = 1261] = "Inventory_Ordering_Receive_CanCorrect";
                Task[Task["Forecasting_Event_CanView"] = 1262] = "Forecasting_Event_CanView";
                Task[Task["Inventory_Ordering_CanReturn"] = 1264] = "Inventory_Ordering_CanReturn";
                Task[Task["Core_PartnerRedirect_CanAccess"] = 1265] = "Core_PartnerRedirect_CanAccess";
                Task[Task["Inventory_Waste_History_CanView"] = 1266] = "Inventory_Waste_History_CanView";
                Task[Task["Inventory_Ordering_CanChangeApplyDate"] = 1267] = "Inventory_Ordering_CanChangeApplyDate";
                Task[Task["Administration_Settings_Site_CanAccess"] = 1268] = "Administration_Settings_Site_CanAccess";
                Task[Task["Labor_EmployeePortal_Deliveries_CanView"] = 1269] = "Labor_EmployeePortal_Deliveries_CanView";
                Task[Task["Labor_EmployeePortal_ExtraDeliveries_CanAuthorise"] = 1270] = "Labor_EmployeePortal_ExtraDeliveries_CanAuthorise";
                Task[Task["Labor_EmployeePortal_Deliveries_CanViewOthersEntries"] = 1271] = "Labor_EmployeePortal_Deliveries_CanViewOthersEntries";
                Task[Task["Labor_EmployeePortal_DriverDistance_CanView"] = 1272] = "Labor_EmployeePortal_DriverDistance_CanView";
                Task[Task["Labor_EmployeePortal_DriverDistance_CanAuthorise"] = 1273] = "Labor_EmployeePortal_DriverDistance_CanAuthorise";
                Task[Task["Labor_EmployeePortal_DriverDistance_CanViewOthersEntries"] = 1274] = "Labor_EmployeePortal_DriverDistance_CanViewOthersEntries";
                Task[Task["Administration_Settings_ForecastFilter_CanAccess"] = 1275] = "Administration_Settings_ForecastFilter_CanAccess";
                Task[Task["Inventory_Ordering_History_CanView"] = 1276] = "Inventory_Ordering_History_CanView";
                Task[Task["Administration_Settings_ForecastUsage_CanAccess"] = 1277] = "Administration_Settings_ForecastUsage_CanAccess";
                Task[Task["Forecasting_SalesItemMirroring_CanAccess"] = 1281] = "Forecasting_SalesItemMirroring_CanAccess";
                Task[Task["Operations_StoreSummary_CanAccess"] = 1282] = "Operations_StoreSummary_CanAccess";
                Task[Task["Forecasting_StoreMirroring_CanAccess"] = 1283] = "Forecasting_StoreMirroring_CanAccess";
                Task[Task["Operations_StoreSummary_CanAccessViewManager"] = 1284] = "Operations_StoreSummary_CanAccessViewManager";
                Task[Task["Inventory_Ordering_CanAddItemToOrder"] = 1285] = "Inventory_Ordering_CanAddItemToOrder";
                Task[Task["Inventory_Receiving_CanAddItemToReceipt"] = 1286] = "Inventory_Receiving_CanAddItemToReceipt";
                Task[Task["Inventory_Transfers_CanCreateTransferOut"] = 1287] = "Inventory_Transfers_CanCreateTransferOut";
                Task[Task["Operations_StoreSummary_CanCreateSharedViews"] = 1288] = "Operations_StoreSummary_CanCreateSharedViews";
                Task[Task["Operations_AreaSummary_CanAccess"] = 1289] = "Operations_AreaSummary_CanAccess";
                Task[Task["Operations_InventoryMovement_CanAccess"] = 1290] = "Operations_InventoryMovement_CanAccess";
                Task[Task["Operations_AreaSummary_CanAccessViewManager"] = 1291] = "Operations_AreaSummary_CanAccessViewManager";
                Task[Task["Operations_AreaSummary_CanCreateSharedViews"] = 1292] = "Operations_AreaSummary_CanCreateSharedViews";
                Task[Task["Inventory_InventoryCount_CanView_Count_Variance"] = 1293] = "Inventory_InventoryCount_CanView_Count_Variance";
                Task[Task["Forecasting_Promotions_CanView"] = 1294] = "Forecasting_Promotions_CanView";
                Task[Task["Inventory_Ordering_CanAutoReceiveOrder"] = 1295] = "Inventory_Ordering_CanAutoReceiveOrder";
                Task[Task["Administration_Settings_InventoryCount_CanAccess"] = 1296] = "Administration_Settings_InventoryCount_CanAccess";
                Task[Task["Inventory_PrepAdjust_CanView"] = 1297] = "Inventory_PrepAdjust_CanView";
                Task[Task["Inventory_Receiving_CanReceiveWithoutInvoiceNumber"] = 1298] = "Inventory_Receiving_CanReceiveWithoutInvoiceNumber";
                Task[Task["Waste_CanEditClosedPeriods"] = 1299] = "Waste_CanEditClosedPeriods";
                Task[Task["Transfers_CanEditClosedPeriods"] = 1300] = "Transfers_CanEditClosedPeriods";
                Task[Task["Orders_CanEditClosedPeriods"] = 1301] = "Orders_CanEditClosedPeriods";
                Task[Task["Returns_CanEditClosedPeriods"] = 1302] = "Returns_CanEditClosedPeriods";
                Task[Task["InventoryCount_CanEditClosedPeriods"] = 1303] = "InventoryCount_CanEditClosedPeriods";
                Task[Task["Operations_HotSchedulesSamlSso_CanAccess"] = 1304] = "Operations_HotSchedulesSamlSso_CanAccess";
                Task[Task["Inventory_Receiving_EditPriceOnReceive"] = 1305] = "Inventory_Receiving_EditPriceOnReceive";
                Task[Task["Inventory_Receiving_EditPriceOnCorrectReceive"] = 1306] = "Inventory_Receiving_EditPriceOnCorrectReceive";
                Task[Task["Inventory_TravelPath_UnitsOfMeasure_CanView"] = 1307] = "Inventory_TravelPath_UnitsOfMeasure_CanView";
                Task[Task["Inventory_InventoryCount_CanAddDisabledItem"] = 1308] = "Inventory_InventoryCount_CanAddDisabledItem";
                Task[Task["Operations_ProductMix_CanAccess"] = 1309] = "Operations_ProductMix_CanAccess";
                Task[Task["Operations_ProductMix_CanAccessViewManager"] = 1310] = "Operations_ProductMix_CanAccessViewManager";
                Task[Task["Operations_ProductMix_CanCreateSharedViews"] = 1311] = "Operations_ProductMix_CanCreateSharedViews";
            })(Models.Task || (Models.Task = {}));
            var Task = Models.Task;
        })(Models = Api.Models || (Api.Models = {}));
    })(Api = Core.Api || (Core.Api = {}));
})(Core || (Core = {}));
var Forecasting;
(function (Forecasting) {
    var Api;
    (function (Api) {
        var Enums;
        (function (Enums) {
            (function (EventProfileSource) {
                EventProfileSource[EventProfileSource["Empirical"] = 1] = "Empirical";
                EventProfileSource[EventProfileSource["Manual"] = 2] = "Manual";
            })(Enums.EventProfileSource || (Enums.EventProfileSource = {}));
            var EventProfileSource = Enums.EventProfileSource;
        })(Enums = Api.Enums || (Api.Enums = {}));
    })(Api = Forecasting.Api || (Forecasting.Api = {}));
})(Forecasting || (Forecasting = {}));
var Inventory;
(function (Inventory) {
    var Count;
    (function (Count) {
        var Api;
        (function (Api) {
            var Models;
            (function (Models) {
                (function (CountStatus) {
                    CountStatus[CountStatus["NotCounted"] = 0] = "NotCounted";
                    CountStatus[CountStatus["Pending"] = 1] = "Pending";
                    CountStatus[CountStatus["Variance"] = 2] = "Variance";
                    CountStatus[CountStatus["Partial"] = 3] = "Partial";
                    CountStatus[CountStatus["Counted"] = 4] = "Counted";
                })(Models.CountStatus || (Models.CountStatus = {}));
                var CountStatus = Models.CountStatus;
            })(Models = Api.Models || (Api.Models = {}));
        })(Api = Count.Api || (Count.Api = {}));
    })(Count = Inventory.Count || (Inventory.Count = {}));
})(Inventory || (Inventory = {}));
var Inventory;
(function (Inventory) {
    var Count;
    (function (Count) {
        var Api;
        (function (Api) {
            var Models;
            (function (Models) {
                (function (CountType) {
                    CountType[CountType["Spot"] = 0] = "Spot";
                    CountType[CountType["Daily"] = 1] = "Daily";
                    CountType[CountType["Weekly"] = 2] = "Weekly";
                    CountType[CountType["Periodic"] = 3] = "Periodic";
                    CountType[CountType["Monthly"] = 4] = "Monthly";
                })(Models.CountType || (Models.CountType = {}));
                var CountType = Models.CountType;
            })(Models = Api.Models || (Api.Models = {}));
        })(Api = Count.Api || (Count.Api = {}));
    })(Count = Inventory.Count || (Inventory.Count = {}));
})(Inventory || (Inventory = {}));
var Inventory;
(function (Inventory) {
    var Count;
    (function (Count) {
        var Api;
        (function (Api) {
            var Models;
            (function (Models) {
                (function (TravelPathActionType) {
                    TravelPathActionType[TravelPathActionType["Sort"] = 1] = "Sort";
                    TravelPathActionType[TravelPathActionType["Move"] = 2] = "Move";
                    TravelPathActionType[TravelPathActionType["Copy"] = 3] = "Copy";
                    TravelPathActionType[TravelPathActionType["Delete"] = 4] = "Delete";
                    TravelPathActionType[TravelPathActionType["Add"] = 5] = "Add";
                })(Models.TravelPathActionType || (Models.TravelPathActionType = {}));
                var TravelPathActionType = Models.TravelPathActionType;
            })(Models = Api.Models || (Api.Models = {}));
        })(Api = Count.Api || (Count.Api = {}));
    })(Count = Inventory.Count || (Inventory.Count = {}));
})(Inventory || (Inventory = {}));
var Inventory;
(function (Inventory) {
    var Count;
    (function (Count) {
        var Api;
        (function (Api) {
            var Models;
            (function (Models) {
                (function (TravelPathCountUpdateMode) {
                    TravelPathCountUpdateMode[TravelPathCountUpdateMode["Frequency"] = 0] = "Frequency";
                    TravelPathCountUpdateMode[TravelPathCountUpdateMode["UnitOfMeasure"] = 1] = "UnitOfMeasure";
                })(Models.TravelPathCountUpdateMode || (Models.TravelPathCountUpdateMode = {}));
                var TravelPathCountUpdateMode = Models.TravelPathCountUpdateMode;
            })(Models = Api.Models || (Api.Models = {}));
        })(Api = Count.Api || (Count.Api = {}));
    })(Count = Inventory.Count || (Inventory.Count = {}));
})(Inventory || (Inventory = {}));
var Inventory;
(function (Inventory) {
    var Order;
    (function (Order) {
        var Api;
        (function (Api) {
            var Models;
            (function (Models) {
                (function (OrderStatus) {
                    OrderStatus[OrderStatus["Pending"] = 0] = "Pending";
                    OrderStatus[OrderStatus["PastDue"] = 1] = "PastDue";
                    OrderStatus[OrderStatus["InProgress"] = 2] = "InProgress";
                    OrderStatus[OrderStatus["Cancelled"] = 3] = "Cancelled";
                    OrderStatus[OrderStatus["Placed"] = 4] = "Placed";
                    OrderStatus[OrderStatus["Received"] = 5] = "Received";
                    OrderStatus[OrderStatus["OnHold"] = 6] = "OnHold";
                    OrderStatus[OrderStatus["Rejected"] = 7] = "Rejected";
                    OrderStatus[OrderStatus["Shipped"] = 8] = "Shipped";
                    OrderStatus[OrderStatus["AutoReceived"] = 9] = "AutoReceived";
                })(Models.OrderStatus || (Models.OrderStatus = {}));
                var OrderStatus = Models.OrderStatus;
            })(Models = Api.Models || (Api.Models = {}));
        })(Api = Order.Api || (Order.Api = {}));
    })(Order = Inventory.Order || (Inventory.Order = {}));
})(Inventory || (Inventory = {}));
var Inventory;
(function (Inventory) {
    var Transfer;
    (function (Transfer) {
        var Api;
        (function (Api) {
            var Enums;
            (function (Enums) {
                (function (TransferDirection) {
                    TransferDirection[TransferDirection["TransferOut"] = 0] = "TransferOut";
                    TransferDirection[TransferDirection["TransferIn"] = 1] = "TransferIn";
                })(Enums.TransferDirection || (Enums.TransferDirection = {}));
                var TransferDirection = Enums.TransferDirection;
            })(Enums = Api.Enums || (Api.Enums = {}));
        })(Api = Transfer.Api || (Transfer.Api = {}));
    })(Transfer = Inventory.Transfer || (Inventory.Transfer = {}));
})(Inventory || (Inventory = {}));
var Operations;
(function (Operations) {
    var Reporting;
    (function (Reporting) {
        var Api;
        (function (Api) {
            var Models;
            (function (Models) {
                (function (ReportType) {
                    ReportType[ReportType["StoreSummary"] = 1] = "StoreSummary";
                    ReportType[ReportType["AreaSummary"] = 2] = "AreaSummary";
                    ReportType[ReportType["InventoryMovement"] = 3] = "InventoryMovement";
                    ReportType[ReportType["ProductMix"] = 4] = "ProductMix";
                })(Models.ReportType || (Models.ReportType = {}));
                var ReportType = Models.ReportType;
            })(Models = Api.Models || (Api.Models = {}));
        })(Api = Reporting.Api || (Reporting.Api = {}));
    })(Reporting = Operations.Reporting || (Operations.Reporting = {}));
})(Operations || (Operations = {}));
var Operations;
(function (Operations) {
    var Reporting;
    (function (Reporting) {
        var Api;
        (function (Api) {
            var Models;
            (function (Models) {
                (function (ReportColumnValueType) {
                    ReportColumnValueType[ReportColumnValueType["Currency"] = 1] = "Currency";
                    ReportColumnValueType[ReportColumnValueType["Decimal"] = 2] = "Decimal";
                    ReportColumnValueType[ReportColumnValueType["Integer"] = 3] = "Integer";
                    ReportColumnValueType[ReportColumnValueType["Percentage"] = 4] = "Percentage";
                    ReportColumnValueType[ReportColumnValueType["Date"] = 5] = "Date";
                    ReportColumnValueType[ReportColumnValueType["String"] = 6] = "String";
                    ReportColumnValueType[ReportColumnValueType["Currency4"] = 7] = "Currency4";
                })(Models.ReportColumnValueType || (Models.ReportColumnValueType = {}));
                var ReportColumnValueType = Models.ReportColumnValueType;
            })(Models = Api.Models || (Api.Models = {}));
        })(Api = Reporting.Api || (Reporting.Api = {}));
    })(Reporting = Operations.Reporting || (Operations.Reporting = {}));
})(Operations || (Operations = {}));
var Reporting;
(function (Reporting) {
    var Dashboard;
    (function (Dashboard) {
        var Api;
        (function (Api) {
            var Models;
            (function (Models) {
                (function (ReferenceInterval) {
                    ReferenceInterval[ReferenceInterval["Today"] = 10] = "Today";
                    ReferenceInterval[ReferenceInterval["WeekToDate"] = 20] = "WeekToDate";
                    ReferenceInterval[ReferenceInterval["MonthToDate"] = 30] = "MonthToDate";
                    ReferenceInterval[ReferenceInterval["Yesterday"] = 40] = "Yesterday";
                    ReferenceInterval[ReferenceInterval["LastYear"] = 50] = "LastYear";
                })(Models.ReferenceInterval || (Models.ReferenceInterval = {}));
                var ReferenceInterval = Models.ReferenceInterval;
            })(Models = Api.Models || (Api.Models = {}));
        })(Api = Dashboard.Api || (Dashboard.Api = {}));
    })(Dashboard = Reporting.Dashboard || (Reporting.Dashboard = {}));
})(Reporting || (Reporting = {}));
var Workforce;
(function (Workforce) {
    var Deliveries;
    (function (Deliveries) {
        var Api;
        (function (Api) {
            var Models;
            (function (Models) {
                var Enums;
                (function (Enums) {
                    (function (ExtraDeliveryOrderStatus) {
                        ExtraDeliveryOrderStatus[ExtraDeliveryOrderStatus["Pending"] = 1] = "Pending";
                        ExtraDeliveryOrderStatus[ExtraDeliveryOrderStatus["Approved"] = 2] = "Approved";
                        ExtraDeliveryOrderStatus[ExtraDeliveryOrderStatus["Denied"] = 3] = "Denied";
                    })(Enums.ExtraDeliveryOrderStatus || (Enums.ExtraDeliveryOrderStatus = {}));
                    var ExtraDeliveryOrderStatus = Enums.ExtraDeliveryOrderStatus;
                })(Enums = Models.Enums || (Models.Enums = {}));
            })(Models = Api.Models || (Api.Models = {}));
        })(Api = Deliveries.Api || (Deliveries.Api = {}));
    })(Deliveries = Workforce.Deliveries || (Workforce.Deliveries = {}));
})(Workforce || (Workforce = {}));
var Workforce;
(function (Workforce) {
    var Deliveries;
    (function (Deliveries) {
        var Api;
        (function (Api) {
            var Models;
            (function (Models) {
                var Enums;
                (function (Enums) {
                    (function (TransactionDeliveryType) {
                        TransactionDeliveryType[TransactionDeliveryType["Regular"] = 1] = "Regular";
                        TransactionDeliveryType[TransactionDeliveryType["Extra"] = 2] = "Extra";
                    })(Enums.TransactionDeliveryType || (Enums.TransactionDeliveryType = {}));
                    var TransactionDeliveryType = Enums.TransactionDeliveryType;
                })(Enums = Models.Enums || (Models.Enums = {}));
            })(Models = Api.Models || (Api.Models = {}));
        })(Api = Deliveries.Api || (Deliveries.Api = {}));
    })(Deliveries = Workforce.Deliveries || (Workforce.Deliveries = {}));
})(Workforce || (Workforce = {}));
var Workforce;
(function (Workforce) {
    var DriverDistance;
    (function (DriverDistance) {
        var Api;
        (function (Api) {
            var Models;
            (function (Models) {
                var Enums;
                (function (Enums) {
                    (function (DriverDistanceStatus) {
                        DriverDistanceStatus[DriverDistanceStatus["Pending"] = 0] = "Pending";
                        DriverDistanceStatus[DriverDistanceStatus["Approved"] = 1] = "Approved";
                        DriverDistanceStatus[DriverDistanceStatus["Denied"] = 2] = "Denied";
                    })(Enums.DriverDistanceStatus || (Enums.DriverDistanceStatus = {}));
                    var DriverDistanceStatus = Enums.DriverDistanceStatus;
                })(Enums = Models.Enums || (Models.Enums = {}));
            })(Models = Api.Models || (Api.Models = {}));
        })(Api = DriverDistance.Api || (DriverDistance.Api = {}));
    })(DriverDistance = Workforce.DriverDistance || (Workforce.DriverDistance = {}));
})(Workforce || (Workforce = {}));
var Workforce;
(function (Workforce) {
    var MySchedule;
    (function (MySchedule) {
        var Api;
        (function (Api) {
            var Models;
            (function (Models) {
                (function (TimeOffRequestStatus) {
                    TimeOffRequestStatus[TimeOffRequestStatus["Requested"] = 0] = "Requested";
                    TimeOffRequestStatus[TimeOffRequestStatus["Approved"] = 1] = "Approved";
                    TimeOffRequestStatus[TimeOffRequestStatus["Declined"] = 2] = "Declined";
                    TimeOffRequestStatus[TimeOffRequestStatus["Cancelled"] = 3] = "Cancelled";
                })(Models.TimeOffRequestStatus || (Models.TimeOffRequestStatus = {}));
                var TimeOffRequestStatus = Models.TimeOffRequestStatus;
            })(Models = Api.Models || (Api.Models = {}));
        })(Api = MySchedule.Api || (MySchedule.Api = {}));
    })(MySchedule = Workforce.MySchedule || (Workforce.MySchedule = {}));
})(Workforce || (Workforce = {}));
var Workforce;
(function (Workforce) {
    var MyTimeCard;
    (function (MyTimeCard) {
        var Api;
        (function (Api) {
            var Models;
            (function (Models) {
                (function (BreakType) {
                    BreakType[BreakType["Rest"] = 0] = "Rest";
                    BreakType[BreakType["Meal"] = 1] = "Meal";
                })(Models.BreakType || (Models.BreakType = {}));
                var BreakType = Models.BreakType;
            })(Models = Api.Models || (Api.Models = {}));
        })(Api = MyTimeCard.Api || (MyTimeCard.Api = {}));
    })(MyTimeCard = Workforce.MyTimeCard || (Workforce.MyTimeCard = {}));
})(Workforce || (Workforce = {}));
