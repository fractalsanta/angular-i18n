using AutoMapper;
using Mx.Forecasting.Services.Contracts.Requests;
using Mx.Forecasting.Services.Contracts.Responses;
using Mx.Services.Shared;
using Mx.Services.Shared.Misc;
using Mx.Web.UI.Config.T4;

namespace Mx.Web.UI.Areas.Forecasting.Api.Models
{
    [MapToTypeScript]
    public class PromotionSalesItem : IConfigureAutoMapping
    {
        public long Id { get; set; }
        public string ItemCode { get; set; }
        public string Description { get; set; }
        public double AdjustmentPercent { get; set; }
        public bool Impacted { get; set; }

        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<PromotionSalesItemResponse, PromotionSalesItem>()
                .ForMember(x => x.AdjustmentPercent, y => y.MapFrom(z => PercentConverter.FromMultiplier(z.Adjustment, 0)));
            Mapper.CreateMap<PromotionSalesItem, PromotionSalesItemRequest>()
                .ForMember(x => x.Adjustment, y => y.MapFrom(z => PercentConverter.ToMultiplier(z.AdjustmentPercent)));
        }
    }
}