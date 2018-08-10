using AutoMapper;
using Mx.Administration.Services.Contracts.Responses;
using Mx.Administration.Services.Contracts.Requests;
using Mx.Services.Shared;
using System;
using System.Collections.Generic;

namespace Mx.Web.UI.Areas.Administration.DayCharacteristic.Api.Models
{
    public class EntityDayCharacteristic : IConfigureAutoMapping
    {
        public String Notes { get; set; }
        public IEnumerable<DayCharacteristic> DayCharacteristics { get; set; }

        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<EntityDayCharacteristicResponse, EntityDayCharacteristic>();
            Mapper.CreateMap<EntityDayCharacteristic, EntityDayCharacteristicRequest>();
        }

    }
}