using System;
using AutoMapper;
using Mx.Deliveries.Services.Contracts.Responses;
using Mx.Services.Shared;
using Mx.Web.UI.Areas.Workforce.DriverDistance.Api.Models.Enums;
using Mx.Web.UI.Config.Converters;
using Newtonsoft.Json;

namespace Mx.Web.UI.Areas.Workforce.DriverDistance.Api.Models
{
    public class DriverDistanceRecord : IConfigureAutoMapping
    {
        public Int64 Id { get; set; }
        public Int64 EntityId { get; set; }

        [JsonConverter(typeof(DateTimeConverter))]
        public DateTime SubmitTime { get; set; }

        public Decimal StartDistance { get; set; }
        public Decimal EndDistance { get; set; }
        public DriverDistanceStatus Status { get; set; }

        public String AuthorizedByName { get; set; }
        public String EmployeeName { get; set; }

        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<DriverDistanceResponse, DriverDistanceRecord>()
                .ForMember(dest => dest.EmployeeName,
                    opt => opt.MapFrom(src => (src.Employee != null)
                                    ? src.Employee.FirstName + " " + src.Employee.LastName
                                    : String.Empty))
                .ForMember(dest => dest.AuthorizedByName,
                    opt => opt.MapFrom(src => (src.AuthorizingUser != null)
                                    ? src.AuthorizingUser.FirstName + " " + src.AuthorizingUser.LastName
                                    : String.Empty));
        }
    }
}