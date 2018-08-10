using System.Collections.Generic;
using Mx.Forecasting.Services.Contracts.Responses;
using Mx.Web.UI.Config.Mapping;
using Mx.Web.UI.Config.T4;

namespace Mx.Web.UI.Areas.Forecasting.Api.Models
{
    [MapToTypeScript]
    [MapFrom(typeof(PromotionResultResponse))]
    public class PromotionResult
    {
        public long Id { get; set; }
        public IEnumerable<PromotionOverlap> Overlaps { get; set; }
    }
}