using System;
using AutoMapper;
using Mx.Inventory.Services.Contracts.Responses;
using Mx.Services.Shared;

namespace Mx.Web.UI.Areas.Inventory.Order.Api.Models
{
    public class ReceiveOrderHeader : IConfigureAutoMapping
    {
        public Int64 Id { get; set; }
        public Int64 DisplayId { get; set; }
        public String VendorName { get; set; }
        public DateTime OrderDate { get; set; }
        public DateTime DeliveryDate { get; set; }
        public DateTime ReceivedDate { get; set; }
        public DateTime ApplyDate { get; set; }
        public String Status { get; set; }
        public Decimal? TotalAmount { get; set; }
        public Int64 ItemCounts { get; set; }

        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<OrderHeaderResponse, ReceiveOrderHeader>()
                  .ForMember(x => x.Status, opt => opt.MapFrom(src => Enum.GetName(typeof(OrderStatus), src.Status)));
        }
    }
}