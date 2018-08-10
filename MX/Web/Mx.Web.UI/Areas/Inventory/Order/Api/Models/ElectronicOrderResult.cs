using System;
using AutoMapper;
using Mx.Legacy.Services.Contracts.Responses;
using Mx.Services.Shared;

namespace Mx.Web.UI.Areas.Inventory.Order.Api.Models
{
    public class ElectronicOrderResult : IConfigureAutoMapping
    {
        public Boolean OrderSent { get; set; }
        public String OrderError { get; set; }
        public String OrderNumber { get; set; }

        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<ElectronicOrderResponse, ElectronicOrderResult>();
        }
    }
}