using AutoMapper;
using Mx.Forecasting.Services.Contracts.Requests;
using Mx.Forecasting.Services.Contracts.Responses;
using Mx.Services.Shared;
using Mx.Services.Shared.Contracts.Enums;
using System;
using System.Collections.Generic;
using Mx.Forecasting.Services.Contracts;

namespace Mx.Web.UI.Areas.Forecasting.Api.Models
{
    public class ForecastFilterAssignRecord : IConfigureAutoMapping
    {
        public Int32 Id { get; set; }
        public ForecastFilterFunction FunctionId { get; set; }
        public Int32? ServiceGroupId { get; set; }
        public Boolean IsActive { get; set; }
        public String Name { get; set; }

        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<ForecastFilterAssignResponse, ForecastFilterAssignRecord>();
            Mapper.CreateMap<ForecastFilterAssignRecord, ForecastFilterAssignRequest>();
        }
    }
}