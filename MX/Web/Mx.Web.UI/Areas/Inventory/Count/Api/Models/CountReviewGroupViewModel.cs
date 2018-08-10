using System;
using System.Collections.Generic;
using Mx.Inventory.Services.Contracts.Responses;
using Mx.Web.UI.Config.Mapping;

namespace Mx.Web.UI.Areas.Inventory.Count.Api.Models
{
    [MapFrom(typeof(CountReviewGroupResponse))]
    public class CountReviewGroupViewModel
    {
        public String Name { get; set; }
        public Decimal GroupValue { get; set; }
        public Decimal GroupPercentValue { get; set; }
        public IEnumerable<CountReviewItemViewModel> Items { get; set; }
    }
}