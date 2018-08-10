using System;
using Mx.Web.UI.Config.Translations;

namespace Mx.Web.UI.Areas.Inventory.Order.Api.Models
{
    [Translation("Ordering")]
    public class L10N
    {
        #region Ordering Status Enums

        public virtual String Pending
        {
            get { return "Pending"; }
        }

        public virtual String PastDue
        {
            get { return "Past Due"; }
        }

        public virtual String InProgress
        {
            get { return "In Progress"; }
        }

        public virtual String ReceiveOrderSubmitInProgress
        {
            get { return "Order Receiving in progress"; }
        }

        public virtual String ChangeApplyDateSuccessful
        {
            get { return "Apply date and time have been updated. New Order Number: {0}"; }
        }

        public virtual String PeriodIsClosed
        {
            get { return "Period is closed"; }
        }

        public virtual String Cancelled
        {
            get { return "Cancelled"; }
        }

        public virtual String Placed
        {
            get { return "Placed"; }
        }

        public virtual String Ordered
        {
            get { return "Ordered"; }
        }

        public virtual String Shipped
        {
            get { return "Shipped"; }
        }

        public virtual String AutoReceived
        {
            get { return "Auto-Received"; }
        }

        public virtual String Received
        {
            get { return "Received"; }
        }

        public virtual String Returned
        {
            get { return "Returned"; }
        }

        public virtual String OnHold
        {
            get { return "On Hold"; }
        }

        public virtual String Rejected
        {
            get { return "Rejected"; }
        }

        public virtual String ItemsInDelivery
        {
            get { return "Items In Delivery"; }
        }

        public virtual String DeliveryTotal
        {
            get { return "Delivery Total"; }
        }

        #endregion

        #region Menu Items

        public virtual String InventoryOrder
        {
            get { return "Inventory Order"; }
        }

        public virtual String Place
        {
            get { return "Place"; }
        }

        public virtual String Receive
        {
            get { return "Receive"; }
        }

        public virtual string MenuReturn
        {
            get { return "Return"; }
        }

        #endregion

        #region Place/Schedule View

        public virtual String Orders
        {
            get { return "Orders"; }
        }

        public virtual String Scheduled
        {
            get { return "Scheduled"; }
        }

        public virtual String ScheduledOrders
        {
            get { return "Scheduled Orders"; }
        }

        public virtual String AllScheduledOrders
        {
            get { return "All Scheduled Orders"; }
        }

        public virtual String OverdueScheduledOrders
        {
            get { return "Overdue Scheduled Orders"; }
        }

        public virtual String Supplier
        {
            get { return "Supplier"; }
        }

        public virtual String OrderNumber
        {
            get { return "Order #"; }
        }

        public virtual String OrderDate
        {
            get { return "Order Date"; }
        }

        public virtual String DeliveryDate
        {
            get { return "Delivery Date"; }
        }

        public virtual String ApplyDate
        {
            get { return "Apply Date"; }
        }

        public virtual String DaysToCover
        {
            get { return "Days To Cover"; }
        }

        public virtual String Status
        {
            get { return "Status"; }
        }

        public virtual String ItemCounts
        {
            get { return "No. Items"; }
        }

        public virtual String TotalAmount
        {
            get { return "Total Amount"; }
        }

        public virtual String View
        {
            get { return "View"; }
        }

        public virtual String Cutoff
        {
            get { return "Cutoff"; }
        }

        public virtual String SkipOrder
        {
            get { return "Skip Order"; }
        }

        public virtual String CreateNewOrder
        {
            get { return "Create New Order"; }
        }

        public virtual String AddOrder
        {
            get { return "Add Order"; }
        }

        public virtual String Last
        {
            get { return "Last"; }
        }

        public virtual String CustomRange
        {
            get { return "Custom Range"; }
        }

        public virtual String Days
        {
            get { return "Days"; }
        }

        public virtual String SelectCustomRange
        {
            get { return "Select Custom Range"; }
        }

        public virtual String To
        {
            get { return "To"; }
        }

        public virtual String From
        {
            get { return "From"; }
        }

        public virtual String Apply
        {
            get { return "Apply"; }
        }

        public virtual String Draft
        {
            get { return "Draft"; }
        }

        #endregion

        #region Order Details

        public virtual String InvoiceNumber
        {
            get { return "Invoice Number"; }
        }

        public virtual String ReceiveDate
        {
            get { return "Receive Date"; }
        }

        public virtual String ItemsInOrder
        {
            get { return "Items In Order"; }
        }

