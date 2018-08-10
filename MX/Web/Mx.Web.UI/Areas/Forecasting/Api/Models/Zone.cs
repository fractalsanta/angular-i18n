using System;
using Mx.Forecasting.Services.Contracts.Responses;
using Mx.Forecasting.Services.Contracts.Requests;
using Mx.Web.UI.Config.Mapping;
using Mx.Services.Shared;
using AutoMapper;

namespace Mx.Web.UI.Areas.Forecasting.Api.Models
{
    public class Zone : IConfigureAutoMapping
    {
        public Int64 Id { get; set; }
        public String Name { get; set; }
        public Int32 EntityCount { get; set; }

        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<Zone, ZoneRequest>();
            Mapper.CreateMap<ZoneResponse, Zone>();
        }

    }
}