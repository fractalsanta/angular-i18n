using AutoMapper;
using Mx.Inventory.Services.Contracts.QueryServices;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Inventory.Production.Api.Models;
using Mx.Web.UI.Config.WebApi;
using System;
using System.Collections.Generic;
using System.Web.Http;

namespace Mx.Web.UI.Areas.Inventory.Production.Api
{
    [Permission(Task.Inventory_PrepAdjust_CanView)]
    public class PrepAdjustItemSearchController : ApiController
    {
        private readonly IPrepAdjustQueryService _prepAdjustQueryService;
        private readonly IMappingEngine _mappingEngine;

        public PrepAdjustItemSearchController(
            IPrepAdjustQueryService prepAdjustQueryService,
            IMappingEngine mappingEngine
            )
        {
            _prepAdjustQueryService = prepAdjustQueryService;
            _mappingEngine = mappingEngine;
        }

        public IEnumerable<PrepAdjustedItem> GetPrepAdjustItemsByEntityId([FromUri]Int64 entityId, [FromUri]String description, [FromUri]Int32 recordLimit)
        {
            var prepAdjustItemsResponse = _prepAdjustQueryService.GetPrepAdjustItemsByEntity(entityId, description, recordLimit);

            return _mappingEngine.Map<IEnumerable<PrepAdjustedItem>>(prepAdjustItemsResponse.PrepAdjustItemResponses);
        }
        
    }
}
