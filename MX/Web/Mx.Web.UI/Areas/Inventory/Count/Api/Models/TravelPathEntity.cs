using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Mx.Web.UI.Areas.Inventory.Count.Api.Models
{
    public class TravelPathEntity
    {
        public Int64 EntityId { get; set; }
        public IEnumerable<TravelPath> TravelPath { get; set; }
        public Boolean CanShowDisableCountForStockTakeUnits { get; set; }
    }
}