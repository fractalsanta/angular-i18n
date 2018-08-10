using System;
using AutoMapper;
using Mx.Inventory.Services.Contracts.Requests;
using Mx.Services.Shared;
using Mx.Web.UI.Areas.Core.Api.Models;

namespace Mx.Web.UI.Areas.Inventory.Count.Api.Models
{
    public class UpdateCostViewModel : IConfigureAutoMapping

    {
        public Int64 ItemId { get; set; }
        public Decimal InventoryUnitCost { get; set; }
        public String ReportingUnit { get; set; }
        public String InventoryUnit { get; set; }

        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<UpdateCostViewModel, UpdateInventoryUnitCostRequestItem>();
        }
    }
}
