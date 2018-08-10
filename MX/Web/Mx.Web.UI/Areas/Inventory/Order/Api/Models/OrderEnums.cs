using System.ComponentModel;

namespace Mx.Web.UI.Areas.Inventory.Order.Api.Models
{
    public enum OrderStatus
    {
        [Description("Pending")]
        Pending = 0,
        [Description("Past Due")]
        PastDue = 1,
        [Description("In Progress")]
        InProgress = 2,
        [Description("Cancelled")]
        Cancelled = 3,
        [Description("Placed")]
        Placed = 4,
        [Description("Received")]
        Received = 5,
        [Description("On Hold")]
        OnHold = 6,
        [Description("Rejected")]
        Rejected = 7,
        [Description("Shipped")]
        Shipped = 8,
        [Description("Auto-Received")]
        AutoReceived = 9
    }

}