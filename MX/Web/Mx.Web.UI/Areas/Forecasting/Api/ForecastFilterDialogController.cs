using AutoMapper;
using Mx.Forecasting.Services.Contracts.CommandServices;
using Mx.Forecasting.Services.Contracts.Exceptions;
using Mx.Forecasting.Services.Contracts.Requests;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Areas.Forecasting.Api.Models;
using Mx.Web.UI.Config.Translations;
using Mx.Web.UI.Config.WebApi;
using System.Net;
using System.Web.Http;

namespace Mx.Web.UI.Areas.Forecasting.Api
{
    [Permission(Task.Administration_Settings_ForecastFilter_CanAccess)]
    public class ForecastFilterDialogController : ApiController
    {
        private readonly IMappingEngine _mappingEngine;
        private readonly IForecastFilterCommandService _forecastFilterCommandService;
        private readonly ITranslationService _localisationQueryService;
        private readonly IAuthenticationService _authenticationService;

        public ForecastFilterDialogController(
            IMappingEngine mappingEngine,
            IForecastFilterCommandService forecastFilterCommandService,
            ITranslationService localisationQueryService,
            IAuthenticationService authenticationService)
        {
            _mappingEngine = mappingEngine;
            _forecastFilterCommandService = forecastFilterCommandService;
            _localisationQueryService = localisationQueryService;
            _authenticationService = authenticationService;
        }
        public void PostInsertOrUpdateForecastFilter([FromBody] ForecastFilterRecord forecastFilterRecord)
        {
            try
            {
                var forecastFilterRequest = _mappingEngine.Map<ForecastFilterRequest>(forecastFilterRecord);
                _forecastFilterCommandService.InsertOrUpdateForecastFilter(forecastFilterRequest);
            }
            catch (NonUniqueForecastFilterNameException)
            {
                var translations = _localisationQueryService.Translate<Models.Translations>(_authenticationService.User.Culture);

                throw new CustomErrorMessageException(HttpStatusCode.Conflict,
                    new ErrorMessage(translations.ForecastFilterNameIsNotUnique));
            }
        }
    }
}

