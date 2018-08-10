using System;
using System.Collections.Generic;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Config.T4;

namespace Mx.Web.UI.Areas.Forecasting.Api.Models
{
    [MapToTypeScript]
    public class PromotionFormData
    {
        public Promotion Promotion { get; set; }
        public DateTime Today { get; set; }
        public IEnumerable<Zone> Zones { get; set; }
        public IEnumerable<JsTreeNode> Entities { get; set; }
    }
}