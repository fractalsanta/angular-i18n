using System;
using AutoMapper;
using Mx.Inventory.Services.Contracts.Requests;
using Mx.Inventory.Services.Contracts.Responses;
using Mx.Services.Shared;

namespace Mx.Web.UI.Areas.Inventory.Count.Api.Models
{
    public class CountItem : IConfigureAutoMapping
    {
        public Int64 Id { get; set; }
        public Int64 ItemId { get; set; }
        public Int64 VendorItemId { get; set; }
        public String Description { get; set; }
        public String OuterUnit { get; set; }
        public Boolean DisableOuterUnit { get; set; }
        public String InnerUnit { get; set; }
        public Boolean DisableInnerUnit { get; set; }
        public String InventoryUnit { get; set; }
        public Boolean DisableInventoryUnit { get; set; }
        public String WeightUnit { get; set; }
        public Boolean DisableWeightUnit { get; set; }
        public Single? OuterCount { get; set; }
        public Single? InnerCount { get; set; }
        public Single? InventoryCount { get; set; }
        public Single? WeightCount { get; set; }
        public Boolean ReadyToApply { get; set; }
        public Int32 SortOrder { get; set; }
        public Int64 LocationId { get; set; }
        public String Location { get; set; }
        public Boolean HasVariance { get; set; }
        public Decimal VariancePercent { get; set; }
        public Decimal ItemCost { get; set; }
        public Boolean ZeroCostItem { get; set; }
        public String ProductCode { get; set; }
        public String CreateDate { get; set; }
        public String StocktakeGroup { get; set; }
        public CountStatus Status { get; set; }
        public String LastPurchaseDate { get; set; }

        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<CountItem, CountLocationItemResponse>();
            // The service layer populates CountLocationItemResponse with 0's for all counts, we need to strip these out with nulls when the ReadyToApply
            // is not set to true to both allow zero counts and to avoid complex client logic for 0 and no count checking 
            Mapper.CreateMap<CountLocationItemResponse, CountItem>()
                .ForMember(x => x.OuterCount,
                    opt =>
                        opt.MapFrom(src => !src.ReadyToApply && src.OuterCount <= 0 ? null : (Single?) src.OuterCount))
                .ForMember(x => x.InnerCount,
                    opt =>
                        opt.MapFrom(src => !src.ReadyToApply && src.InnerCount <= 0 ? null : (Single?) src.InnerCount))
                .ForMember(x => x.InventoryCount,
                    opt =>
                        opt.MapFrom(
                            src => !src.ReadyToApply && src.InventoryCount <= 0 ? null : (Single?) src.InventoryCount))
                .ForMember(x => x.WeightCount,
                    opt =>
                        opt.MapFrom(src => !src.ReadyToApply && src.WeightCount <= 0 ? null : (Single?) src.WeightCount))
                ;

            Mapper.CreateMap<VendorEntityItemResponse, CountItem>()
                .ForMember(x => x.VendorItemId, opt => opt.MapFrom(src => src.VendorEntityItemID))
                .ForMember(x => x.Description, opt => opt.MapFrom(src => src.VendorDescription))
                .ForMember(x => x.ProductCode, opt => opt.MapFrom(src => src.VendorCode))
                .ForMember(x => x.ItemId, opt => opt.MapFrom(src => src.ItemID));

            Mapper.CreateMap<CountItem, UpdateCountDetailRequest>()
                .ForMember(x => x.VendorEntityItemId, opt => opt.MapFrom(src => src.VendorItemId))
                .ForMember(x => x.ItemId, opt => opt.MapFrom(src => src.ItemId));

        }
    }
}