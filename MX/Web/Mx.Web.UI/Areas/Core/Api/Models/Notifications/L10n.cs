using Mx.Web.UI.Config.Translations;

namespace Mx.Web.UI.Areas.Core.Api.Models.Notifications
{
    [Translation("Notifications")]
    public class L10N
    {
        #region Inventory

        public virtual string InventoryTravelPath
        {
            get { return "Inventory Travel Path"; }
        }

        public virtual string InventoryTravelPathItemsToAdd
        {
            get { return "New Items need to be added"; }
        }

        public virtual string InventoryCount
        {
            get { return "Inventory Count"; }
        }

        public virtual string InventoryTransfer
        {
            get { return "Inventory Transfer"; }
        }

        public virtual string InventoryTransferNeedsApproval
        {
            get { return "New transfer request needs approval"; }
        }

        public virtual string InventoryTransferNeedsToBeReceived
        {
            get { return "New transfer needs to be received"; }
        }

        public virtual string InventoryTransferNeedsAction
        {
            get { return "New Transfers require action"; }
        }

        #region Orders

        public virtual string ClickForMore
        {
            get { return "<Click for more>"; }
        }

        public virtual string OverdueOrderReceipts
        {
            get { return "Overdue Order Receipts"; }
        }

        public virtual string OverdueOrderLayout
        {
            get { return "#{0} - {1}"; }
        }

        public virtual string ScheduledOrders
        {
            get { return "Scheduled Orders"; }
        }

        public virtual string ScheduledOrdersDueToBePlaced
        {
            get { return "{0} Scheduled Orders due to be placed"; }
        }

        #endregion

        #endregion

        #region Delivery

        public virtual string ExtraDelivery
        {
            get { return "Extra Delivery"; }
        }

        public virtual string ExtraDeliveriesAwaitingApproval
        {
            get { return "Extra Delivery awaiting approval"; }
        }

        #endregion

        public virtual string DeviceIsConnected
        {
            get { return "Device is connected"; }
        }

        public virtual string DeviceIsOffline
        {
            get { return "Device is offline"; }
        }

        public virtual string OfflineModeMessage
        {
            get { return "Offline mode."; }
        }

        public virtual string PendingUpdates
        {
            get { return "Pending Updates"; }
        }

        public virtual string PendingTasksLowCase
        {
            get { return "pending tasks."; } 
        }

        public virtual string YouHaveNoNotifications
        {
            get { return "You have no notifications"; }
        }

        public virtual string YouHaveNotifications
        {
            get { return "You have {0} new notifications"; }
        }

        #region Driver

        public virtual string DriverDistanceArea
        {
            get { return "Driver Distance"; }
        }

        public virtual string DriverDistanceRecordAwaitingApproval
        {
            get { return "Driver Distance record to approve for"; }
        }

        public virtual string DriverDistanceRecordsAwaitingApproval
        {
            get { return "Driver Distance records to approve for"; }
        }

        #endregion
    }
}