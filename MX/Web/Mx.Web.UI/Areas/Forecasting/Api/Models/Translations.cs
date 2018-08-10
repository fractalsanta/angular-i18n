using System;
using Mx.Web.UI.Config.Translations;

namespace Mx.Web.UI.Areas.Forecasting.Api.Models
{
    [Translation("Forecasting")]
    public class Translations
    {
        public virtual String AllDay { get { return "All Day"; } }
        public virtual String DayPart { get { return "Day Part"; } }
        public virtual String Metric { get { return "Metric"; } }
        public virtual String MenuForecast { get { return "Forecast"; } }
        public virtual String MenuForecastEvaluator { get { return "Forecast Evaluator"; } }
        public virtual String MenuSales { get { return "Sales"; } }
        public virtual String MenuTransactions { get { return "Transactions"; } }
        public virtual String MenuSalesItems { get { return "Sales Items"; } }
        public virtual String MenuEvents { get { return "Events"; } }
        public virtual String MenuSalesItemMirroring { get { return "Sales Item Mirroring"; } }
        public virtual String MenuStoreMirroring { get { return "Store Mirroring"; } }
        public virtual String MenuPromotions { get { return "Promotions"; } }
        public virtual String Sales { get { return "Sales"; } }
        public virtual String Transactions { get { return "Transactions"; } }
        public virtual String SalesItems { get { return "Sales Items"; } }
        public virtual String TitleForecasting { get { return "Forecasting"; } }
        public virtual String Time { get { return "Time"; } }
        public virtual String Forecasted { get { return "Forecasted"; } }
        public virtual String LastYear { get { return "Last Year"; } }
        public virtual String SystemForecast { get { return "System Forecast"; } }
        public virtual String ManagerForecast { get { return "Manager Forecast"; } }
        public virtual String Totals { get { return "Totals"; } }
        public virtual String ForecastSales { get { return "Forecast Sales"; } }
        public virtual String LastYearSales { get { return "Last Year Sales"; } }
        public virtual String LastYearSalesNotAvailable { get { return "Not Available"; } }
        public virtual String ForecastDayGrid { get { return "Forecast - Day Grid"; } }
        public virtual String ForecastDayGraph { get { return "Forecast - Day Graph"; } }
        public virtual String ToggleGrid { get { return "Toggle Grid"; } }
        public virtual String ToggleGraph { get { return "Toggle Graph"; } }
        public virtual String SaveAdjustments { get { return "Save edits?"; } }
        public virtual String ForecastExists { get { return "A newer version of this forecast already exists."; } }
        public virtual String AdjustmentsCancelLocation { get { return "Leaving this page without saving will cause data to be lost. Are you sure you want to continue?"; } }
        public virtual String AdjustmentsCancelAggregate { get { return "Changing your daily total will cause your hourly changes to be lost. Are you sure you want to continue?"; } }
        public virtual String AdjustmentsCancelMessage { get { return "Adjustments have not been saved. Are you sure you want to continue?"; } }
        public virtual String AdjustmentsCancelTitle { get { return "Discard adjustments"; } }
        public virtual String AdjustmentsCancelConfirm { get { return "Confirm"; } }
        public virtual String Day { get { return "Day"; } }
        public virtual String NoDataMessage { get { return "No data to display."; } }
        public virtual String NothingToEvaluateIndicator { get { return "NA"; } }
        public virtual String ForecastEditTitle { get { return "Edit Forecast"; } }
        public virtual String Value { get { return "Value"; } }
        public virtual String Percentage { get { return "Percentage"; } }
        public virtual String Apply { get { return "Apply"; } }
        public virtual String Cancel { get { return "Cancel"; } }
        public virtual String Save { get { return "Save"; } }
        public virtual String SavedSuccessfully { get { return "Changes saved successfully."; } }
        public virtual String Error { get { return "Error: "; } }
        public virtual String NoForecastForDay { get { return "A forecast has not been generated for "; } }
        public virtual String SalesitemEditTitle { get { return "Edit Sales Item"; } }
        public virtual String NewValue { get { return "New Value"; } }
        public virtual String GenericErrorMessage { get { return "Server is currently not available. Please try again."; } }
        public virtual String EditSalesTitle { get { return "Edit Sales Dollars"; } }
        public virtual String EditTransactionCountTitle { get { return "Edit Transaction Count"; } }
        public virtual String MissingFiscalPeriod { get { return "A fiscal period does not exist for {0}. Please make a new selection."; } }
        public virtual String SearchSalesItem { get { return "Select a Sales Item to view."; } }
        public virtual String NoSalesItemResults { get { return "No sales items match your criteria."; } }
        public virtual String SearchPlaceholder { get { return "Search Sales Items..."; } }
        public virtual String TitleEvaluator { get { return "Evaluator"; } }
        public virtual String WeekOf { get { return "Week Of"; } }
        public virtual String History { get { return "History"; } }
        public virtual String HistoryTitle { get { return "Historical Data"; } }
        public virtual String ForecastReset { get { return "Reset"; } }
        public virtual String HistoryConfirmation { get { return "Warning \n\n This will reset all Forecasts, including Sales, Transactions,\n Sales Items and Inventory Item to the system generated defaults.\n Do you wish to continue?\n";} }
        public virtual String HistorySuccessful { get { return "Reset successful"; } }
        public virtual String Actual { get { return "Actual"; } }
        public virtual String SystemGenerated { get { return "System Generated"; } }
        public virtual String ManagerEdited{ get { return "Manager Edited"; } }
        public virtual String SystemAccuracy { get { return "System Accuracy"; } }
        public virtual String ManagerAccuracy { get { return "Manager Accuracy"; } }
        public virtual String SalesDropDown { get { return "Sales Dollars"; } }
        public virtual String TransactionsDropDown { get { return "Transaction Count"; } }
        public virtual String SalesItemsDropDown { get { return "Sales Item Count"; } }
        public virtual String SearchForItems { get { return "Search for items"; } }
        public virtual String Search { get { return "Search"; } }
        public virtual String Select { get { return "Select"; } }
        public virtual String TitleEvent { get { return "Event Calendar"; } }
        public virtual String Actions { get { return "Actions"; } }
        public virtual String NewEventProfile { get { return "New Event Profile"; } }
        public virtual String EditEventProfile { get { return "Edit Event Profile"; } }
        public virtual String ScheduleEvent { get { return "Schedule Event"; } }
        public virtual String AddEvent { get { return "Add Event"; } }
        public virtual String AddEventProfile { get { return "Add Event Profile"; } }
        public virtual String ScheduleEventTitle { get { return "Schedule New Event"; } }
        public virtual String EditEventButton { get { return "Edit"; } }
        public virtual String DeleteEvent { get { return "Delete Event"; } }
        public virtual String DeleteEventConfirmationTitle { get { return "Delete Event Confirmation"; } }
        public virtual String DeleteEventConfirmationMessage { get { return "Are you sure you want to delete this event? Deleting may result in changes to your forecast."; } }
        public virtual String EditEventTitle { get { return "Edit Event"; } }
        public virtual String Delete { get { return "Delete"; } }

