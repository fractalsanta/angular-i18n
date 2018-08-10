using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using AutoMapper;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Forecasting.Services.Contracts.QueryServices;
using Mx.Foundation.Services.Contracts.QueryServices;
using Mx.Web.UI.Areas.Forecasting.Api.Models;
using Mx.Web.UI.Config.WebApi;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Config.Helpers;

namespace Mx.Web.UI.Areas.Forecasting.Api
{
    public class FutureOrderController : RESTController
    {
        private readonly IMappingEngine _mappingEngine;
        private readonly IFutureOrderQueryService _futureOrderQueryService;

        public FutureOrderController(IMappingEngine mappingEngine,
            IFutureOrderQueryService futureOrderQueryService,
            IUserAuthenticationQueryService userAuthenticationQueryService)
            : base(userAuthenticationQueryService)
        {
            _mappingEngine = mappingEngine;
            _futureOrderQueryService = futureOrderQueryService;
        }

        // GET api/Entity/{entityid}/AllFutureOrdersForEntity
        public IEnumerable<FutureOrder> GetAllFutureOrdersForEntity(
            [FromUri] Int64 entityId
            )
        {
            var futureOrders = _futureOrderQueryService.GetAllFutureOrdersByEntity(entityId);

            return _mappingEngine.Map<IEnumerable<FutureOrder>>(futureOrders);
        }

        // GET api/Entity/{entityid}/FutureOrder/FutureOrdersByStatusDateRange?{startDate}&{endDate}&{statusIds}
        public IEnumerable<FutureOrder> GetFutureOrdersByStatusDateRange(
            [FromUri] Int64 entityId,
            [FromUri] String startDate,
            [FromUri] String endDate,
            [FromUri] String statusIds
            )
        {

            var fromDate = startDate.AsDateTime() ?? DateTime.Today;
            var toDate = endDate.AsDateTime() ?? DateTime.Today;

            var status = statusIds.Split(',').Select(Int32.Parse).ToArray();

            var futureOrders = _futureOrderQueryService.GetFutureOrdersByStatusIdsAndDateRange(entityId, fromDate, toDate, status);

            return _mappingEngine.Map<IEnumerable<FutureOrder>>(futureOrders);

        }

        // GET api/Entity/{entityid}/FutureOrder/FutureOrdersForDateRange?{startDate}&{endDate}
        public IEnumerable<FutureOrder> GetFutureOrdersForDateRange(
            [FromUri] Int64 entityId,
            [FromUri] String startDate,
            [FromUri] String endDate
            )
        {
            var fromDate = startDate.AsDateTime() ?? DateTime.Today;
            var toDate = endDate.AsDateTime() ?? DateTime.Today;

            var futureOrders = _futureOrderQueryService.GetFutureOrdersForBusinessDayRange(entityId, fromDate, toDate);

            return _mappingEngine.Map<IEnumerable<FutureOrder>>(futureOrders);
        }

        // GET api/Entity/{entityid}/FutureOrder/FutureOrdersForBusinessDay?{promisedDay}
        public IEnumerable<FutureOrder> GetFutureOrdersForBusinessDay(
            [FromUri] Int64 entityId,
            [FromUri] String businessDay
            )
        {
            var targetDate = businessDay.AsDateTime() ?? DateTime.Today;

            var futureOrders = _futureOrderQueryService.GetFutureOrdersForBusinessDay(entityId, targetDate);

            return _mappingEngine.Map<IEnumerable<FutureOrder>>(futureOrders);
        }
    }
}