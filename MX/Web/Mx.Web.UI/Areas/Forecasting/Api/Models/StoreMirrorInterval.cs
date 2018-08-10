using System;
using AutoMapper;
using Mx.Forecasting.Services.Contracts.Requests;
using Mx.Forecasting.Services.Contracts.Responses;
using Mx.Services.Shared;
using Mx.Forecasting.Services.Contracts;

namespace Mx.Web.UI.Areas.Forecasting.Api.Models
{
    public class StoreMirrorInterval : IConfigureAutoMapping
    {
        public Int64 Id { get; set; }
        public DateTime SourceDateStart { get; set; }
        public DateTime TargetDateStart { get; set; }
        public DateTime TargetDateEnd { get; set; }
        public Single Adjustment { get; set; }
        public Guid GroupId { get; set; }

        public Entity SourceEntity { get; set; }
        public Entity TargetEntity { get; set; }

        public Boolean IsCorporateMirror { get; set; }
        public Boolean OverwriteManager { get; set; }

        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<StoreMirrorIntervalResponse, StoreMirrorInterval>();
            Mapper.CreateMap<StoreMirrorInterval, StoreMirrorIntervalRequest>();
        }
    }
}