        public virtual String ItemsReceived
        {
            get { return "Items Received"; }
        }

        public virtual String OrderTotal
        {
            get { return "Order Total"; }
        }

        public virtual String Min
        {
            get { return "Min"; }
        }

        public virtual String ItemCode
        {
            get { return "Code"; }
        }

        public virtual String Unit
        {
            get { return "Unit"; }
        }

        public virtual String ExtendedPrice
        {
            get { return "Extended"; }
        }

        public virtual String Extended
        {
            get { return "Extended"; }
        }

        public virtual String OnHand
        {
            get { return "On Hand"; }
        }

        public virtual String Taxable
        {
            get { return "Taxable"; }
        }

        public virtual String Price
        {
            get { return "Price"; }
        }

        public virtual String Quantity
        {
            get { return "Quantity"; }
        }

        public virtual String OnOrder
        {
            get { return "On Order"; }
        }

        public virtual String BuildTo
        {
            get { return "Build To"; }
        }

        public virtual String AllCategories
        {
            get { return "All Categories"; }
        }

        public virtual String LastOrder
        {
            get { return "Last Order"; }
        }

        public virtual String Max
        {
            get { return "Max"; }
        }

        public virtual String Forecast
        {
            get { return "Forecast"; }
        }

        public virtual String Description
        {
            get { return "Description"; }
        }

        public virtual String OrderDetails
        {
            get { return "Order Details"; }
        }

        public virtual String ItemDetails
        {
            get { return "Item Details"; }
        }

        public virtual String DeletedSuccessfully
        {
            get { return "deleted successfully."; }
        }

        public virtual String Youmustorderatleastoneitem
        {
            get { return "At least one item must be ordered."; }
        }

        public virtual String AllItems
        {
            get { return "All Items"; }
        }

        public virtual String NoMatchingItems
        {
            get { return "No matching items found."; }
        }

        public virtual String CustomizeColumns
        {
            get { return "Customize Columns"; }
        }

        public virtual String ActiveColumns
        {
            get { return "Active Columns"; }
        }

        public virtual String Columns
        {
            get { return "Columns"; }
        }

        public virtual String PreviousOrders
        {
            get { return "Previous Orders"; }
        }

        public virtual String Date
        {
            get { return "Date"; }
        }

        public virtual String Back
        {
            get { return "Back"; }
        }

        public virtual String TheOrderHasBeenPushedToTomorrow
        {
            get { return "The order #{0} has been pushed to tomorrow."; }
        }

        public virtual String InvalidQuantityMessage
        {
            get { return "Quantity must be a value between {0} and {1}."; }
        }

        public virtual String InvalidQuantityMessageNoMax
        {
            get { return "Quantity must be a value of at least {0}."; }
        }

        public virtual String ConversionRate
        {
            get { return "Conversion Rate"; }
        }

        public virtual String InvalidHistoricalOrderForm
        {
            get { return "Price and Received quantities must have a value"; }
        }


        #endregion

        #region New Order Dialog

        public virtual String CoverUntil
        {
            get { return "Cover Until"; }
        }

        public virtual String SelectDate
        {
            get { return "Select Date"; }
        }

        #endregion

        #region Actions

        public virtual String Actions
        {
            get { return "Actions"; }
        }

        public virtual String FinishReceive
        {
            get { return "Finish Receive"; }
        }

        public virtual String FinishLater
        {
            get { return "Finish Later"; }
        }

        public virtual String FinishNow
        {
            get { return "Finish Now"; }
        }

        public virtual String ChangeApplyDate
        {
            get { return "Change Apply Date"; }
        }

        public virtual String Delete
        {
            get { return "Delete"; }
        }

        public virtual String Return
        {
            get { return "Return"; }
        }

        public virtual String PushToTomorrow
        {
            get { return "Push to tomorrow"; }
        }

        #endregion

        #region General Dialog

        public virtual String Cancel
        {
            get { return "Cancel"; }
        }

        public virtual String Confirm
        {
            get { return "Confirm"; }
        }

        public virtual String DeleteOrder
        {
            get { return "Delete Order"; }
        }

		public virtual String ConfirmDeleteOrder
        {
            get { return "This order has not been submitted yet. Once deleted, you will no longer have access to this order. Are you sure you want to delete this order?"; }
        }

        #endregion

        #region Finish Order Dialog

        public virtual String ConfirmPlaceOrderMessage
        {
            get { return "This will finalize the order and lock it from further edits. Are you sure you want to continue?"; }
        }

