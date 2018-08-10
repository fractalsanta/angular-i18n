using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using AutoMapper;
using Mx.Inventory.Services.Contracts.QueryServices;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Inventory.Order.Api.Models;
using Mx.Web.UI.Config.Helpers;
using Mx.Web.UI.Config.WebApi;


namespace Mx.Web.UI.Areas.Inventory.Order.Api
{
    [Permission(Task.Inventory_Ordering_History_CanView)]
    public class OrderHistoryController : ApiController
    {
        private readonly IMappingEngine _mappingEngine;
        private readonly IOrderQueryService _orderQueryService;

        public OrderHistoryController(IMappingEngine mappingEngine, IOrderQueryService orderQueryService)
        {
            _mappingEngine = mappingEngine;
            _orderQueryService = orderQueryService;
        }

        public IEnumerable<OrderHeader> GetOrdersByRange(
            [FromUri] Int64 entityId,
            [FromUri] String fromDate,
            [FromUri] String toDate)
        {
            var startDate = fromDate.AsDateTime() ?? DateTime.Now.AddDays(-14);
            var endDate = toDate.AsDateTime() ?? DateTime.Now;

            var orders = _orderQueryService.GetOrdersHistoryReceivedAndCanceled(entityId, startDate.Date, endDate.Date);
            return _mappingEngine.Map<IEnumerable<OrderHeader>>(orders.OrderByDescending(x => x.OrderDate));
        }
    }
}