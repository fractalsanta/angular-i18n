namespace Mx.Web.UI.Areas.Inventory.Order.Api.Models
{
    public class ChangeApplyDateResponse
    {
        public long NewOrderId { get; set; }

        public bool IsPeriodClosed { get; set; }
    }
}