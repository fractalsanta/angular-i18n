using System;
using Mx.Forecasting.Services.Contracts.Responses;
using Mx.Forecasting.Services.Contracts.Requests;
using Mx.Web.UI.Config.Mapping;
using Mx.Services.Shared;
using AutoMapper;

namespace Mx.Web.UI.Areas.Forecasting.Api.Models
{
    public class SalesItemMirrorInterval : IConfigureAutoMapping
    {
        public Int64 Id { get; set; }
        public DateTime SourceDateStart { get; set; }
        public DateTime TargetDateStart { get; set; }
        public DateTime TargetDateEnd { get; set; }
        public Single Adjustment { get; set; }
        public Boolean OverwriteManager { get; set; }
        public Boolean IsReadOnly { get; set; }
        public Boolean IsMirrorClosed { get; set; }

        public SalesItem SourceSalesItem { get; set; }
        public SalesItem TargetSalesItem { get; set; }
        public Zone Zone { get; set; }

        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<SalesItemMirrorIntervalResponse, SalesItemMirrorInterval>();
            Mapper.CreateMap<SalesItemMirrorInterval, SalesItemMirrorIntervalRequest>();

        }
    }
}