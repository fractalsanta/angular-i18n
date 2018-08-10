using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using AutoMapper;
using Mx.Inventory.Services.Contracts.QueryServices;
using Mx.Web.UI.Areas.Inventory.Count.Api.Models;

namespace Mx.Web.UI.Areas.Inventory.Count.Api
{
    public class TravelPathAddItemsController : ApiController
    {
        private readonly IInventoryQueryService _inventoryQueryService;

        public TravelPathAddItemsController(IInventoryQueryService inventoryQueryService)
        {
            _inventoryQueryService = inventoryQueryService;
        }
        public IEnumerable<InventoryCountLocationItem> GetSearchItemsLimited([FromUri] String searchCriteria, [FromUri] Int64 currentEntityId)
        {
            const int limit = 100;
            var tempResult =
                _inventoryQueryService.SearchItemsForStockCount(currentEntityId, searchCriteria, limit)
                    .OrderBy(x => x.Description, StringComparer.OrdinalIgnoreCase)
                    .ThenBy(x => x.Code, StringComparer.OrdinalIgnoreCase);

            var result = Mapper.Map<IEnumerable<InventoryCountLocationItem>>(tempResult);
            return result;
        }
    }
}