using System.Collections.Generic;
using Mx.Forecasting.Services.Contracts.Responses;
using Mx.Web.UI.Config.Mapping;
using Mx.Web.UI.Config.T4;

namespace Mx.Web.UI.Areas.Forecasting.Api.Models
{
    [MapToTypeScript]
    [MapFrom(typeof(PromotionOverlapResponse))]
    public class PromotionOverlap
    {
        public string ItemCode { get; set; }
        public string Description { get; set; }
        public IEnumerable<string> Promotions { get; set; }
    }
}