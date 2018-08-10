using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using AutoMapper;
using Mx.Inventory.Services.Contracts.CommandServices;
using Mx.Inventory.Services.Contracts.QueryServices;
using Mx.Services.Shared.ExtensionMethods;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Areas.Inventory.Waste.Api.Models;
using Mx.Web.UI.Config.WebApi;

namespace Mx.Web.UI.Areas.Inventory.Waste.Api
{
    [Permission(Task.Inventory_Waste_CanView)]
    public class WasteFavoriteController : ApiController
    {

        private readonly IWasteListQueryService _wasteListQueryService;
        private readonly IWasteFavoriteCommandService _wasteFavoriteCommandService;
        private readonly IAuthenticationService _authenticationService;
        private readonly IMappingEngine _mapper;

        public WasteFavoriteController(
            IWasteListQueryService wasteListQueryService,
            IWasteFavoriteCommandService wasteFavoriteCommandService,
            IAuthenticationService authenticationService,
            IMappingEngine mapper)
        {
            _wasteListQueryService = wasteListQueryService;
            _wasteFavoriteCommandService = wasteFavoriteCommandService;
            _authenticationService = authenticationService;
            _mapper = mapper;
        }

        public IEnumerable<WastedItemCount> Get(Int32 entityId)
        {
            var userId = _authenticationService.UserId;
            var items = _wasteListQueryService.GetWasteFavoritesByEntityForUser(entityId, userId);
            var wasteItems = _mapper.Map<WasteItems>(items);

            foreach (var inventoryItem in wasteItems.InventoryItems)
            {
                inventoryItem.IsFavorite = true;
                inventoryItem.IsRaw = true;
            }

            foreach (var salesItem in wasteItems.SalesItems)
            {
                salesItem.IsFavorite = true;
            }

            return wasteItems.InventoryItems.Concat(wasteItems.SalesItems);
        }

        public void PostAdd(
            [FromUri] Int32 entityId,
            [FromUri] Int64 itemId,
            [FromUri] Boolean isInventoryItem)
        {
            var userId = _authenticationService.UserId;
            _wasteFavoriteCommandService.AddFavorite(userId, entityId, itemId, isInventoryItem);
        }

        public void Delete(
            [FromUri] Int32 entityId,
            [FromUri] Int64 itemId,
            [FromUri] Boolean isInventoryItem)
        {
            var userId = _authenticationService.UserId;
            _wasteFavoriteCommandService.DeleteFavorite(userId, entityId, itemId, isInventoryItem);
        }
    }
}