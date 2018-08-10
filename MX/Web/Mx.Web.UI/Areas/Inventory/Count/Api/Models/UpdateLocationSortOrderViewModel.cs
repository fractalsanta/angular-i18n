using System;

namespace Mx.Web.UI.Areas.Inventory.Count.Api.Models
{
    public class UpdateLocationSortOrderViewModel
    {
        public Int64 EntityId { get; set; }
        public Int64[] LocationIds { get; set; }
        public Boolean Success { get; set; }
    }
}
