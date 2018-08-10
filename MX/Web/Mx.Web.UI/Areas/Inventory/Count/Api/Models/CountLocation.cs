using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Mx.Inventory.Services.Contracts.Responses;
using Mx.Services.Shared;

namespace Mx.Web.UI.Areas.Inventory.Count.Api.Models
{
    public class CountLocation : IConfigureAutoMapping
    {
        public Int64 Id { get; set; }
        public String Name { get; set; }
        public Int32 SortOrder { get; set; }
        public Int32 CountedTotal { get; set; }
        public Int32 UncountedTotal { get; set; }
        public Boolean SystemLocation { get; set; }
        public IEnumerable<CountItem> Items { get; set; }

        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<CountLocation, CountLocationResponse>()
                .ForMember(x => x.Items, opt => opt.MapFrom(src => src.Items));

            // Show*Count members populated to reduce client side requirement of validating all records
            Mapper.CreateMap<CountLocationResponse, CountLocation>()
                .ForMember(x => x.Items, opt => opt.MapFrom(src => src.Items));
        }
    }
}