using System;
using AutoMapper;
using Mx.Labor.Services.Contracts.Requests;
using Mx.Labor.Services.Contracts.Responses;
using Mx.Services.Shared;
using Mx.Web.UI.Config.Converters;
using Newtonsoft.Json;

namespace Mx.Web.UI.Areas.Workforce.MyAvailability.Api.Models
{
    public class TimeRange : IConfigureAutoMapping
    {
        [JsonConverter(typeof(DateTimeConverter))]
        public DateTime Start { get; set; }
        [JsonConverter(typeof(DateTimeConverter))]
        public DateTime End { get; set; }

        public bool IsAllDay
        {
            get
            {
                // 24 hours  is expressed as 00:00 to 00:00 but we also consider 00:00 to 23:59 as 24 hours
                return Math.Abs(Math.Round((End - Start).TotalHours)) > 23.99 ||
                       Math.Round((End - Start).TotalMinutes) < 1;
            }
            set
            {
                if (value)
                {
                    // Start and end are both midnight
                    var today = DateTime.Today;
                    End = today;
                    Start = today;
                }
            }
        }

        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<LaborAvailabilityResponse.TimeRange, TimeRange>();
            Mapper.CreateMap<LaborAvailabilityResponse.TimeRange, TimeRange>()
                .ForMember(x => x.Start, opt => opt.MapFrom(src => src.Start))
                .ForMember(x => x.End, opt => opt.MapFrom(src => src.End));

            Mapper.CreateMap<TimeRange, LaborAvailabilityRequest.TimeRange>();
        }
    }
}