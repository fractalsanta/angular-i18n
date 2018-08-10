using System;
using System.Collections.Generic;
using System.Web.Http;
using AutoMapper;
using Mx.Inventory.Services.Contracts.QueryServices;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Inventory.Order.Api.Models;
using Mx.Web.UI.Config.WebApi;

namespace Mx.Web.UI.Areas.Inventory.Order.Api
{
    [Permission(Task.Inventory_Ordering_Place_CanView)]
    public class OrderAddItemsController : ApiController
    {
        private readonly IMappingEngine _mappingEngine;
        private readonly IVendorEntityItemQueryService _vendorItemQueryService;

        public OrderAddItemsController(
            IMappingEngine mappingEngine,
            IVendorEntityItemQueryService vendorItemQueryService)
        {
            _mappingEngine = mappingEngine;
            _vendorItemQueryService = vendorItemQueryService;

        }

        public IEnumerable<OrderDetail> GetVendorItems(
            [FromUri] Int64 entityId,
            [FromUri] Int64 vendorId,
            [FromUri] String searchText)
        {
            var vendorItems = _vendorItemQueryService.SearchVendorEntityItems(entityId, vendorId, searchText);
            return _mappingEngine.Map<IEnumerable<OrderDetail>>(vendorItems);

        }
    }

}