        public virtual String DeleteEventHasBeenSuccessful { get { return "Scheduled Event has been successfully deleted."; } }

        public virtual String EventDate { get { return "Event Date"; } }
        public virtual String NoEventsScheduled { get { return "No Events Scheduled"; } }
        public virtual String NoEventsTapToAdd { get { return "No Events. Tap to Add."; } }
        public virtual String PleaseSelectAnEvent { get { return "Please Select an Event"; } }
        public virtual String Adjustments { get { return "Adjustments"; } }
        public virtual String Date { get { return "Date"; } }
        public virtual String EventProfile { get { return "Event Profile"; } }
        public virtual String EventProfileName { get { return "Profile Name"; } }
        public virtual String EventProfileInPast { get { return "Cannot change an event in the past"; } }
        public virtual String AdjustmentMethod { get { return "Adjustment Method"; } }
        public virtual String PastOccurrences { get { return "Past Occurrences"; } }
        public virtual String Notes { get { return "Notes"; } }
        public virtual String SelectProfile { get { return "Select Event Profile"; } }
        public virtual String ForecastAdjustmentsFromPastOccurrences { get { return "Forecast Adjustments From Past Occurrences"; } }
        public virtual String AddDate { get { return "Add Date"; } }
        public virtual String EnterAdjustments { get { return "Enter Adjustments"; } }
        public virtual String SaveProfile { get { return "Save Profile"; } }
        public virtual String CreateAdjustmentsManually { get { return "Create Adjustments Manually"; } }
        public virtual String TitleEventAdjustments { get { return "Event Forecasting"; } }
        public virtual String BaseAdjustment { get { return "Base Adjustment"; } }
        public virtual String ManagerAdjustment { get { return "Manager Adjustment (%)"; } }
        public virtual String ScheduleEventSubmitFail { get { return "Schedule event could not be submitted. Please try again later."; } }
        public virtual String ProfileCancelConfirmationTitle { get { return " Discard profile updates"; } }
        public virtual String ProfileCancelConfirmationMessage { get { return "Profile updates have not been saved. Are you sure you want to continue?"; } }
        public virtual String ProfileCancelConfirm { get { return "Confirm"; } }
        public virtual String OK { get { return "OK"; } }
        public virtual String Confirm { get { return "Confirm"; } }
        public virtual String CancelManualAdjustmentsTitle { get { return "Cancel New Profile"; } }
        public virtual String CancelManualAdjustments { get { return "Cancel new profile?"; } }
        public virtual String CancelEditManualAdjustmentsTitle { get { return "Cancel Edit Profile"; } }
        public virtual String CancelEditManualAdjustments { get { return "Cancel edit profile?"; } }
        public virtual String CancelManualAdjustmentsYes { get { return "Yes"; } }
        public virtual String CancelManualAdjustmentsNo { get { return "No"; } }
        public virtual String EditEventManuallyTitle { get { return "Enter Base Adjustment"; } }
        public virtual String Closed { get { return "Closed"; } }
        public virtual String To { get { return "To"; } }
        public virtual String ProfileNameExists { get { return "The profile event name you provided already exists."; } }
        public virtual String ProfileNameHasBeenCanceled { get { return "Another user has just created a profile by the same name; your profile has been cancelled."; } }
        public virtual String EventAlreadyScheduled { get { return "This event has already been scheduled for this date."; } }
        public virtual String EventHasNotBeenFound { get { return "Event has not been found."; } }
        public virtual String CannotScheduleEventOnClosedDay { get { return "Events cannot be scheduled on closed business days."; } }
        public virtual String Back { get { return "Back"; } }
        public virtual String ManageEventProfiles { get { return "Manage Event Profiles"; } }
        public virtual String ForecastGenerationFailed { get { return "Forecast generation has failed."; } }
        public virtual String EnterEventNotes { get { return "Enter event notes"; } }
        public virtual String EventHasBeenScheduled { get { return "Event has been successfully created."; } }
        public virtual String EventHasBeenUpdated { get { return "Event has been successfully updated."; } }
        public virtual String SingleEventDay { get { return "Event: {0}"; } }
        public virtual String MultiEventDay { get { return "{0} events scheduled today"; } }
        public virtual String AllScheduledEventsFor { get { return "All Scheduled Events For "; } }

