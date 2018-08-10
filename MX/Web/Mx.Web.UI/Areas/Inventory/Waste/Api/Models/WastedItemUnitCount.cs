using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Mx.Web.UI.Areas.Inventory.Waste.Api.Models
{
    public class WastedItemUnitCount
    {
        public Double? Units { get; set; }
        public Double? Inners{ get; set; }
        public Double? Outers { get; set; }
        public WasteReason Reason { get; set; }
    }
}