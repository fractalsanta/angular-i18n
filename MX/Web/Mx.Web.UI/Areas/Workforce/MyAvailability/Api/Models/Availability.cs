using System.Collections.Generic;
using AutoMapper;
using Mx.Labor.Services.Contracts.Requests;
using Mx.Labor.Services.Contracts.Responses;
using Mx.Services.Shared;

namespace Mx.Web.UI.Areas.Workforce.MyAvailability.Api.Models
{
    public class Availability : IConfigureAutoMapping
    {
        public List<DayAvailability> AvailableDays { get; set; }

        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<LaborAvailabilityResponse, Availability>();
            Mapper.CreateMap<LaborAvailabilityResponse.DayAvailability, DayAvailability>();
            Mapper.CreateMap<LaborAvailabilityResponse.TimeRange, TimeRange>();
            
            Mapper.CreateMap<LaborAvailabilityResponse, Availability>()
                .ForMember(x => x.AvailableDays, opt => opt.MapFrom(src => src.AvailableDays ?? null));

            Mapper.CreateMap<Availability, LaborAvailabilityRequest>();
            Mapper.CreateMap<DayAvailability, LaborAvailabilityRequest.DayAvailability>();
            Mapper.CreateMap<TimeRange, LaborAvailabilityRequest.TimeRange>();

            Mapper.CreateMap<Availability, LaborAvailabilityRequest>()
                .ForMember(x => x.AvailableDays, opt => opt.MapFrom(src => src.AvailableDays));

        }
    }
}