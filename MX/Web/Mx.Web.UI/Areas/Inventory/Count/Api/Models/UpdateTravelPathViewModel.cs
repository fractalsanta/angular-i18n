using System;
using System.Collections.Generic;
using AutoMapper;
using Mx.Inventory.Services.Contracts.Requests;
using Mx.Services.Shared;
using Mx.Web.UI.Areas.Core.Api.Models;

namespace Mx.Web.UI.Areas.Inventory.Count.Api.Models
{
    public class UpdateTravelPath : IConfigureAutoMapping
    {
        public TravelPathActionType Type { get; set; }
        public Int64 LocationId { get; set; }
        public Int64 TargetLocationId { get; set; }
        public Int64 TargetId { get; set; }
        public Int64[] ItemIds { get; set; }
        public String[] AddItems { get; set; }
        public String[] Frequencies { get; set; }

        public Dictionary<Int64, Int32> TravelPathInfo { get; set; }

        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<UpdateTravelPath, UpdateTravelPathRequest>();
        }
    }
}