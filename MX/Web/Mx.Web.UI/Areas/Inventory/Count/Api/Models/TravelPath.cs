using System;
using System.Collections.Generic;
using AutoMapper;
using Mx.Inventory.Services.Contracts.Requests;
using Mx.Inventory.Services.Contracts.Responses;
using Mx.Services.Shared;
using Mx.Web.UI.Areas.Core.Api.Models;

namespace Mx.Web.UI.Areas.Inventory.Count.Api.Models
{
    public class TravelPath : IConfigureAutoMapping
    {
        public Int64 Id { get; set; }
        public String Location { get; set; }
        public String LocationType { get; set; }
        public IEnumerable<TravelPathItem> Items { get; set; }

        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<TravelPath, TravelPathRequest>()
                .ForMember(x => x.Id, x => x.Ignore());

            Mapper.CreateMap<EntityLocationResponse, TravelPath>()
                .ForMember(x => x.Items, opt => opt.MapFrom(src => src.LocationItems));
        }
    }
}