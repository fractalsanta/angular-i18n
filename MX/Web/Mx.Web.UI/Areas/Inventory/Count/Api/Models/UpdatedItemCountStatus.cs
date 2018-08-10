using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Mx.Web.UI.Areas.Inventory.Count.Api.Models
{
    public class UpdatedItemCountStatus
    {
        public CountUpdate CountUpdate { get; set; }
        public CountStatus CountStatus { get; set; }
    }
}