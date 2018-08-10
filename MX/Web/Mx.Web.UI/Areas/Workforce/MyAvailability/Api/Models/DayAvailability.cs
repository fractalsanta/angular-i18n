using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Mx.Labor.Services.Contracts.Requests;
using Mx.Labor.Services.Contracts.Responses;
using Mx.Services.Shared;
using Mx.Web.UI.Config.Converters;
using Newtonsoft.Json;

namespace Mx.Web.UI.Areas.Workforce.MyAvailability.Api.Models
{
    public class DayAvailability : IConfigureAutoMapping
    {
        public DayOfWeek DayOfWeek { get; set; }
        [JsonConverter(typeof(DateTimeConverter))]
        public DateTime Date
        {
            get
            {
                var now = DateTime.Now;
                return now.AddDays((int)DayOfWeek - (int)now.DayOfWeek).Date;
            }
        }
        public List<TimeRange> Times { get; set; }

        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<LaborAvailabilityResponse.DayAvailability, DayAvailability>();
            Mapper.CreateMap<LaborAvailabilityResponse.DayAvailability, DayAvailability>()
                .ForMember(x => x.DayOfWeek, opt => opt.MapFrom(src => src.DayOfWeek))
                .ForMember(x => x.Times, opt => opt.MapFrom(src => src.Times));

            Mapper.CreateMap<DayAvailability, LaborAvailabilityRequest.DayAvailability>();
        }
    }
}