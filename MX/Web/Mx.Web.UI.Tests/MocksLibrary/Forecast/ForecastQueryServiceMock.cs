using System;
using Moq;
using Mx.Forecasting.Services.Contracts.QueryServices;

namespace Mx.Web.UI.Tests.MocksLibrary.Forecast
{
    internal class ForecastQueryServiceMock : Mock<IForecastQueryService>
    {
        public ForecastQueryServiceMock()
        {
            Setup(x => x.HasForecastByEntityIdByBusinessDay(It.IsAny<Int64>(), It.IsAny<DateTime>())).Returns(false);
        }
    }
}
