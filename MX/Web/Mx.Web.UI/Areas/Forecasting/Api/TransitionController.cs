using System;
using System.Collections.Generic;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Forecasting.Services.Interfaces.Services;
using Mx.Foundation.Services.Contracts.QueryServices;
using Mx.Web.UI.Config.WebApi;

namespace Mx.Web.UI.Areas.Forecasting.Api
{
    public class TransitionController : RESTController
    {
        private readonly IForecastEventTransitioningService _forecastEventTransitioningService;
        private readonly IEntityTimeQueryService _entityTimeQueryService;
        private readonly IEntityQueryService _entityQueryService;

        public TransitionController(
            IUserAuthenticationQueryService userAuthenticationQueryService,
            IForecastEventTransitioningService forecastEventTransitioningService,
            IEntityQueryService entityQueryService,
            IEntityTimeQueryService entityTimeQueryService)
            : base(userAuthenticationQueryService)
        {
            _entityTimeQueryService = entityTimeQueryService;
            _forecastEventTransitioningService = forecastEventTransitioningService;
            _entityQueryService = entityQueryService;

        }

        // GET api/ForecastApi
        public bool GetTransition()
        {
            var error = false;
            foreach (var entityId in  _entityQueryService.GetOpenStores())
            {
                try
                {

                    var now = _entityTimeQueryService.GetCurrentStoreTime(entityId);
                    _forecastEventTransitioningService.UpdateEventProfileHistoryTransition(entityId, now.Date);
                }
                catch (Exception ex)
                {
                    Elmah.ErrorLog.GetDefault(null).Log(new Elmah.Error(ex));
                    error = true;
                }
            }
            return ! error;
        }
    }
}