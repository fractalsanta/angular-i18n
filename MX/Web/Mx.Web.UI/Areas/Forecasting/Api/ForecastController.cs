using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web.Http;
using AutoMapper;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Forecasting.Services.Contracts.CommandServices;
using Mx.Forecasting.Services.Contracts.QueryServices;
using Mx.Forecasting.Services.Contracts.Responses;
using Mx.Foundation.Services.Contracts.QueryServices;
using Mx.Services.Shared.Exceptions;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Areas.Forecasting.Api.Models;
using Mx.Web.UI.Config.WebApi;
using EntityResponseFromAdminService = Mx.Administration.Services.Contracts.Responses.EntityResponse;

namespace Mx.Web.UI.Areas.Forecasting.Api
{
    public class ForecastController : ForecastControllerBase
    {
        private readonly IMappingEngine _mappingEngine;
        private readonly IForecastQueryService _forecastQueryService;
        private readonly IForecastCommandService _forecastCommandService;
        private readonly IEntityQueryService _entityQueryService;
        
        public ForecastController(IMappingEngine mappingEngine,
            IForecastQueryService forecastQueryService,
            IForecastCommandService forecastCommandService,
            IEntityQueryService entityQueryService,
            IUserAuthenticationQueryService userAuthenticationQueryService,
            IAuthorizationService authorizationService,
            IAuthenticationService authenticationService)
            : base(userAuthenticationQueryService, authorizationService, authenticationService)
        {
            _mappingEngine = mappingEngine;
            _forecastQueryService = forecastQueryService;
            _forecastCommandService = forecastCommandService;
            _entityQueryService = entityQueryService;
        }

        // GET api/Entity/{entityid}/Forecast/{id}
        public Forecast GetForecastById(
            [FromUri] Int64 entityId,
            [FromUri] Int64 id,
            [FromUri] Int32? filterId = null)
        {
            EnsureCanViewForecast();

            var entity = EnsureResource("Entity", _entityQueryService.GetById(entityId));
            var forecast = EnsureResource("Forecast", _forecastQueryService.GetById(id, filterId));

            forecast.IsDayLocked = IsDayLocked(entity.CurrentStoreTime.Date, forecast.BusinessDay);

            if (forecast == null || forecast.EntityId != entityId)
            {
                throw new MissingResourceException("Forecast not found");
            }
            
            return _mappingEngine.Map<Forecast>(forecast);
        }

        // GET api/Entity/{entityid}/Forecast/{id}
        public Forecast GetForecastForBusinessDay(
            [FromUri] Int64 entityId,
            [FromUri] String businessDay)
        {
            EnsureCanViewForecast();

            var entity = EnsureResource("Entity", _entityQueryService.GetById(entityId));

            DateTime targetDate;
            if (!DateTime.TryParse(businessDay, out targetDate))
            {
                throw new InvalidQueryParameterException("Date format invalid.");
            }

            var forecast = GetForecastForBusinessDayResponse(entity, targetDate);

            return _mappingEngine.Map<Forecast>(forecast);
        }

        private ForecastResponse GetForecastForBusinessDayResponse(EntityResponseFromAdminService entity, DateTime targetDate)
        {
            var forecast = _forecastQueryService.GetForecastsForBusinessDay(entity.Id, targetDate)
                .OrderByDescending(x => x.GenerationDate).FirstOrDefault();

            if (forecast == null)
                return new ForecastResponse();

            forecast.IsDayLocked = IsDayLocked(entity.CurrentStoreTime.Date, forecast.BusinessDay);

            return forecast;
        }

        public IEnumerable<Forecast> GetForecastsForBusinessDateRange(
            [FromUri] Int64 entityId,
            [FromUri] String startDate,
            [FromUri] String endDate)
        {
            EnsureCanViewForecast();

            var entity = EnsureResource("Entity", _entityQueryService.GetById(entityId));

            DateTime startDateTime, endDatetime;
            if (!DateTime.TryParse(startDate, out startDateTime) || !DateTime.TryParse(endDate, out endDatetime))
            {
                throw new InvalidQueryParameterException("Date format invalid.");
            }

            var forecasts = _forecastQueryService.GetMostRecentGeneratedForecastsForBusinessDayRange(entityId, startDateTime, endDatetime);

            foreach (var forecast in forecasts)
            {
                forecast.IsDayLocked = IsDayLocked(entity.CurrentStoreTime.Date, forecast.BusinessDay);              
            }
            return _mappingEngine.Map<IEnumerable<Forecast>>(forecasts);
        }

        // GET api/ForecastApi
        public IEnumerable<Forecast> GetForecasts(
            [FromUri] Int64 entityId)
        {
            EnsureCanViewForecast();

            EnsureResource("Entity", _entityQueryService.GetById(entityId));

            var forecasts = _forecastQueryService.GetGeneratedForecasts(entityId);

            return _mappingEngine.Map<IEnumerable<Forecast>>(forecasts);
        }

        [Permission(Task.Forecasting_CanEdit)]
        public Int64 PatchRevertForecast(
           [FromUri] Int64 entityId,
           [FromUri] Int64 forecastId,
           [FromBody]ForecastOperationCollection opcollection)
        {
            if (opcollection.Operations == null)
                return opcollection.Version;

            var entity = EnsureResource("Entity", _entityQueryService.GetById(entityId));
            var forecast = EnsureResource("Forecast", _forecastQueryService.GetById(forecastId));

            if (IsDayLocked(entity.CurrentStoreTime.Date, forecast.BusinessDay))
            {
                throw new HttpResponseException(HttpStatusCode.Forbidden);
            }

            foreach (var op in opcollection.Operations)
            {
                switch (op.OpCode)
                {
                    case "revert":
                        {
                            var result = _forecastCommandService.RevertForecast(entityId, forecastId, opcollection.Version);
                            if (result == opcollection.Version)
                            {
                                throw new HttpResponseException(HttpStatusCode.Conflict);
                            }
                            return result;
                        }

                    default:
                        throw new InvalidOperationException();
                }
            }

            return opcollection.Version;
        }
    }
}