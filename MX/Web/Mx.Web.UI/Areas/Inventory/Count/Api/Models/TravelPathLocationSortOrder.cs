using AutoMapper;
using Mx.Inventory.Services.Contracts.Requests;
using Mx.Services.Shared;

namespace Mx.Web.UI.Areas.Inventory.Count.Api.Models
{
    public class TravelPathLocationSortOrder : IConfigureAutoMapping
    {
        public long EntityId { get; set; }
        public long MovingLocationId { get; set; }
        public long TargetId { get; set; }

        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<TravelPathLocationSortOrder, UpdateLocationSortOrderRequest>();
        }
    }
}