using System;
using System.Collections.Generic;
using AutoMapper;
using Mx.Inventory.Services.Contracts.Responses;
using Mx.Services.Shared;

namespace Mx.Web.UI.Areas.Inventory.Count.Api.Models
{
    public class InventoryCount : IConfigureAutoMapping
    {
        public Int64 Id { get; set; }
        public Int64 EntityId { get; set; }
        public string CountName { get; set; }
        public Int32 TypeId { get; set; }
        public DateTime CreateDate { get; set; }
        public Boolean HasInner { get; set; }
        public Boolean HasWeight { get; set; }
        public IEnumerable<CountLocation> Locations { get; set; }
        public Boolean HasPlacedOrders { get; set; }
        public Boolean IsApplyDateReadOnly { get; set; }
        public string LocalStoreDateTime { get; set; }

        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<InventoryCount, CountResponse>()
                .ForMember(x => x.Locations, opt => opt.MapFrom(src => src.Locations));

            Mapper.CreateMap<CountResponse, InventoryCount>()
                .ForMember(x => x.Locations, opt => opt.MapFrom(src => src.Locations));
        }
    }
}