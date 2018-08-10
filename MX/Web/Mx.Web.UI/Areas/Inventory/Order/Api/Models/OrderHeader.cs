using System;
using AutoMapper;
using Mx.Inventory.Services.Contracts.Responses;
using Mx.Services.Shared;

namespace Mx.Web.UI.Areas.Inventory.Order.Api.Models
{
    public class OrderHeader : IConfigureAutoMapping
    {
        public Int64 Id { get; set; }
        public Int64 DisplayId { get; set; }
        public String VendorName { get; set; }
        public Int64 VendorId { get; set; }
        public DateTime OrderDate { get; set; }
        public DateTime DeliveryDate { get; set; }
        public DateTime? ReceivedDate { get; set; }
        public DateTime? ApplyDate { get; set; }
        public Int32 DaysToCover { get; set; }
        public String Status { get; set; }
        public DateTime? CoverUntilDate { get; set; }
        public Int64 OrderedItems { get; set; }
        public Double OrderedCases { get; set; }
        public Int64 TotalItems { get; set; }
        public Double TotalCases { get; set; }
        public OrderStatus OrderStatus { get; set; }


        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<OrderHeaderResponse, OrderHeader>()
                  .ForMember(x => x.OrderStatus, opt => opt.MapFrom(src => (OrderStatus)src.Status))                  
                  .ForMember(x => x.Status, opt => opt.MapFrom(src => Enum.GetName(typeof(OrderStatus), src.Status)))
                  .ForMember(x => x.OrderedCases, opt => opt.MapFrom(src => Math.Round(src.OrderedCases, 2)))
                  .ForMember(x => x.TotalCases, opt => opt.MapFrom(src => Math.Round(src.TotalCases, 2)))
                  .AfterMap((s,d) =>
                      {
                          if(s.DeliveryDate.HasValue)
                          {
                              d.CoverUntilDate = s.DeliveryDate.Value.AddDays(s.DaysToCover);
                          }
                      });
        }
    }
}