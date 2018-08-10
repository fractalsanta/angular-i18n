using System;
using System.Collections.Generic;
using System.Web.Http;
using AutoMapper;
using Mx.Inventory.Services.Contracts.CommandServices;
using Mx.Inventory.Services.Contracts.Requests;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Inventory.Count.Api.Models;
using Mx.Web.UI.Config.WebApi;

namespace Mx.Web.UI.Areas.Inventory.Count.Api
{
    [Permission(Task.Inventory_InventoryCount_CanUpdate_Cost)]
    public class UpdateCostController : ApiController
    {
        private readonly IInventoryCountCommandService _inventoryCountCommandService;

        public UpdateCostController(IInventoryCountCommandService inventoryCountCommandService)
        {
            _inventoryCountCommandService = inventoryCountCommandService;
        }

        public void PostUpdateCost(
            [FromBody]IEnumerable<UpdateCostViewModel> updateCostItems,
            [FromUri] Int64 currentEntityId)
        {
            var request = new UpdateInventoryUnitCostRequest
            {
                EntityId = currentEntityId,
                Items = Mapper.Map<IEnumerable<UpdateInventoryUnitCostRequestItem>>(updateCostItems)
            };

            _inventoryCountCommandService.UpdateInventoryUnitCost(request);
        }
    }
}