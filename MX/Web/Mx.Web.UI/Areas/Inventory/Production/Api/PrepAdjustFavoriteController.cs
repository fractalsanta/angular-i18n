using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using AutoMapper;
using Mx.Inventory.Services.Contracts.CommandServices;
using Mx.Inventory.Services.Contracts.QueryServices;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Areas.Inventory.Production.Api.Models;
using Mx.Web.UI.Config.WebApi;

namespace Mx.Web.UI.Areas.Inventory.Production.Api
{
    [Permission(Task.Inventory_PrepAdjust_CanView)]
    public class PrepAdjustFavoriteController : ApiController
    {
        private readonly IPrepAdjustQueryService _prepAdjustQueryService;
        private readonly IPrepAdjustFavoriteCommandService _prepAdjustFavoriteCommandService;
        private readonly IAuthenticationService _authenticationService;
        private readonly IMappingEngine _mapper;

        public PrepAdjustFavoriteController(
            IPrepAdjustQueryService prepAdjustQueryService,
            IPrepAdjustFavoriteCommandService prepAdjustFavoriteCommandService,
            IAuthenticationService authenticationService,
            IMappingEngine mapper)
        {
            _prepAdjustQueryService = prepAdjustQueryService;
            _authenticationService = authenticationService;
            _prepAdjustFavoriteCommandService = prepAdjustFavoriteCommandService;
            _mapper = mapper;
        }

        public IEnumerable<PrepAdjustedItem> Get(Int32 entityId)
        {
            var items = _prepAdjustQueryService.GetPrepAdjustFavouritesItemsByEntity(entityId, null, 0, _authenticationService.UserId);
            var prepAdjustItems = _mapper.Map<IEnumerable<PrepAdjustedItem>>(items.PrepAdjustItemResponses);

            foreach (var prepItem in prepAdjustItems.ToList())
            {
                prepItem.IsFavorite = true;
            }

            return prepAdjustItems.ToList();
        }
        
        public void PostAddFavorite(
            [FromUri] Int32 entityId,
            [FromUri] Int64 itemId)
        {
            var userId = _authenticationService.UserId;
            _prepAdjustFavoriteCommandService.AddFavorite(userId, entityId, itemId);
        }

        public void DeleteFavorite(
            [FromUri] Int32 entityId,
            [FromUri] Int64 itemId)
        {
            var userId = _authenticationService.UserId;
            _prepAdjustFavoriteCommandService.DeleteFavorite(userId, entityId, itemId);
        }
    }
}