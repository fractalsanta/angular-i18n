using System;
using System.Collections.Generic;
using AutoMapper;
using Mx.Forecasting.Services.Contracts.Requests;
using Mx.Forecasting.Services.Contracts.Responses;
using Mx.Services.Shared;
using Mx.Web.UI.Config.T4;

namespace Mx.Web.UI.Areas.Forecasting.Api.Models
{
    [MapToTypeScript]
    public class Promotion : IConfigureAutoMapping
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool UseZones { get; set; }
        public bool LimitedTimeOffer { get; set; }
        public bool OverwriteManager { get; set; }
        public Enums.PromotionStatus Status { get; set; }
        public Enums.PromotionTimeline Timeline { get; set; }

        public IEnumerable<PromotionSalesItem> Items { get; set; }
        public IEnumerable<long> Entities { get; set; }
        public IEnumerable<long> Zones { get; set; }

        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<PromotionResponse, Promotion>();
            Mapper.CreateMap<Promotion, PromotionRequest>();
        }

        public Promotion()
        {
            Timeline = Enums.PromotionTimeline.Uninitialized;
        }
    }
}