        #region Filter
        public virtual String NoForecastFiltersDefined { get { return "No forecast filters defined."; } }
        public virtual String NewForecastFilter { get { return "New Forecast Filter"; } }
        public virtual String EditForecastFilter { get { return "Edit Forecast Filter"; } }
        public virtual String AddForecastFilter { get { return "Add Forecast Filter"; } }
        public virtual String SaveForecastFilter { get { return "Save Forecast Filter"; } }
        public virtual String ForecastFilters { get { return "Forecast Filters"; } }
        public virtual String CanEditForecast { get { return "Can Edit Forecast"; } }
        public virtual String ForecastFilterSetup { get { return "Forecast Filter Setup"; } }
        public virtual String ForecastFilterName { get { return "Forecast Filter Name"; } }
        public virtual String Edit { get { return "Edit"; } }
        public virtual String ServiceTypes { get { return "Service Types"; } }
        public virtual String ForecastFilterNameIsNotUnique { get { return "Forecast Filter Name Is Not Unique"; } }
        public virtual String ForecastFilter { get { return "Forecast Filter"; } }
        public virtual String Total { get { return "Total";  } }
        public virtual String DayTotals { get { return "Day Totals"; } }
        public virtual String ResetForecastModalWindowTitle { get { return "Reset Forecasts"; } }
        public virtual String SelectEditableFilter { get { return "This forecast contains data that cannot be edited. Select a filter that is editable to adjust the forecast."; } }
        #endregion

        #region Mirroring
        public virtual String TitleMirroring { get { return "Forecast Mirroring"; } }
        public virtual String Stores { get { return "Stores"; } }
        public virtual String SearchItems { get { return "Search items..."; } }
        public virtual String TargetSalesItemCode { get { return "Target Sales Item (code)"; } }
        public virtual String Status { get { return "Status"; } }
        public virtual String MirrorDates { get { return "Mirror Dates"; } }
        public virtual String Zone { get { return "Zone"; } }
        public virtual String Active { get { return "Active"; } }
        public virtual String Cancelled { get { return "Cancelled"; } }
        public virtual String Completed { get { return "Completed"; } }
        public virtual String All { get { return "All"; } }
        public virtual String InProgress { get { return "In Progress"; } }
        public virtual String Scheduled { get { return "Scheduled"; } }
        public virtual String PendingCancellation { get { return "Pending Cancellation"; } }
        public virtual String PartiallyCompleted { get { return "Partially Completed"; } }

        public virtual String AddItem { get { return "Add Item"; } }
        public virtual String AddMirror { get { return "Add Mirror"; } }

