using System;
using AutoMapper;
using Mx.Inventory.Services.Contracts.Requests;
using Mx.Inventory.Services.Contracts.Responses;
using Mx.Services.Shared;

namespace Mx.Web.UI.Areas.Inventory.Count.Api.Models
{
    public class TravelPathItem : IConfigureAutoMapping
    {
        public Int64 Id { get; set; }
        public Int64 ItemId { get; set; }
        public String Description { get; set; }
        public string Code { get; set; }
        public Int32 TravelPath { get; set; }
        public String Frequency { get; set; }
        public String OuterUom { get; set; }
        public String InnerUom { get; set; }
        public String WeightUom { get; set; }
        public String InventoryUnitUom { get; set; }
        public Boolean DisableOuterUnit { get; set; }
        public Boolean DisableInnerUnit { get; set; }
        public Boolean DisableWeightUnit { get; set; }
        public Boolean DisableInventoryUnit { get; set; }
        
        public bool EnabledForSelection
        {
            get { return true; }
        }

        public bool IsSpotCounted {
            get
            {
                if (!string.IsNullOrWhiteSpace(Frequency))
                {
                    if (Frequency.Length == 5)
                    {
                        if (Frequency.Substring(0, 1) == "1") return true;
                    }
                }
                return false;
            }            
        }
        public bool IsDailyCounted
        {
            get
            {
                if (!string.IsNullOrWhiteSpace(Frequency))
                {
                    if (Frequency.Length == 5)
                    {
                        if (Frequency.Substring(1, 1) == "1") return true;
                    }
                }
                return false;
            }
        }
        public bool IsWeeklyCounted
        {
            get
            {
                if (!string.IsNullOrWhiteSpace(Frequency))
                {
                    if (Frequency.Length == 5)
                    {
                        if (Frequency.Substring(2, 1) == "1") return true;
                    }
                }
                return false;
            }
        }
        public bool IsPeriodicCounted
        {
            get
            {
                if (!string.IsNullOrWhiteSpace(Frequency))
                {
                    if (Frequency.Length == 5)
                    {
                        if (Frequency.Substring(3, 1) == "1") return true;
                    }
                }
                return false;
            }
        }
        public bool IsMonthlyCounted
        {
            get
            {
                if (!string.IsNullOrWhiteSpace(Frequency))
                {
                    if (Frequency.Length == 5)
                    {
                        if (Frequency.Substring(4, 1) == "1") return true;
                    }
                }
                return false;
            }
        }

        public bool IsOuterUomSet
        {
            get { return !string.IsNullOrWhiteSpace(OuterUom); }
        }

        public bool IsInnerUomSet
        {
            get { return !string.IsNullOrWhiteSpace(InnerUom); }
        }
        public bool IsWeightUomSet
        {
            get { return !string.IsNullOrWhiteSpace(WeightUom); }
        }

        public bool IsInventoryUnitUomSet
        {
            get { return !string.IsNullOrWhiteSpace(InventoryUnitUom); }
        }
 
        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<TravelPathItem, TravelPathItemRequest>();

            Mapper.CreateMap<EntityLocationItemResponse, TravelPathItem>()
                  .ForMember(x => x.Description, opt => opt.MapFrom(src => src.ItemDescription))
                  .ForMember(x => x.Code, ic => ic.MapFrom(src => src.ItemCode));
        }

    }
}