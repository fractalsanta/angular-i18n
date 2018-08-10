using System.Collections.Generic;
using AutoMapper;
using Mx.OperationalReporting.Services.Contracts.Requests;
using Mx.OperationalReporting.Services.Contracts.Responses;
using Mx.Services.Shared;

namespace Mx.Web.UI.Areas.Operations.Reporting.Api.Models
{
    public class ViewModel : IConfigureAutoMapping
    {
        public long EntityId { get; set; }
        public long UserId { get; set; }
        public ReportType ReportType { get; set; }
        public int ViewId { get; set; }
        public bool IsDefault { get; set; }
        public string ViewName { get; set; }
        public IEnumerable<short> ColumnIds { get; set; }

        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<ViewResponse, ViewModel>()
                .ForMember(dest => dest.ReportType, dest => dest.MapFrom(x => (ReportType)x.ReportType))
                .ForMember(dest => dest.UserId, dest => dest.MapFrom(src => src.UserId.HasValue ? src.UserId : 0));
            Mapper.CreateMap<ViewModel, ViewRequest>()
                .ForMember(dest => dest.ReportType, dest => dest.MapFrom(x => (OperationalReporting.Services.Contracts.Enums.ReportType)x.ReportType))
                .ForMember(dest => dest.UserId, dest => dest.MapFrom(src => src.UserId != 0 ? src.UserId : (long?)null));
                
        }
    }
}