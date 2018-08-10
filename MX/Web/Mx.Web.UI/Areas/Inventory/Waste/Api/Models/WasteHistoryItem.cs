using System;
using Mx.Inventory.Services.Contracts.Responses;
using Mx.Web.UI.Config.Mapping;

namespace Mx.Web.UI.Areas.Inventory.Waste.Api.Models
{
    [MapFrom(typeof(WasteHistoryItemResponse))]
    public class WasteHistoryItem
    {
        public string Description { get; set; }

        public string ProductCode { get; set; }

        public string Unit { get; set; }

        public decimal UnitCost { get; set; }

        public decimal Qty { get; set; }

        public decimal TotalValue { get; set; }

        public DateTime WasteDate { get; set; }

        public int UserId { get; set; }

        public string UserName { get; set; }

        public string Reason { get; set; }

        public bool IsFinished { get; set; }
    }
}