using System;
using System.Linq;
using System.Collections.Generic;
using Mx.Forecasting.Services.Contracts.QueryServices;
using Mx.Forecasting.Services.Contracts.Responses;
using Mx.Foundation.Services.Contracts.QueryServices;
using Mx.Web.UI.Config.WebApi;
using Mx.Web.UI.Areas.Forecasting.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Models;

namespace Mx.Web.UI.Areas.Forecasting.Api
{
	public class ForecastSalesItemEvaluationController : RESTController
	{
        private readonly IForecastEvaluatorQueryService _forecastEvaluatorQueryService;

        public ForecastSalesItemEvaluationController(
            IUserAuthenticationQueryService userAuthenticationQueryService,
            IForecastEvaluatorQueryService forecastEvaluatorQueryService)
            : base(userAuthenticationQueryService)
        {
            _forecastEvaluatorQueryService = forecastEvaluatorQueryService;
        }

        public IEnumerable<DenormalizedSalesItemEvaluationResponse> Get(Int64 entityId, Int64 salesItemId, DateTime date, Int32? filterId = null)
        {
            var normalized = _forecastEvaluatorQueryService.EvaluateSalesItem(entityId, salesItemId, date, filterId);
            var denormalized = new List<DenormalizedSalesItemEvaluationResponse>();
            foreach (var segment in normalized.GroupBy(x => x.DaySegmentId))
            {
                var d = new DenormalizedSalesItemEvaluationResponse();
                d.DaySegmentId = segment.Key;
                d.DaySegmentDescription = segment.Select(x => x.DaySegmentDescription).First();
                d.Denormalize(segment);
                d.EnsureListsExist();
                denormalized.Add(d);
            }
            return denormalized;
        }
	}
}