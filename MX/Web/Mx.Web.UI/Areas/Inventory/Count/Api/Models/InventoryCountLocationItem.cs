using System;
using AutoMapper;
using Mx.Inventory.Services.Contracts.Responses;
using Mx.Services.Shared;
using Mx.Services.Shared.ExtensionMethods;
using Mx.Web.UI.Areas.Core.Api.Models;

namespace Mx.Web.UI.Areas.Inventory.Count.Api.Models
{
    public class InventoryCountLocationItem : IConfigureAutoMapping
    {
        //Id is either ItemId or Concat Id
        public String Id { get; set; }
        public String Name { get; set; }
        public String Outer { get; set; }
        public String Inner { get; set; }
        public String Unit { get; set; }
        public Int32 Tp { get; set; }
        public String Freq { get; set; }
        public String Type { get; set; }
        public String Code { get; set; }

        public Boolean EnabledForSelection
        {
            get { return true; }
        }

        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<InventoryCountItemResponse, InventoryCountLocationItem>()
                .ForMember(x => x.Id, opt => opt.MapFrom(src => src.ItemId))
                .ForMember(x => x.Freq, opt => opt.MapFrom(src => src.Frequency.ReverseString()))
                .ForMember(x => x.Name, opt => opt.MapFrom(src => src.Description))
                .ForMember(x => x.Tp, opt => opt.MapFrom(src => src.TravelPath));

            Mapper.CreateMap<EntityLocationItemResponse, InventoryCountLocationItem>()
                .ForMember(x => x.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(x => x.Name, opt => opt.MapFrom(src => src.ItemDescription))
                .ForMember(x => x.Code, opt => opt.MapFrom(src => src.ItemCode))
                .ForMember(x => x.Type, opt => opt.MapFrom(src => "EI"));
        }
    }
}