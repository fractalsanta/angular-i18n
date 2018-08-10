using System;
using Mx.Inventory.Services.Contracts.Responses;
using Mx.Services.Shared;
using Mx.Web.UI.Config.Mapping;

namespace Mx.Web.UI.Areas.Inventory.Transfer.Api.Models
{
    [MapFrom(typeof(GetStoresForSameZoneTypeResponse))]
    public class StoreItem : IConfigureAutoMapping
    {
        public Int64 Id { get; set;}
        public String StoreName { get; set; }
        public String DistanceInMiles { get; set; }
        public String DistanceInMilesDisplay
        {
            get
            {
                return DistanceInMiles != null ? String.Format("{0} miles", DistanceInMiles) : ""; 
            }
        }
    }
}