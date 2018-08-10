using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using AutoMapper;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Inventory.Services.Contracts.QueryServices;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Inventory.Order.Api.Models;
using Mx.Web.UI.Config.WebApi;

namespace Mx.Web.UI.Areas.Inventory.Order.Api
{
    [Permission(Task.Inventory_Ordering_Place_CanView)]
    public class OverdueScheduledOrdersController : ApiController
    {
        private readonly IMappingEngine _mappingEngine;
        private readonly IOrderQueryService _orderQueryService;
        private readonly IEntityTimeQueryService _entityTimeQueryService;

        public OverdueScheduledOrdersController(
            IMappingEngine mappingEngine,
            IOrderQueryService orderQueryService,
            IEntityTimeQueryService entityTimeQueryService)
        {
            _mappingEngine = mappingEngine;
            _orderQueryService = orderQueryService;
            _entityTimeQueryService = entityTimeQueryService;
        }

        public IEnumerable<ScheduledOrderHeader> GetOverdueScheduledOrders(Int64 entityId)
        {
            var now = _entityTimeQueryService.GetCurrentStoreTime(entityId);
            var fromDate = now.Date.AddDays(-Models.Constants.OverdueScheduledOrdersNumDaysToShow);
            var toDate = now.Date.AddDays(1);
            var orders = _orderQueryService.GetOverdueScheduledOrdersByDateRange(entityId, fromDate, toDate);
            return _mappingEngine.Map<IEnumerable<ScheduledOrderHeader>>(orders).ToList();
        }
    }
}