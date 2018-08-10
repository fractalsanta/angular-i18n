using System;
using AutoMapper;
using Mx.Inventory.Services.Contracts.Requests;
using Mx.Services.Shared;

namespace Mx.Web.UI.Areas.Inventory.Count.Api.Models
{
    public class CountUpdate : IConfigureAutoMapping
    {
        public Int64 CountId { get; set; }
        public Int64 CountDetailId { get; set; }
        public Int64 ItemId { get; set; }
        public Int64 LocationId { get; set; }
        public String UnitType { get; set; }
        public Single Amount { get; set; }
        public Boolean ReadyToApply { get; set; }
        public Boolean ToClear { get; set; }
        public Boolean CheckVariance { get; set; }
        public Decimal VariancePercent { get; set; }
        public Boolean IsProcessed { get; set; }

        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<UpdateCountDetailRequest, CountUpdate>();
            Mapper.CreateMap<CountUpdate, UpdateCountDetailRequest>();

            Mapper.CreateMap<UpdateCountDetailRequest, CountUpdate>()
               .ForMember(x => x.CheckVariance, opt => opt.MapFrom(src => src.CanViewCountVariance));
            Mapper.CreateMap<CountUpdate, UpdateCountDetailRequest>()
               .ForMember(x => x.CanViewCountVariance, opt => opt.MapFrom(src => src.CheckVariance));
        }
    }
}