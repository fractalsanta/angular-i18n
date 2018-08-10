using System;
using AutoMapper;
using Mx.Services.Shared;
using Mx.Labor.Services.Contracts.Responses;
using System.Collections.Generic;
using Mx.Web.UI.Config.Converters;
using Newtonsoft.Json;

namespace Mx.Web.UI.Areas.Workforce.MySchedule.Api.Models
{
    
    public class CalendarEntry : IConfigureAutoMapping
    {
        public class Break
        {
            public Int32 ScheduledBreakId { get; set; }
            public Int32 Duration { get; set; }
            public Int32 OffSetFromStart { get; set; }
            public Int32 TypeId { get; set; }
            public Boolean IsPaid { get; set; }
            [JsonConverter(typeof(DateTimeConverter))]
            public DateTime StartDateTime { get; set; }
            [JsonConverter(typeof(DateTimeConverter))]
            public DateTime EndDateTime { get; set; }
        }
        public Int64 EmployeeId { get; set; }
        public String EmployeeFirstName { get; set; }
        public String EmployeeLastName { get; set; }
        public Int32 JobId { get; set; }
        [JsonConverter(typeof(DateTimeConverter))]
        public DateTime StartDateTime { get; set; }
        [JsonConverter(typeof(DateTimeConverter))]
        public DateTime EndDateTime { get; set; }
        public Int64 EntityId { get; set; }
        public String EntityName { get; set; }
        public String EntityAddress1 { get; set; }
        public String EntityPhone { get; set; }
        public String EntityCity { get; set; }
        public String EntityState { get; set; }
        public String EntityPostCode { get; set; }
        public String JobName { get; set; }
        public Int32 RoleId { get; set; }
        public String RoleName { get; set; }
        public Boolean IsInDirect { get; set; }
        public Boolean IsManagement { get; set; }
        public String Telephone { get; set; }
        public String Mobile { get; set; }
        public String Email { get; set; }
        public List<Break> Breaks { get; set; }
        public List<CalendarEntry> TeamShifts { get; set; }

        public Boolean IsTimeOffRequest { get; set; }
        public DateTime TimeOffRequestSubmitted { get; set; }
        public String TimeOffRequestMessage { get; set; }
        public String TimeOffRequestManagerComment { get; set; }
        public Int32 TimeOffRequestStatus { get; set; }

        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<CalendarEntry, ScheduledShiftResponse>()
                .ForMember(x => x.Breaks, opt => opt.MapFrom(src => src.Breaks));

            Mapper.CreateMap<ScheduledShiftResponse, CalendarEntry>()
                .ForMember(x => x.Breaks, opt => opt.MapFrom(src => src.Breaks));
            
            Mapper.CreateMap<CalendarEntry.Break, ScheduledShiftResponse.Break>();
            Mapper.CreateMap<ScheduledShiftResponse.Break, CalendarEntry.Break>();

            Mapper.CreateMap<CalendarEntry, ScheduledShiftWithEmployeeInfoResponse>()
                .ForMember(x => x.Breaks, opt => opt.MapFrom(src => src.Breaks));

            Mapper.CreateMap<ScheduledShiftWithEmployeeInfoResponse, CalendarEntry>()
                .ForMember(x => x.Breaks, opt => opt.MapFrom(src => src.Breaks));

            Mapper.CreateMap<CalendarEntry.Break, ScheduledShiftWithEmployeeInfoResponse.Break>();
            Mapper.CreateMap<ScheduledShiftWithEmployeeInfoResponse.Break, CalendarEntry.Break>();
        }
    }
}