using System;
using System.Web.Http;
using Mx.Forecasting.Services.Contracts.CommandServices;
using Mx.Foundation.Services.Contracts.QueryServices;
using Mx.Web.UI.Areas.Forecasting.Api.Models;
using Mx.Web.UI.Config.WebApi;

namespace Mx.Web.UI.Areas.Forecasting.Api
{
    public class MirroringRegenerationController : RESTController
	{
        private readonly IMirroringForecastCommandService _mirroringForecastCommandService;

        public MirroringRegenerationController(
            IMirroringForecastCommandService mirroringForecastCommandService,
            IUserAuthenticationQueryService userAuthenticationQueryService
            )
            : base(userAuthenticationQueryService)
        {
            _mirroringForecastCommandService = mirroringForecastCommandService;
        }

        public void Post(Int64 entityId, [FromBody] MirroringRegenerationRequest request)
        {
            _mirroringForecastCommandService.UpdateMirroringForecast(request.SourceDate);
        }
	}
}
