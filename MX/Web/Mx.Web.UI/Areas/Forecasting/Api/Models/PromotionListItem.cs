using System;
using Mx.Forecasting.Services.Contracts.Responses;
using Mx.Web.UI.Config.Mapping;

namespace Mx.Web.UI.Areas.Forecasting.Api.Models
{
    [MapFrom(typeof(PromotionListItemResponse))]
    public class PromotionListItem
    {
        public long PromotionId { get; set; }
        public string Name { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool LimitedTimeOffer { get; set; }
        public Enums.PromotionStatus Status { get; set; }
        public Enums.PromotionTimeline Timeline { get; set; }
        public string TimelineText { get; set; }
    }
}