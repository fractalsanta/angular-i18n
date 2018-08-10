using AutoMapper;
using Mx.Inventory.Services.Contracts.Responses;
using Mx.Services.Shared;

namespace Mx.Web.UI.Areas.Inventory.Order.Api.Models
{
    public class CreateOrderResult : IConfigureAutoMapping
    {
        public long SupplyOrderId { get; set; }

        public ElectronicOrderResult ElectronicOrderResult { get; set; }

        public long EntityId { get; set; }

        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<CreateSupplyOrderResponse, CreateOrderResult>()
                .ForMember(x => x.ElectronicOrderResult, x => x.MapFrom(y => y.ElectronicOrderResponse));
        }
    }
}