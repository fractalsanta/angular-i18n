using System;
using System.Collections.Generic;
using System.Net;
using System.Web.Http;
using Mx.Forecasting.Services.Contracts.QueryServices;
using Mx.Foundation.Services.Contracts.QueryServices;
using Mx.Web.UI.Areas.Forecasting.Api.Models;
using Mx.Web.UI.Config.WebApi;
using Mx.Web.UI.Areas.Core.Api.Models;
using System.Linq;
using Mx.Web.UI.Areas.Core.Api.Services;

namespace Mx.Web.UI.Areas.Forecasting.Api
{
    public class ForecastTransactionEvaluationController : RESTController
    {
        private readonly IForecastEvaluatorQueryService _forecastEvaluatorQueryService;
        private readonly IAuthorizationService _authorizationService;
        private readonly IAuthenticationService _authenticationService;

        public ForecastTransactionEvaluationController(
            IUserAuthenticationQueryService userAuthenticationQueryService,
            IForecastEvaluatorQueryService forecastEvaluatorQueryService,
            IAuthorizationService authorizationService,
            IAuthenticationService authenticationService)
            : base(userAuthenticationQueryService)
        {
            _forecastEvaluatorQueryService = forecastEvaluatorQueryService;
            _authorizationService = authorizationService;
            _authenticationService = authenticationService;
        }

        public IEnumerable<DenormalizedTransactionEvaluationResponse> GetEvaluateTransactions(
            [FromUri] Int64 entityId,
            [FromUri] DateTime date,
            [FromUri] Int32? filterId = null
            )
        {
            if (_authenticationService.User != null)
            {
                if (!_authorizationService.HasAuthorization(Task.Forecasting_CanView))
                {
                    throw new HttpResponseException(HttpStatusCode.Forbidden);
                }
            }
            var normalized = _forecastEvaluatorQueryService.EvaluateTransactions(entityId, date, filterId);
            var denormalized = new List<DenormalizedTransactionEvaluationResponse>();
            foreach (var segment in normalized.GroupBy(x => x.DaySegmentId))
            {
                var d = new DenormalizedTransactionEvaluationResponse();
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