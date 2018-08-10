using System;
using System.Collections.Generic;

namespace Mx.Web.UI.Areas.Forecasting.Api.Services
{
    public interface IForecastRegenerator
    {
        void RegenerateForecast(long entityId, DateTime date, string failureMessage);

        void RegenerateForecasts(long entityId, List<DateTime> dates,
            string failureMessage);
    }
}
