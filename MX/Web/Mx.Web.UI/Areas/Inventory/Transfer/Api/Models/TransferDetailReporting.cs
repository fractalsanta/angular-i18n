using AutoMapper;
using Mx.Inventory.Services.Contracts.Responses;
using Mx.Services.Shared;
using Mx.Web.UI.Config.Mapping;
using System;

namespace Mx.Web.UI.Areas.Inventory.Transfer.Api.Models
{
    [MapFrom(typeof(TransferDetailReportingResponse))]
    public class TransferDetailReporting : IConfigureAutoMapping
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
        public String ReportingUom { get; set; }
        public Double ReportingRequested { get; set; }
        public Double ReportingTransferred { get; set; }
        public Double ReportingOnHand { get; set; }
        public Decimal ReportingUnitCost { get; set; }
        public Single TransferQty { get; set; }
        public Decimal OriginalTransferQty { get; set; }

        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<TransferDetailReportingResponse, TransferDetailReporting>()
                .ForMember(x => x.TransferQty1, opt => opt.MapFrom(src => src.Quantity1))
                .ForMember(x => x.TransferQty2, opt => opt.MapFrom(src => src.Quantity2))
                .ForMember(x => x.TransferQty3, opt => opt.MapFrom(src => src.Quantity3))
                .ForMember(x => x.TransferQty4, opt => opt.MapFrom(src => src.Quantity4))
                .ForMember(x => x.OriginalTransferQty1, opt => opt.MapFrom(src => src.OriginalQuantity1))
                .ForMember(x => x.OriginalTransferQty2, opt => opt.MapFrom(src => src.OriginalQuantity2))
                .ForMember(x => x.OriginalTransferQty3, opt => opt.MapFrom(src => src.OriginalQuantity3))
                .ForMember(x => x.OriginalTransferQty4, opt => opt.MapFrom(src => src.OriginalQuantity4))
                .ForMember(x => x.TransferUnit1, opt => opt.MapFrom(src => src.Unit1))
                .ForMember(x => x.TransferUnit2, opt => opt.MapFrom(src => src.Unit2))
                .ForMember(x => x.TransferUnit3, opt => opt.MapFrom(src => src.Unit3))
                .ForMember(x => x.TransferUnit4, opt => opt.MapFrom(src => src.Unit4))
                .ForMember(x => x.Quantity, opt => opt.MapFrom(src => src.TransferQty))
                .ForMember(dest => dest.OriginalTransferQty, opt => opt.MapFrom(src => src.RequestedQty));
        }
    }
}