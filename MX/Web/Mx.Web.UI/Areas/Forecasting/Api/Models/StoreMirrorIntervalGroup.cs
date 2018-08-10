using System;
using System.Collections.Generic;
using AutoMapper;
using Mx.Forecasting.Services.Contracts;
using Mx.Forecasting.Services.Contracts.Requests;
using Mx.Forecasting.Services.Contracts.Responses;
using Mx.Services.Shared;

namespace Mx.Web.UI.Areas.Forecasting.Api.Models
{
    public class StoreMirrorIntervalGroup : IConfigureAutoMapping
    {
        public IEnumerable<StoreMirrorInterval> Intervals { get; set; }

        public Guid GroupId { get; set; }
        public DateTime? CancelledDate { get; set; }
        public String CancelledByUser { get; set; }
        public DateTime SourceDateStart { get; set; }
        public DateTime SourceDateEnd { get; set; }
        public DateTime TargetDateStart { get; set; }
        public DateTime TargetDateEnd { get; set; }
        public StoreMirrorStatus OverallStatus { get; set; }
        public StoreMirrorStatusGroup OverallStatusGroup { get; set; }
        public bool OverwriteManager  { get; set; }

        public Entity SourceEntity { get; set; }
        public Entity TargetEntity { get; set; }

        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<StoreMirrorIntervalGroupResponse, StoreMirrorIntervalGroup>();
            Mapper.CreateMap<StoreMirrorIntervalGroup, StoreMirrorIntervalGroupRequest>();
        }
    }
}