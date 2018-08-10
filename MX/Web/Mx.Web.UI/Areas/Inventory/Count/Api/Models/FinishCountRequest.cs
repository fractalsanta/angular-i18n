using System;

namespace Mx.Web.UI.Areas.Inventory.Count.Api.Models
{
    public class FinishCountRequest
    {
        public long CountId { get; set; }
        public long EntityId { get; set; }
        public string CountKey { get; set; }
        public string ApplyDate { get; set; }
        public bool IsSuggestedDate { get; set; }
        public string CountType { get; set; }
        public String ConnectionId { get; set; }
    }
}