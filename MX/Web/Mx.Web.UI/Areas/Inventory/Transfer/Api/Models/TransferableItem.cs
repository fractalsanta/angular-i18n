using System;
using Mx.Inventory.Services.Contracts.Responses;
using Mx.Services.Shared;
using Mx.Web.UI.Config.Mapping;
using AutoMapper;

namespace Mx.Web.UI.Areas.Inventory.Transfer.Api.Models
{
    [MapFrom(typeof(GetTransferableItemsBetweenStoresResponse))]
    public class TransferableItem : IConfigureAutoMapping
    {
        public String Code { get; set; }
        public Single Conversion { get; set; }
        public String Description { get; set; }
        public Int64 Id { get; set; }
        public String InventoryIndicator { get; set; }
        public String TransferUnit1 { get; set; }
        public String TransferUnit2 { get; set; }
        public String TransferUnit3 { get; set; }
        public String TransferUnit4 { get; set; }
        public Decimal InventoryUnitCost { get; set; }
        public String PurchaseUnit { get; set; }
        public Boolean Suggested { get; set; }
        public Double OnHandQuantity { get; set; }
        public Single TransferQty1 { get; set; }
        public Single TransferQty2 { get; set; }
        public Single TransferQty3 { get; set; }
        public Single TransferQty4 { get; set; }
        public long VendorItemId { get; set; }

        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<GetTransferableItemsBetweenStoresResponse, TransferableItem>()
                .ForMember(dest => dest.TransferUnit1, opt => opt.MapFrom(src => src.Unit1))
                .ForMember(dest => dest.TransferUnit2, opt => opt.MapFrom(src => src.Unit2))
                .ForMember(dest => dest.TransferUnit3, opt => opt.MapFrom(src => src.InventoryUnit))
                .ForMember(dest => dest.TransferUnit4, opt => opt.MapFrom(src => src.Unit4));
        }
    }
}