using System.Collections.Generic;
using AutoMapper;
using Mx.Inventory.Services.Contracts.Responses;
using Mx.Services.Shared;

namespace Mx.Web.UI.Areas.Inventory.Waste.Api.Models
{
    public class WasteItems : IConfigureAutoMapping
    {
        public IEnumerable<WastedItemCount> InventoryItems { get; set; }
        public IEnumerable<WastedItemCount> SalesItems { get; set; }

        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<WasteItems, WasteableItemsResponse>()
                .ForMember(x => x.SalesItems, opt => opt.MapFrom(src => src.SalesItems))
                .ForMember(x => x.InventoryItems, opt => opt.MapFrom(src => src.InventoryItems));

            Mapper.CreateMap<WasteableItemsResponse, WasteItems>()
                .ForMember(x => x.SalesItems, opt => opt.MapFrom(src => src.SalesItems))
                .ForMember(x => x.InventoryItems, opt => opt.MapFrom(src => src.InventoryItems));
        }
    }
}