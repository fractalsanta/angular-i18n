using AutoMapper;
using Mx.Inventory.Services.Contracts.Requests;
using Mx.Services.Shared;

namespace Mx.Web.UI.Areas.Inventory.Count.Api.Models
{
    public class TravelPathItemUpdate : IConfigureAutoMapping
    {
        public int CountType { get; set; }
        public bool Enabled { get; set; }
        public long EntityId { get; set; }
        public string Frequency { get; set; }
        public long ItemId { get; set; }
        public long LocationId { get; set; }
        public TravelPathCountUpdateMode UpdateMode { get; set; }

        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<TravelPathItemUpdate, UpdateInventoryCountRequest>();
        }
    }
}