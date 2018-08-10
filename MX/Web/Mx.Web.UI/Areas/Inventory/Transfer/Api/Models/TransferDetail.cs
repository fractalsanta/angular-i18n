using System;
using Mx.Inventory.Services.Contracts.Requests;
using Mx.Inventory.Services.Contracts.Responses;
using Mx.Services.Shared;
using Mx.Web.UI.Config.Mapping;
using AutoMapper;

namespace Mx.Web.UI.Areas.Inventory.Transfer.Api.Models
{
    [MapFrom(typeof(TransferDetailResponse))]
    public class TransferDetail : IConfigureAutoMapping
    {
        public Int64 Id { get; set; }
        public Int64 ItemId { get; set; }
        public String ItemCode { get; set; }
        public String Description { get; set; }
        public String Unit { get; set; }
        public Single Quantity { get; set; }
        public Decimal UnitCost { get; set; }
        public Double OnHand { get; set; }
        public Int64 VendorItemId { get; set; }
        public String TransferUnit1 { get; set; }
        public String TransferUnit2 { get; set; }
        public String TransferUnit3 { get; set; }
        public String TransferUnit4 { get; set; }
        public Single TransferQty1 { get; set; }
        public Single TransferQty2 { get; set; }
        public Single TransferQty3 { get; set; }
        public Single TransferQty4 { get; set; }
        public Single OriginalTransferQty1 { get; set; }
        public Single OriginalTransferQty2 { get; set; }
        public Single OriginalTransferQty3 { get; set; }
        public Single OriginalTransferQty4 { get; set; }
        public Decimal TransferCost { get; set; }
        public Single TransferQty { get; set; }
        public Decimal OriginalTransferQty { get; set; }

        public virtual String OuterUom { get; set; }
        public virtual String InnerUom { get; set; }
        public virtual String InventoryUnit { get; set; }
        public virtual String PurchaseUnit { get; set; }
        public virtual Boolean ZeroCostItem { get; set; }

        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<TransferDetailResponse, TransferDetail>()
                .ForMember(dest => dest.TransferUnit1, opt => opt.MapFrom(src => src.Unit1))
                .ForMember(dest => dest.TransferUnit2, opt => opt.MapFrom(src => src.Unit2))
                .ForMember(dest => dest.TransferUnit3, opt => opt.MapFrom(src => src.Unit3))
                .ForMember(dest => dest.TransferUnit4, opt => opt.MapFrom(src => src.Unit4))
                .ForMember(dest => dest.TransferQty1, opt => opt.MapFrom(src => src.Quantity1))
                .ForMember(dest => dest.TransferQty2, opt => opt.MapFrom(src => src.Quantity2))
                .ForMember(dest => dest.TransferQty3, opt => opt.MapFrom(src => src.Quantity3))
                .ForMember(dest => dest.TransferQty4, opt => opt.MapFrom(src => src.Quantity4))
                .ForMember(dest => dest.OriginalTransferQty1, opt => opt.MapFrom(src => src.OriginalQuantity1))
                .ForMember(dest => dest.OriginalTransferQty2, opt => opt.MapFrom(src => src.OriginalQuantity2))
                .ForMember(dest => dest.OriginalTransferQty3, opt => opt.MapFrom(src => src.OriginalQuantity3))
                .ForMember(dest => dest.OriginalTransferQty4, opt => opt.MapFrom(src => src.OriginalQuantity4))
                .ForMember(dest => dest.Quantity, opt => opt.MapFrom(src => src.TransferQty))
                .ForMember(dest => dest.OriginalTransferQty, opt => opt.MapFrom(src => src.RequestedQty));

            Mapper.CreateMap<TransferDetail, UpdateInventoryTransferRequestItem>()
                 .ForMember(dest => dest.TransferUnitCost, opt => opt.MapFrom(src => src.UnitCost));
        }
    }
}