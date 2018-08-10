using System.Web.Http;
using AutoMapper;
using Mx.Inventory.Services.Contracts.CommandServices;
using Mx.Inventory.Services.Contracts.Requests;
using Mx.Web.UI.Areas.Inventory.Count.Api.Models;

namespace Mx.Web.UI.Areas.Inventory.Count.Api
{
    public class TravelPathItemController : ApiController
    {

        private readonly IInventoryCountCommandService _inventoryCountCommandService;

        public TravelPathItemController(IInventoryCountCommandService inventoryCountCommandService)
        {
            _inventoryCountCommandService = inventoryCountCommandService;
        }

        public void PostUpdateCount(
            [FromBody] TravelPathItemUpdate travelPathItemUpdate)
        {
            var request = Mapper.Map<UpdateInventoryCountRequest>(travelPathItemUpdate);
            // Check to if we need to update the Frequency or Disabled flags for Unit Of Measure.
            switch (request.UpdateMode)
            {
                case (int) TravelPathCountUpdateMode.Frequency:
                    _inventoryCountCommandService.UpdateInventoryCountFrequency(request);
                    break;
                case (int) TravelPathCountUpdateMode.UnitOfMeasure:
                    _inventoryCountCommandService.UpdateInventoryDisableStockCount(request);
                    break;
            }
        }
    }
}