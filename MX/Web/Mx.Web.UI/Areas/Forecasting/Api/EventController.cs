using System;
using System.Collections.Generic;
using System.Data.SqlTypes;
using System.Linq;
using System.Net;
using System.Web.Http;
using AutoMapper;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Administration.Services.Contracts.Requests;
using Mx.Administration.Services.Contracts.Responses;
using Mx.Forecasting.Services.Contracts.CommandServices;
using Mx.Forecasting.Services.Contracts.QueryServices;
using Mx.Forecasting.Services.Contracts.Requests;
using Mx.Foundation.Services.Contracts.QueryServices;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Forecasting.Api.Models;
using Mx.Web.UI.Areas.Forecasting.Api.Services;
using Mx.Web.UI.Config.Translations;
using Mx.Web.UI.Config.WebApi;
using Mx.Web.UI.Areas.Core.Api.Services;

namespace Mx.Web.UI.Areas.Forecasting.Api
{
    public class EventController : RESTController
    {
        private readonly IMappingEngine _mappingEngine;
        private readonly IEventProfileQueryService _eventProfileQueryService;
        private readonly IEventProfileCommandService _eventProfileCommandService;
        private readonly IAuthenticationService _authenticationService;
        private readonly IAuthorizationService _authorizationService;
        private readonly IEventProfileTagQueryService _eventProfileTagQueryService;
        private readonly IForecastRegenerator _forecastReGenerator;
        private readonly IForecastQueryService _forecastQueryService;
        private readonly ITranslationService _translationService;
        private readonly IMxDayQueryService _mxDayQueryService;

        public EventController(IMappingEngine mappingEngine,
            IUserAuthenticationQueryService userAuthenticationQueryService,
            IEventProfileQueryService eventProfileQueryService,
            IEventProfileCommandService eventProfileCommandService,
            IAuthorizationService authorizationService,
            IAuthenticationService authenticationService,
            IEventProfileTagQueryService eventProfileTagQueryService,
            IForecastRegenerator forecastReGenerator,
            IForecastQueryService forecastQueryService,
            ITranslationService translationService,
            IMxDayQueryService mxDayQueryService)
            : base(userAuthenticationQueryService)
        {
            _mappingEngine = mappingEngine;
            _eventProfileQueryService = eventProfileQueryService;
            _eventProfileCommandService = eventProfileCommandService;
            _authorizationService = authorizationService;
            _authenticationService = authenticationService;
            _eventProfileTagQueryService = eventProfileTagQueryService;
            _forecastReGenerator = forecastReGenerator;
            _translationService = translationService;
            _mxDayQueryService = mxDayQueryService;
            _forecastQueryService = forecastQueryService;
        }

        // GET api/ForecastApi
        public IEnumerable<EventProfile> GetEventProfiles(Int64 entityId)
        {
            CanViewForecastEvents();

            var eventProfileResponses = _eventProfileQueryService.GetByEntityId(entityId);

            var eventProfiles = _mappingEngine.Map<IEnumerable<EventProfile>>(eventProfileResponses);

            return eventProfiles;
        }

        [Permission(Task.Forecasting_Event_CanView)]
        public Boolean GetProfileNameExistsForEntity(Int64 entityId, String profileName)
        {
            var eventProfileNameExists = _eventProfileQueryService.GetProfileNameExistsForEntity(entityId, profileName);

            return eventProfileNameExists;
        }

        // POST api/ForecastApi
        [Permission(Task.Forecasting_Event_CanView)]
        public void PostEventProfile([FromBody] EventProfile eventProfile,  Int64 entityId)
        {
            var user = _authenticationService.User;
            var entityMxDay = _mxDayQueryService.GetForTradingDate(new MxDayRequest { EntityId = entityId });

            var adjustments = GetEventProfileAdjustmentRequests(eventProfile.Adjustments, entityMxDay);
            var history = GetEventProfileHistoryRequests(eventProfile.History);
            var l10N = _translationService.Translate<Models.Translations>(user.Culture);

            _eventProfileCommandService.InsertOrUpdateEventProfile(new EventProfileRequest()
            {
                Id = eventProfile.Id,
                EntityId = eventProfile.EntityId,
                Name = eventProfile.Name,
                Source = (Mx.Forecasting.Services.Contracts.EventProfileSource) eventProfile.Source,
                Adjustments = adjustments,
                History = history
            });

            var eventProfileTags = _eventProfileTagQueryService.GetByEventProfileId(eventProfile.Id).ToList();
            var entityCalendarDate =
                _mxDayQueryService.GetForTradingDate(new MxDayRequest {EntityId = entityId}).CalendarDay;

            if (eventProfileTags.Any(x => x.Date >= entityCalendarDate))
            {
                var dates = eventProfileTags.Where(x => x.Date >= entityCalendarDate).Select(x => x.Date.Date).ToList();
                var datesToRegenerateForecast = new List<DateTime>();

                dates.ForEach(d =>
                {
                    if (_forecastQueryService.HasForecastByEntityIdByBusinessDay(entityId, d.Date))
                    {
                        datesToRegenerateForecast.Add(d);
                    }
                });

                if (datesToRegenerateForecast.Any())
                {
                    _forecastReGenerator.RegenerateForecasts(entityId,
                        datesToRegenerateForecast,
                        l10N.ForecastGenerationFailed
                        );
                }
            }
        }

        private IEnumerable<EventProfileHistoryRequest> GetEventProfileHistoryRequests(IEnumerable<EventProfileHistory> history)
        {
            if (history == null)
                return null;

            var requests = from h in history
                           select new EventProfileHistoryRequest()
                           {
                               Date = h.Date,
                               Note = h.Note,
                           };
            return requests;
        }

        private IEnumerable<EventAdjustmentRequest> GetEventProfileAdjustmentRequests(IEnumerable<Double> adjustments, MxDayResponse entityMxDay)
        {
            if (adjustments == null)
                return null;

            var businessDayStartMinutes = (entityMxDay.DayOpen - entityMxDay.DayOpen.Date).TotalMinutes;            

            var requests = adjustments.Select((a, ix) => new EventAdjustmentRequest()
            {
                IntervalStart = ((DateTime)(SqlDateTime.MinValue)).AddMinutes(businessDayStartMinutes).AddMinutes(15 * ix),
                Adjustment = a,
            });
            return requests;
        }

        // DELETE api/ForecastApi
        [Permission(Task.Forecasting_Event_CanView)]
        public void DeleteEventProfile(Int64 eventProfileId)
        {
            _eventProfileCommandService.DeleteEventProfile(eventProfileId);
        }

        private void CanViewForecastEvents()
        {
            if (_authenticationService.User != null)
            {
                if (!(_authorizationService.HasAuthorization(Task.Forecasting_CanView) || _authorizationService.HasAuthorization(Task.Forecasting_Event_CanView)))
                {
                    throw new HttpResponseException(HttpStatusCode.Forbidden);
                }
            }
        }
    }
}