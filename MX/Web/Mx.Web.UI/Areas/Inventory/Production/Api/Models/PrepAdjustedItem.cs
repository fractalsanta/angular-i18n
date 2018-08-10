using System;
using AutoMapper;
using Mx.Inventory.Services.Contracts.Requests;
using Mx.Inventory.Services.Contracts.Responses;
using Mx.Inventory.Services.Models;
using Mx.Services.Shared;

namespace Mx.Web.UI.Areas.Inventory.Production.Api.Models
{
    public class PrepAdjustedItem : IConfigureAutoMapping
    {
        public Boolean IsFavorite { get; set; }
        public Int64 Id { get; set; }
        public Double UnitsPerOuter { get; set; }
        public Double UnitsPerInner { get; set; }
        public String ItemCode { get; set; }
        public String Name { get; set; }
        public String Outer { get; set; }
        public String Inner { get; set; }
        public String Unit { get; set; }
        public Decimal InventoryUnitCost { get; set; }
        public Double? Units { get; set; }
        public Double? Inners { get; set; }
        public Double? Outers { get; set; }
        public Decimal Cost { get; set; }
        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<InventoryEntityItem, PrepAdjustedItem>()
                .ForMember(x => x.Id, opt => opt.MapFrom(src => src.ItemId))
                .ForMember(x => x.Name, opt => opt.MapFrom(src => src.Item.Description))
                .ForMember(x => x.ItemCode, opt => opt.MapFrom(src => src.Item.ItemCode))
                .ForMember(x => x.Unit, opt => opt.MapFrom(src => src.Item.InventoryUnit))
                .AfterMap((ei, r) => r.Outer = ei.Item.OuterUom)
                .AfterMap((ei, r) => r.Inner = ei.Item.InnerUom);

            Mapper.CreateMap<PrepAdjustedItem, PrepAdjustItemRequest>()
                .ForMember(x => x.Id, opt => opt.MapFrom(y => y.Id))
                .ForMember(x => x.UnitUom, opt => opt.MapFrom(y => y.Unit))
                .AfterMap((vm, r) =>
                {
                    r.TotalUnits = 0;
                    if (vm.Outers.HasValue) r.TotalUnits += (vm.Outers.Value * vm.UnitsPerOuter);
                    if (vm.Inners.HasValue) r.TotalUnits += (vm.Inners.Value * vm.UnitsPerInner);
                    if (vm.Units.HasValue) r.TotalUnits += vm.Units.Value;
                });

            Mapper.CreateMap<PrepAdjustItemResponse, PrepAdjustedItem>()
                .ForMember(x => x.Name, opt => opt.MapFrom(y => y.Description))
                .ForMember(x => x.Unit, opt => opt.MapFrom(y => y.UnitUom))
                .ForMember(x => x.Inner, opt => opt.MapFrom(y => y.InnerUom))
                .ForMember(x => x.Outer, opt => opt.MapFrom(y => y.OuterUom));
        }
    }
}