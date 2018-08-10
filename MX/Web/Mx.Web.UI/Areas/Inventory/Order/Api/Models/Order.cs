using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Mx.Inventory.Services.Contracts.Requests;
using Mx.Inventory.Services.Contracts.Responses;
using Mx.Services.Shared;

namespace Mx.Web.UI.Areas.Inventory.Order.Api.Models
{
    public class Order : IConfigureAutoMapping
    {
        public Int64 Id { get; set; }
        public Int64 DisplayId { get; set; }
        public Int64 VendorId { get; set; }
        public String VendorName { get; set; }
        public String Status { get; set; }

        public Int32? DaysToCover { get; set; }
        public DateTime DeliveryDate { get; set; }
        public DateTime? CoverUntilDate { get; set; }

        public Int32 ItemsInOrder { get; set; }
        public Decimal ForecastTotal { get; set; }
        public Decimal TotalAmount { get; set; }

        public IList<OrderDetail> Details { get; set; }

        public IList<Category> Categories { get; set; }

        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<Order, DeliveryReceiveRequest>();

            Mapper.CreateMap<OrderResponse, Order>()
                .AfterMap((s, d) =>
                {
                    var categories = new List<Category>();
                    if (s != null && s.Details != null)
                    {
                        if (s.DeliveryDate.HasValue)
                        {
                            d.CoverUntilDate = s.DeliveryDate.Value.AddDays(s.DaysToCover);
                        }
                        d.ItemsInOrder = s.Details.Count(x => x.PurchaseUnitQuantity > 0);
                        d.ForecastTotal = Math.Round(s.Details.Sum(x => ((Decimal)x.Usage) * x.UnitPrice.GetValueOrDefault()), 2);
                        d.TotalAmount = s.Details.Sum(x => x.ExtendedAmount.GetValueOrDefault());
                        categories.AddRange(s.Details.GroupBy(item => item.CategoryId)
                        .Select(g => new Category
                        {
                            TotalItems = g.Count(),
                            ItemsInOrder = g.Count(x => x.PurchaseUnitQuantity > 0),
                            CategoryId = (g.Key == null ? 0 : g.Key.Value),
                            Name = g.ElementAt(0).CategoryName
                        }));
                    }
                    d.Categories = categories;
                });
        }
    }
}