        public virtual String AutoReceive
        {
            get { return "Auto-Receive Order"; }
        }

        #endregion

        #region Change Apply Date Dialog

        public virtual String ChangeApplyDateMessage
        {
            get { return "Changing the apply date of the order will create a copy of the order with the requested apply date. Are you sure you want to continue?"; }
        }

        public virtual String NewApplyDate
        {
            get { return "New Apply Date"; }
        }

        #endregion

        #region Electronic Orders

        public virtual String GenericElectronicOrderError
        {
            get { return "An error occurred while submitting the electronic order."; }
        }

        #endregion


        #region History

        public virtual String History
        {
            get { return "History"; }
        }

        public virtual String OrderHistory
        {
            get { return "Order History"; }
        }

        #endregion

        public virtual String SearchItems
        {
            get { return "Search Items..."; }
        }

        public virtual String SearchOrders
        {
            get { return "Search Orders..."; }
        }

        public virtual String PageSummary
        {
            get { return "Showing {0}-{1} of {2} filtered records"; }
        }

        public virtual string ErrorHasOccuredPleaseContactSysAdmin
        {
            get { return "Error has occurred. Please contact system administrator."; }
        }

        public virtual String PlacedOrdersExist
        {
            get { return "Placed orders exist for this store. Please review pending orders before proceeding to count."; }
        }

        public virtual String PlacedOrders
        {
            get { return "Placed Orders"; }
        }

        public virtual String OrderPlacedSuccessfully
        {
            get { return "Order {0} placed successfully."; }
        }

        public virtual String ManageColumns
        {
            get { return "Manage Columns"; }
        }

        public virtual String ReceiveOrder
        {
            get { return "Receive Order"; }
        }

        public virtual String ReceiveSelected
        {
            get { return "Receive Selected"; }
        }

        public virtual String ReceiveOrderDetail
        {
            get { return "Receive Order Details"; }
        }

        public virtual String CorrectReceive
        {
            get { return "Correct Receive"; }
        }

        public virtual String SaveChanges
        {
            get { return "Save Changes"; }
        }

        public virtual String CancelChanges
        {
            get { return "Cancel Changes"; }
        }

        public virtual String CancelConfirmation
        { 
            get { return "Leaving this screen will cause your edits to not be saved. Do you want to continue?"; } 
        }

        public virtual String ReceiveAdjustmentSuccess
        {
            get { return "Received order details adjusted."; }
        }

        public virtual String ReturnOrder
        {
            get { return "Return Order"; }
        }

        public virtual String ReturnOrderDetail
        {
            get { return "Return Order Details"; }
        }

        public virtual String ReturnEntireOrder
        {
            get { return "Return Entire Order"; }
        }

        public virtual String ReturnSelected
        {
            get { return "Return Selected"; }
        }

        public virtual String ReturnQuantityGreaterThanReceived
        {
            get { return "Return Quantity Greater Than Received"; }
        }

        public virtual String ReturnQuantityCannotExceedReceivedQuantity
        {
            get { return "Return quantity exceeds Received quantity"; }
        }

        public virtual String ReturnQty
        {
            get { return "Return"; }
        }

        public virtual String PreviousReturned
        {
            get { return "Prev. Returned"; }
        }

        public virtual String ReturnSuccessful
        {
            get { return "Selected items successfully returned."; }
        }

        public virtual String ReturnConfirmation
        {
            get { return "Return Confirmation"; }
        }
        
        public virtual String ReturnConfirmationMessage
        {
            get { return "Are you sure you want to return {0} item(s) from order {1}?"; }
        }

        public virtual String EntireOrderSuccessfullyReturned
        {
            get { return "Entire order successfully returned."; }
        }

        public virtual String DiscardChanges
        {
            get { return "Discard Changes"; }
        }

        public virtual String Cases
        {
            get { return "Cases"; }
        }

        public virtual String AddItems
        {
            get { return "Add item(s)"; }
        }

        public virtual String AddItemsShort
        {
            get { return "Item"; }
        }

        public virtual String PeriodClosed
        {
            get { return "Period closed for selected date."; }
        }

        public virtual String GenericCreateOrderError
        {
            get { return "An error occurred while creating the order."; }
        }

        public virtual String OrderConflictError
        {
            get { return "Order has already been placed."; }
        }

        public virtual String ConversionRatesMissing
        {
            get { return "Items highlighted below are missing conversion rates. The order cannot be created."; }
        }
    }
}
