using AutoMapper;
using Mx.Reporting.Services.Contracts.Responses;
using Mx.Services.Shared;
using Mx.Web.UI.Config.Helpers;

namespace Mx.Web.UI.Areas.Reporting.Dashboard.Api.Models
{
    public class Interval: IConfigureAutoMapping
    {
        public short Id { get; set; }
        public double Value { get; set; }
        public string DisplayValue { get; set; }
        public string Class { get; set; }
        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<EntityMeasureResponse.Interval, Interval>()
                .ForMember(x => x.Value, x => x.MapFrom(y => y.Value[0].ToString().ExtractNumber() ?? 0))
                .ForMember(x => x.Class, x => x.MapFrom(y => y.Value[1].ToString()))
                .ForMember(x => x.DisplayValue, x => x.MapFrom(y => y.Value[0].ToString()));
        }
    }
}