using System;
using Mx.Web.UI.Config.Translations;

namespace Mx.Web.UI.Areas.Inventory.Waste.Api.Models
{
    [Translation("Waste")]
    public class L10N
    {
        public virtual string WasteTotal
        {
            get { return "Waste Total"; }
        }
        public virtual string Outer
        {
            get { return "Outer"; }
        }
        public virtual string AddItemMessage
        {
            get { return "Add (0) to "; }
        }
        public virtual string Ordering
        {
            get { return "Ordering"; }
        }
        public virtual string CountingMessage
        {
            get { return "Waste %WhichCount% of %Description%"; }
        }
        public virtual string Unit
        {
            get { return "Unit"; }
        }
        public virtual string RawItems
        {
            get { return "Raw Items"; }
        }
        public virtual string ItemDescription
        {
            get { return "Item Description"; }
        }
        public virtual string PleaseEnterReasonMsg
        {
            get { return "Please enter a reason for each wasted item."; }
        }
        public virtual string AddItem
        {
            get { return "Add Item"; }
        }
        public virtual string FinishedItems
        {
            get { return "Finished Items"; }
        }
        public virtual string AllItems
        {
            get { return "All Items"; }
        }
        public virtual string Delete
        {
            get { return "Delete"; }
        }
        public virtual string Transfers
        {
            get { return "Transfers"; }
        }
        public virtual string Count
        {
            get { return "Count"; }
        }
        public virtual string Partial
        {
            get { return "Partial"; }
        }
        public virtual string Location
        {
            get { return "Location"; }
        }
        public virtual string FinishedWaste
        {
            get { return "Finished Waste"; }
        }
        public virtual string Cancel
        {
            get { return "Cancel"; }
        }
        public virtual string SearchResults
        {
            get { return "Search Results"; }
        }
        public virtual string Back
        {
            get { return "Back"; }
        }
        public virtual string Menu
        {
            get { return "Menu"; }
        }
        public virtual string Waste
        {
            get { return "Waste"; }
        }
        public virtual string ConfirmDelete
        {
            get { return "Confirm Delete"; }
        }
        public virtual string Finish
        {
            get { return "Finish"; }
        }
        public virtual string PleaseEnterQuantityMsg
        {
            get { return "Please enter at least one item."; }
        }
        public virtual string Reason
        {
            get { return "Reason"; }
        }
        public virtual string DeleteKey
        {
            get { return "Del"; }
        }
        public virtual string Search
        {
            get { return "Search"; }
        }
        public virtual string WasteSubmitted
        {
            get { return "Waste Items successfully submitted."; }
        }
        public virtual string Units
        {
            get { return "Units"; }
        }
        public virtual string Outers
        {
            get { return "Outers"; }
        }
        public virtual string NewItemMessage
        {
            get { return "You have new items that require action."; }
        }
        public virtual string ItemNameSearch
        {
            get { return "Item Name"; }
        }
        public virtual string LoadingMoreItemsMsg
        {
            get { return "Loading more items..."; }
        }
        public virtual string TotalsMessage
        {
            get { return "Count: %Count%"; }
        }
        public virtual string SelectReason
        {
            get { return "Select Reason"; }
        }
        public virtual string InventoryCount
        {
            get { return "Inventory Count"; }
        }
        public virtual string RawWaste
        {
            get { return "Raw Waste"; }
        }
        public virtual string Description
        {
            get { return "Description"; }
        }
        public virtual string ItemCode
        {
            get { return "Code"; }
        }
        public virtual string ProductCode
        {
            get { return "Product Code"; }
        }
        public virtual string Inner
        {
            get { return "Inner"; }
        }
        public virtual string History
        {
            get { return "History"; }
        }
        public virtual string AddNewItems
        {
            get { return "Add new item(s)"; }
        }
        public virtual string NoProductsMessage
        {
            get { return "Please add items to grid to waste"; }
        }
        public virtual string Date
        {
            get { return "Date"; }
        }
        public virtual string User
        {
            get { return "User"; }
        }
        public virtual string ItemQuantity
        {
            get { return "Item Qty"; }
        }
        public virtual string ViewDetails
        {
            get { return "View Details"; }
        }
        public virtual string PageTitle
        {
            get { return "Waste"; }
        }
        public virtual string Last
        {
            get { return "Last"; }
        }
        public virtual string Days
        {
            get { return "Days"; }
        }
        public virtual string CustomRange
        {
            get { return "Custom Range"; }
        }
        public virtual String SearchForItems
        {
            get { return "Search for items"; }
        }
        public virtual String NoItemsHaveBeenFound
        {
            get { return "No Item(s) have been found."; }
        }
        public virtual String Close
        {
            get { return "Close"; }
        }
        public virtual String AddItems
        {
            get { return "Add item(s)"; }
        }
        public virtual String Type
        {
            get { return "Type"; }
        }
        public virtual String Raw
        {
            get { return "Raw"; }
        }
        public virtual String Finished
        {
            get { return "Finished"; }
        }
        public virtual String FinishAdjustment
        {
            get { return "Finish Inventory Adjustment"; }
        }
        public virtual String ItemsBeingModified
        {
            get { return "Items being modified:"; }
        }
        public virtual String AdjustmentSubmit
        {
            get { return "Submit"; }
        }
        public virtual String AdjustmentSubmitSuccess
        {
            get { return "Inventory Adjustment Successfully Submitted"; }
        }
        public virtual String AdjustmentSubmitFail
        {
            get { return "Inventory Adjustment Failed Submit"; }
        }
        public virtual string Cost
        {
            get { return "Cost"; }
        }
        public virtual String WasteHistory
        {
            get { return "Waste History"; }
        }
        public virtual string NoItemsOfType
        {
            get { return "No items of this type have been added"; }
        }

        public virtual string AddNewItemToBegin
        {
            get { return "No items have been added to waste"; }
        }
 
        // Menu variables
        public virtual String InventoryWaste
        {
            get { return "Inventory Waste"; }
        }
        public virtual String MenuHistory
        {
            get { return "History"; }
        }
        public virtual String MenuRecord
        {
            get { return "Record"; }
        }

        public virtual String RemoveItem
        {
            get { return "Remove Item"; }
        }

        public virtual String ToggleFavorite
        {
            get { return "Toggle Favorite"; }
        }

        public virtual String PeriodClosed
        {
            get { return "Period closed for selected date."; }
        }
    }
}
