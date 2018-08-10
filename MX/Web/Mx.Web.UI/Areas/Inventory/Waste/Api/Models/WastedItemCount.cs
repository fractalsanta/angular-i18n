using System;
using AutoMapper;
using Mx.Inventory.Services.Contracts.Requests;
using Mx.Inventory.Services.Contracts.Responses;
using Mx.Services.Shared;

namespace Mx.Web.UI.Areas.Inventory.Waste.Api.Models
{
    public class WastedItemCount : IConfigureAutoMapping
    {
        public Boolean IsRaw { get; set; }
        public WastedItemUnitCount Counts { get; set; }
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

        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<WastedItemCount, WastedItemRequest>()
                .ForMember(x => x.ReasonId, opt => opt.MapFrom(y => y.Counts.Reason.Id))
                .ForMember(x => x.Reason, opt => opt.MapFrom(y => y.Counts.Reason.Description))
                .ForMember(x => x.UnitUom, opt => opt.MapFrom(y => y.Unit))
                .AfterMap((vm, r) =>
                {
                    r.TotalUnits = 0;
                    if (vm.Counts.Outers.HasValue) r.TotalUnits += (vm.Counts.Outers.Value * vm.UnitsPerOuter);
                    if (vm.Counts.Inners.HasValue) r.TotalUnits += (vm.Counts.Inners.Value * vm.UnitsPerInner);
                    if (vm.Counts.Units.HasValue) r.TotalUnits += vm.Counts.Units.Value;
                });

            Mapper.CreateMap<WastedItemCount, WasteableItemResponse>()
                .ForMember(x => x.Description, opt => opt.MapFrom(y => y.Name))
                .ForMember(x => x.OuterUom, opt => opt.MapFrom(y => y.Outer))
                .ForMember(x => x.InnerUom, opt => opt.MapFrom(y => y.Inner))
                .ForMember(x => x.UnitUom, opt => opt.MapFrom(y => y.Unit));

            Mapper.CreateMap<WasteableItemResponse, WastedItemCount>()
                .ForMember(x => x.Name, opt => opt.MapFrom(y => y.Description))
                .ForMember(x => x.Outer, opt => opt.MapFrom(y => y.OuterUom))
                .ForMember(x => x.Inner, opt => opt.MapFrom(y => y.InnerUom))
                .ForMember(x => x.Unit, opt => opt.MapFrom(y => y.UnitUom));
        }
    }
}