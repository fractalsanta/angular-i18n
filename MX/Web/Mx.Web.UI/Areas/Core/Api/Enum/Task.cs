namespace Mx.Web.UI.Areas.Core.Api.Models
{

    public enum Task
    {
        // ReSharper disable InconsistentNaming
        // No_Permission_Needed = 0,

        #region Usage 1

        EmployeeManager_CanAccess = 60,

        #endregion

        #region Usage 3

        Security_CanAccessAllGroups = 128 + 13,
        //...
        EntityManager_FullAccess = 128 + 44,

        #endregion

        #region Usage 11

        EntityManager_CanAccess = 640 + 14,

        #endregion

        #region Mobile Usage 1 (Usage 20)

        Inventory_InventoryCount_CanView = 1216 + 1,
        Inventory_InventoryCount_CanUpdate = 1216 + 2,
        Reporting_Dashboard_CanView = 1216 + 3,
        Labor_EmployeePortal_CanView = 1216 + 4,
        Inventory_Transfers_CanRequestTransferIn = 1216 + 5,
        Labor_EmployeePortal_TimeCard_CanView = 1216 + 6,
        Labor_EmployeePortal_Availability_CanView = 1216 + 7,
        Labor_EmployeePortal_MyDetails_CanView = 1216 + 8,
        Inventory_Waste_CanView = 1216 + 9,
        Inventory_Ordering_CanView = 1216 + 10,
        Labor_EmployeePortal_MyDetails_CanUpdate = 1216 + 11,
        Labor_EmployeePortal_Availability_CanUpdate = 1216 + 12,
        Administration_Settings_Dashboard_Application_CanUpdate = 1216 + 13,
        Administration_Settings_Dashboard_Global_CanUpdate = 1216 + 14,
        Administration_Settings_Dashboard_Store_CanUpdate = 1216 + 15,
        Labor_EmployeePortal_MyTimeOff_CanView = 1216 + 16,
        Inventory_InventoryCount_CanView_Variance = 1216 + 17,
        Inventory_InventoryCount_CanView_Review = 1216 + 18,
        Inventory_InventoryCount_CanUpdate_Cost = 1216 + 19,
        Inventory_Receiving_CanReceive = 1216 + 20,
        Inventory_TravelPath_SpotFrequency_CanView = 1216 + 21,
        Inventory_TravelPath_DailyFrequency_CanView = 1216 + 22,
        Inventory_TravelPath_WeeklyFrequency_CanView = 1216 + 23,
        Inventory_TravelPath_MonthlyFrequency_CanView = 1216 + 24,
        Inventory_TravelPath_PeriodicFrequency_CanView = 1216 + 25,
        Inventory_Ordering_CanCreate = 1216 + 26,
        Inventory_TravelPath_CanDeleteItem = 1216 + 27,
        Inventory_TravelPath_CanDeleteLocation = 1216 + 28,
        Labor_EmployeePortal_MySchedule_CanViewTeamMembers = 1216 + 29,
        Forecasting_CanView = 1216 + 32,
        DataLoad_CanView = 1216 + 35,
        Forecasting_PastDates_CanEdit = 1216 + 36,
        Inventory_Ordering_Place_CanView = 1216 + 37,
        Inventory_Ordering_Receive_CanView = 1216 + 38,
        Forecasting_CanEdit = 1216 + 39,
        Forecasting_History = 1216 + 40,
        Forecasting_Reset = 1216 + 41,
        Administration_Hierarchy_CanView = 1216 + 42,
        Administration_UserSetup_CanView = 1216 + 43,
        Labor_EmployeePortal_MySchedule_CanView = 1216 + 44,
        Inventory_Ordering_Receive_CanCorrect = 1216 + 45,
        Forecasting_Event_CanView = 1216 + 46,
        Inventory_Ordering_CanReturn = 1216 + 48,
        Core_PartnerRedirect_CanAccess = 1216 + 49,
        Inventory_Waste_History_CanView = 1216 + 50,
        Inventory_Ordering_CanChangeApplyDate = 1216 + 51,
        Administration_Settings_Site_CanAccess = 1216 + 52,
        Labor_EmployeePortal_Deliveries_CanView = 1216 + 53,
        Labor_EmployeePortal_ExtraDeliveries_CanAuthorise = 1216 + 54,
        Labor_EmployeePortal_Deliveries_CanViewOthersEntries = 1216 + 55,
        Labor_EmployeePortal_DriverDistance_CanView = 1216 + 56,
        Labor_EmployeePortal_DriverDistance_CanAuthorise = 1216 + 57,
        Labor_EmployeePortal_DriverDistance_CanViewOthersEntries = 1216 + 58,
        Administration_Settings_ForecastFilter_CanAccess = 1216 + 59, 
        Inventory_Ordering_History_CanView = 1216 + 60,
        Administration_Settings_ForecastUsage_CanAccess = 1216 + 61,

        #endregion

        #region Mobile Usage 2 (Usage 21)

        Forecasting_SalesItemMirroring_CanAccess = 1280 + 1,
        Operations_StoreSummary_CanAccess = 1280 + 2,
        Forecasting_StoreMirroring_CanAccess = 1280 + 3,
        Operations_StoreSummary_CanAccessViewManager = 1280 + 4,
        Inventory_Ordering_CanAddItemToOrder = 1280 + 5,
        Inventory_Receiving_CanAddItemToReceipt = 1280 + 6,
        Inventory_Transfers_CanCreateTransferOut = 1280 + 7,
        Operations_StoreSummary_CanCreateSharedViews = 1280 + 8,
        Operations_AreaSummary_CanAccess = 1280 + 9,
        Operations_InventoryMovement_CanAccess = 1280 + 10,
        Operations_AreaSummary_CanAccessViewManager = 1280 + 11,
        Operations_AreaSummary_CanCreateSharedViews = 1280 + 12,
        Inventory_InventoryCount_CanView_Count_Variance = 1280 + 13,
        Forecasting_Promotions_CanView = 1280 + 14,
        Inventory_Ordering_CanAutoReceiveOrder = 1280 + 15,
        Administration_Settings_InventoryCount_CanAccess = 1280 + 16,
		Inventory_PrepAdjust_CanView = 1280 + 17,
        Inventory_Receiving_CanReceiveWithoutInvoiceNumber = 1280 + 18,
        Waste_CanEditClosedPeriods = 1280 + 19,
        Transfers_CanEditClosedPeriods = 1280 + 20,
        Orders_CanEditClosedPeriods = 1280 + 21,
        Returns_CanEditClosedPeriods = 1280 + 22,
        InventoryCount_CanEditClosedPeriods = 1280 + 23,
        Operations_HotSchedulesSamlSso_CanAccess = 1280 + 24,
        Inventory_Receiving_EditPriceOnReceive = 1280 + 25,
        Inventory_Receiving_EditPriceOnCorrectReceive = 1280 + 26,
        Inventory_TravelPath_UnitsOfMeasure_CanView = 1280 + 27,
        Inventory_InventoryCount_CanAddDisabledItem = 1280 + 28,
        Operations_ProductMix_CanAccess = 1280 + 29,
        Operations_ProductMix_CanAccessViewManager = 1280 + 30,
        Operations_ProductMix_CanCreateSharedViews = 1280 + 31

        #endregion

        // ReSharper restore InconsistentNaming
    }
}