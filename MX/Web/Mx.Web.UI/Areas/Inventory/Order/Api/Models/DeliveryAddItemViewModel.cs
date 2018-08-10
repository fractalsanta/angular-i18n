using System;
using AutoMapper;
using Mx.Inventory.Services.Contracts.Responses;
using Mx.Services.Shared;

namespace Mx.Web.UI.Areas.Inventory.Order.Api.Models
{
    public class DeliveryAddItemViewModel : IConfigureAutoMapping
    {
        public Int64 Id { get; set; }
        public String ItemCode { get; set; }
        public String Description { get; set; }
        public String VendorPurchaseUnit { get; set; }
        public String InventoryPurchaseUnit { get; set; }
        public String InventoryUnit { get; set; }
        public Decimal Price { get; set; }

        public String Unit
        {
            get
            {
                return (String.IsNullOrEmpty(VendorPurchaseUnit))
                           ? ((String.IsNullOrEmpty(InventoryPurchaseUnit)) ? InventoryUnit : InventoryPurchaseUnit)
                           : VendorPurchaseUnit;
            }
        }

        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<DeliveryAddItemSearchResponse, DeliveryAddItemViewModel>();
        }
    }
}