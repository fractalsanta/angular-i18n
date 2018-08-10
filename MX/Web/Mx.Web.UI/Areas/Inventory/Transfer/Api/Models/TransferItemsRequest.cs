using System;
using System.Collections.Generic;
using Mx.Inventory.Services.Contracts.Responses;
using Mx.Web.UI.Areas.Inventory.Count.Api.Models;
using Mx.Web.UI.Config.Mapping;
using Mx.Web.UI.Areas.Inventory.Transfer.Api.Enums;
namespace Mx.Web.UI.Areas.Inventory.Transfer.Api.Models
{

    public class TransferItemsRequest
    {
        public TransferDirection Direction { get; set; }
        public List<TransferableItem> Items { get; set; }
        public List<UpdateCostViewModel> UpdateCosts { get; set; }
    }
}