        public virtual String TargetSalesItem { get { return "Target Sales Item"; } }
        public virtual String SourceSalesItem { get { return "Source Sales Item"; } }
        public virtual String TargetDateRange { get { return "Target Date Range"; } }
        public virtual String TargetStartDate { get { return "Target Date Start"; } }
        public virtual String TargetEndDate { get { return "Target Date End"; } }
        public virtual String SourceStartDate { get { return "Source Start Date"; } }
        public virtual String SourceEndDate { get { return "Source End Date"; } }
        public virtual String RestaurantZone { get { return "Restaurant Zone"; } }
        public virtual String AdditionalAdjustment { get { return "Additional Adjustment"; } }
        public virtual String StopMirror { get { return "Stop Mirror"; } }
        public virtual String DeleteMirror { get { return "Delete Mirror"; } }
        public virtual String CancelMirror { get { return "Cancel Mirror"; } }
        public virtual String ChangeEndDate { get { return "Change End Date"; } }
        public virtual String SelectDates { get { return "Select Dates"; } }
        public virtual String SelectDate { get { return "Select Date"; } }
        public virtual String SelectZone { get { return "Select Zone"; } }
        public virtual String LastDays { get { return "Last {0} Days"; } }
        public virtual String CustomRange { get { return "Custom Range"; } }
        public virtual String Restaurants { get { return "({0} restaurants)"; } }
        public virtual String MustStartSameDay { get { return "Target Date and Source Date Range must start on same day of the week"; } }
        public virtual String SourceDateRangeError { get { return "The entire Source Date Range must not overlap the Target Date Range"; } }

        public virtual String DeleteMirrorMessage { get { return "Deleting this mirror will revert any System Forecast which may exist for the selected target item during the target date range."; } }
        public virtual String DeleteMirrorSuccess { get { return "The scheduled mirror has been deleted";  } }
        public virtual String MirrorOverlapMessage { get { return "Another mirror already exists with an overlap of the Target Store, Target Item, and Target Date Range. Please adjust one of these criteria and try again."; } }
        public virtual String ChangeMirrorEndDateMessage { get { return "Please provide a new end date for this mirror. Any existing System Forecasts already generated will be updated."; } }
        public virtual String CancelStoreMirrorMessage { get { return "Cancelling this mirror will revert any System Forecast which may exist for the target store during the target date range."; } }
        public virtual String CancelMirrorSuccess{ get { return "The scheduled mirror has been cancelled";  } }

        public virtual String MirrorCancelTitle { get { return "Discard updates"; } }
        public virtual String MirrorCancelStoreMessage { get { return "Store mirror updates have not been saved. Are you sure you want to continue?"; } }
        public virtual String MirrorCancelItemMessage { get { return "Item mirror updates have not been saved. Are you sure you want to continue?"; } }
        public virtual String MirrorCancelConfirm { get { return "Confirm"; } }

        public virtual String SaveMirrorTitle { get { return "Save Mirror"; } }
        public virtual String SaveMirrorMessage { get { return "This mirror will overwrite any System Forecast which may exist for the selected target item during the target date range."; } }
        public virtual String SaveCheckboxOption { get { return "Also overwrite Restaurant Edited forecasts"; } }
        public virtual String OverwriteManagerReadOnlyMessage { get { return "(Cannot change this option because forecast is in progress)"; } }

        public virtual String SearchForStores { get { return "Search For Stores"; } }
        public virtual String SelectAStore { get { return "Select A Store"; } }
        public virtual String NoStoresResultMessage { get { return "No stores match your criteria"; } }
        public virtual String SourceStore { get { return "Source Store"; } }
        public virtual String MirrorAllDay { get { return "All Day"; } }
        public virtual String MirrorAllDayOn { get { return "On"; } }
        public virtual String MirrorAllDayOff { get { return "Off"; } }
        public virtual String TargetDate { get { return "Target Date"; } }
        public virtual String SourceDate { get { return "Source Date"; } }
        public virtual String TargetTime { get { return "Target Time"; } }
        public virtual String SourceTime { get { return "Source Time"; } }
        public virtual String MirrorAddDate { get { return "Add Date"; } }
        public virtual String SaveStoreMirrorMessage { get { return "This mirror will overwrite any System Forecast which may exist during the target date range."; } }
        public virtual String StoreMirrorOverlapMessage { get { return "Another mirror already exists for this store and date range."; } }
        public virtual String AM { get { return "AM"; } }
        public virtual String PM { get { return "PM"; } }
        public virtual String CancelledOn { get { return "Cancelled On"; }}
        public virtual String CancelledByUser { get { return "By"; } }
        public virtual String OverwriteManagerForecast { get { return "Overwrite Manager Forecast"; } }
        #endregion
    }
}
