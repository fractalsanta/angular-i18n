using AutoMapper;
using Mx.Forecasting.Services.Contracts.Requests;
using Mx.Forecasting.Services.Contracts.Responses;
using Mx.Services.Shared;
using Mx.Services.Shared.Contracts.Enums;
using System;
using System.Collections.Generic;

namespace Mx.Web.UI.Areas.Forecasting.Api.Models
{
    public class ForecastFilterRecord : IConfigureAutoMapping
    {
        public Int32 Id { get; set; }
        public String Name { get; set; }
        public Boolean IsForecastEditableViaGroup { get; set; }
        public IList<PosServiceType> ForecastFilterGroupTypes { get; set; }

        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<ForecastFilterResponse, ForecastFilterRecord>();
            Mapper.CreateMap<ForecastFilterRecord, ForecastFilterRequest>();
        }
    }
}