using System;
using System.Collections.Generic;
using Elmah;
using Mx.Forecasting.Services.Interfaces.Services;

namespace Mx.Web.UI.Areas.Forecasting.Api.Services
{
    public class ForecastRegenerator : IForecastRegenerator
    {
        private readonly IForecastMessagingService _forecastMessagingService;

        public ForecastRegenerator(
            IForecastMessagingService forecastMessagingService
            )
        {
            _forecastMessagingService = forecastMessagingService;
        }

        public void RegenerateForecasts(long entityId, List<DateTime> dates, string failureMessage)
        {
            try
            {
                _forecastMessagingService.CreateForecastGenerationLogForEntitiesMessage(new List<long> { entityId }, dates, null,
                    true);
            }
            catch (Exception ex)
            {
                ErrorLog.GetDefault(null).Log(new Error(ex));
                ApplicationHub.ForecastGenerationFailed(entityId, failureMessage);
            }
        }

        public void RegenerateForecast(long entityId, DateTime date, string failureMessage)
        {
            try
            {
                _forecastMessagingService.CreateForecastGenerationLogForEntitiesMessage(new List<long> { entityId },
                    new List<DateTime> { date }, null, true);
            }
            catch (Exception ex)
            {
                ErrorLog.GetDefault(null).Log(new Error(ex));
                ApplicationHub.ForecastGenerationFailed(entityId, string.Format("{0} {1}", failureMessage, date.ToShortDateString()));
            }
        }
    }
}