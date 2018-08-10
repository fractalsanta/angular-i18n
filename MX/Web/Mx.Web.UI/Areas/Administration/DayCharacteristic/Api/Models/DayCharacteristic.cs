using AutoMapper;
using Mx.Administration.Services.Contracts.Responses;
using Mx.Administration.Services.Contracts.Requests;
using Mx.Services.Shared;
using System;
using System.Collections.Generic;

namespace Mx.Web.UI.Areas.Administration.DayCharacteristic.Api.Models
{
    public class DayCharacteristic : IConfigureAutoMapping
    {
        public String Code { get; set; }
        public String Description { get; set; }

        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<DayCharacteristicResponse, DayCharacteristic>();
            Mapper.CreateMap<DayCharacteristic, DayCharacteristicRequest>();
        }
    }
}