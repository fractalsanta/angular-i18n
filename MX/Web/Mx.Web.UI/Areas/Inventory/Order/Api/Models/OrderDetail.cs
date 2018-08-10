using System;
using System.Threading;
using AutoMapper;
using Mx.Inventory.Services.Contracts.Responses;
using Mx.Services.Shared;

namespace Mx.Web.UI.Areas.Inventory.Order.Api.Models
{
    public class OrderDetail : IConfigureAutoMapping
    {
        public Int64 Id { get; set; }
        public Int64 SupplyOrderDetailId { get; set; }
        public Int64 VendorEntityItemId { get; set; }
        public String ItemCode { get; set; }
        public String VendorCode { get; set; }
        public String Description { get; set; }
        public String UnitCode { get; set; }
        public Decimal? UnitPrice { get; set; }
        public Decimal? ExtendedAmount { get; set; }
        public Int64? ItemId { get; set; }
        public Int64? CategoryId { get; set; }
        public String CategoryName { get; set; }
        public Double? PurchaseUnitQuantity { get; set; }
        public String TaxableFlag { get; set; }
        public Int64 MinOrderQty { get; set; }
        public Int64 MaxOrderQty { get; set; }
        public Double BuildToLevelQty { get; set; }
        public Double Usage { get; set; }
        public Int64 OnOrderQuantity { get; set; }
        public Double OnHandQuantity { get; set; }
        public Int64 LastOrderQuantity { get; set; }
        public Double UsageExtended { get; set; }
        public String UsageExtendedDisplay { get; set; }
        public Double ConversionRate { get; set; } 

        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<TransactionSalesOrderDetailResponse, OrderDetail>()
                .ForMember(dest => dest.TaxableFlag, opt => opt.MapFrom(src => src.TaxableFlag == 1 ? "Yes" : "No"))
                .ForMember(dest => dest.BuildToLevelQty, opt => opt.MapFrom(src => Math.Round(src.BuildToLevelQty, 2)))
                .ForMember(dest => dest.Usage, opt => opt.MapFrom(src => Math.Round(src.Usage, 2)))
                .ForMember(dest => dest.MaxOrderQty, opt => opt.MapFrom(src => (Int64)Math.Round(src.MaxOrderQty.GetValueOrDefault(), 0)))
                .ForMember(dest => dest.MinOrderQty, opt => opt.MapFrom(src => (Int64)Math.Round(src.MinOrderQty.GetValueOrDefault(), 0)))
                .ForMember(dest => dest.OnHandQuantity, opt => opt.MapFrom(src => (Double)Math.Round(src.OnHandQuantity.GetValueOrDefault(), 2)))
                .ForMember(dest => dest.UsageExtendedDisplay, opt => opt.MapFrom(src => String.Format(Thread.CurrentThread.CurrentCulture, "{0:c}", src.UsageExtended)));


            Mapper.CreateMap<VendorEntityItemResponse, OrderDetail>()
                .ForMember(dest => dest.TaxableFlag, opt => opt.MapFrom(src => src.TaxableFlag == 1 ? "Yes" : "No"))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.VendorDescription))
                .ForMember(dest => dest.UnitPrice, opt => opt.MapFrom(src => src.PurchasePrice))
                .ForMember(dest => dest.ItemCode, opt => opt.MapFrom(src => src.ItemCode))     
                .ForMember(dest => dest.MaxOrderQty, opt => opt.MapFrom(src => (Int64)Math.Round(src.MaxOrderQty.GetValueOrDefault(), 0)))
                .ForMember(dest => dest.MinOrderQty, opt => opt.MapFrom(src => (Int64)Math.Round(src.MinOrderQty.GetValueOrDefault(), 0)));


        }
    }
}