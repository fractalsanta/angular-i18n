using System;
using AutoMapper;
using Mx.Deliveries.Services.Contracts.Requests;
using Mx.Services.Shared;

namespace Mx.Web.UI.Areas.Workforce.DriverDistance.Api.Models
{
    public class CreateDriverDistanceRequest : IConfigureAutoMapping
    {
        public Int64 EmployeeUserId { get; set; }
        public DateTime TripBusinessDay { get; set; }
        public Decimal StartDistance { get; set; }
        public Decimal EndDistance { get; set; }

        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<CreateDriverDistanceRequest, AddDriverDistanceRequest>();
        }
    }
}