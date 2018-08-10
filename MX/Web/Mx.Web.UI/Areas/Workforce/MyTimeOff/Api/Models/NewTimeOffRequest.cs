using System;
using AutoMapper;
using Mx.Services.Shared;

namespace Mx.Web.UI.Areas.Workforce.MyTimeOff.Api.Models
{
    public class NewTimeOffRequest : IConfigureAutoMapping
    {
        public DateTime StartDateTime { get; set; }
        public DateTime EndDateTime { get; set; }
        public Int32 ReasonId { get; set; }
        public String Comments { get; set; }
        public decimal Hours { get; set; }

        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<NewTimeOffRequest, Labor.Services.Contracts.Requests.NewTimeOffRequest>();
        }
    }
}