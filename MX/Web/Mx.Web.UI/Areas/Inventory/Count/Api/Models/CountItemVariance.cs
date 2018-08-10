using System;
using AutoMapper;
using Mx.Inventory.Services.Contracts.Responses;
using Mx.Services.Shared;

namespace Mx.Web.UI.Areas.Inventory.Count.Api.Models
{
    public class CountItemVariance : IConfigureAutoMapping
    {
        public Int64 EntityId { get; set; }
        public Int64 CountId { get; set; }
        public Int64 ItemId { get; set; }
        public DateTime CalendarDate { get; set; }
        public Boolean HasVariance { get; set; }
        public Decimal VariancePercent { get; set; }

        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<CountItemVariance, CountItemVarianceResponse>();
            Mapper.CreateMap<CountItemVarianceResponse, CountItemVariance>();
        }
    }
}