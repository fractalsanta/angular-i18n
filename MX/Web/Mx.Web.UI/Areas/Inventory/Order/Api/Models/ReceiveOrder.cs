using System;
using System.Collections.Generic;
using AutoMapper;
using Mx.Inventory.Services.Contracts.Responses;
using Model = Mx.Web.UI.Areas.Inventory.Order.Api.Models;
using Mx.Services.Shared;
using Mx.Web.UI.Config.Mapping;
using System.Linq;

namespace Mx.Web.UI.Areas.Inventory.Order.Api.Models
{
    [MapFrom(typeof(DeliveryResponse))]
    public class ReceiveOrder : IConfigureAutoMapping
    {
        public long Id { get; set; }
        public long OrderNumber { get; set; }
        public long VendorId { get; set; }
        public string Supplier { get; set; }
        public DateTime DeliveryDate { get; set; }
        public DateTime ApplyDate { get; set; }
        public Decimal TotalAmount { get; set; }
        public string InvoiceNumber { get; set; }
        public int OrderStatus { get; set; }
        public String OrderStatusDisplay { get; set; }
        public IList<ReceiveOrderDetail> Items { get; set; }
        public bool CanBePushedToTomorrow { get; set; }
        public bool HasBeenCopied { get; set; }
        public bool ReceivedShippingNotification { get; set; }
        public IList<Category> Categories { get; set; }
        public decimal CaseQuantity
        { 
            get
            {
                    return this.Items.Sum(x => x.OrderedQuantity);

            }
        }
        public decimal ReceivedCaseQuantity
        {
            get
            {
                return this.Items.Sum(x => x.ReceivedQuantity);
            }
        }

        public decimal TotalReceivedAmount
        {
            get
            {
                return Math.Round(this.Items.Where(x => x.ReceivedQuantity != 0M).Sum(x => x.ReceivedQuantity * x.Price), 2);
            }
        }

        public Int32 ItemsInOrder
        {
            get
            {
                    return this.Items.Count(x => x.OrderedQuantity > 0);
            }
        }
 
        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<DeliveryResponse, ReceiveOrder>()
                .AfterMap((dr, ro) =>
                {
                    var categories = new List<Category>();
                    if (dr != null && dr.Items != null)
                    {
                        categories.AddRange(dr.Items.GroupBy(item => item.CategoryId)
                        .Select(g => new Category
                        {
                            TotalItems = g.Count(),
                            ItemsInOrder = g.Count(x => x.OrderedQuantity > 0),
                            CategoryId = (g.Key == null ? 0 : g.Key.Value),
                            Name = g.ElementAt(0).CategoryName
                        }));
                    }
                    ro.Categories = categories;
                });
        }
    }
}