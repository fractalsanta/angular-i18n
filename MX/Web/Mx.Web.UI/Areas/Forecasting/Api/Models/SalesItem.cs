using System;
using Mx.Forecasting.Services.Contracts.Responses;
using Mx.Forecasting.Services.Contracts.Requests;
using Mx.Web.UI.Config.Mapping;
using Mx.Services.Shared;
using AutoMapper;

namespace Mx.Web.UI.Areas.Forecasting.Api.Models
{
    public class SalesItem : IConfigureAutoMapping
    {
        public Int64 Id { get; set; }
        public String ItemCode { get; set; }
        public String Description { get; set; }

        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<SalesItem, SalesItemRequest>();
            Mapper.CreateMap<SalesItemResponse, SalesItem>();
        }
    }
}