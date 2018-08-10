using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web.Http;
using AutoMapper;
using Mx.Administration.Services.Contracts.Responses;
using Mx.Forecasting.Services.Contracts.CommandServices;
using Mx.Forecasting.Services.Contracts.QueryServices;
using Mx.Forecasting.Services.Contracts.Requests;
using Mx.Foundation.Services.Contracts.QueryServices;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Administration.Services.Contracts.Requests;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Areas.Forecasting.Api.Models;
using Mx.Web.UI.Areas.Forecasting.Api.Services;
using Mx.Web.UI.Config.Translations;
using Mx.Web.UI.Config.WebApi;

namespace Mx.Web.UI.Areas.Forecasting.Api
{
    public class EventTagController : RESTController
    {
        private readonly IMappingEngine _mappingEngine;
        private readonly IForecastRegenerator _forecastReGenerator;
        private readonly IForecastQueryService _forecastQueryService;
        private readonly IEventProfileTagQueryService _eventProfileTagQueryService;
        private readonly IEventProfileTagCommandService _eventProfileTagCommandService;
        private readonly IPeriodDetailQueryService _periodDetailQueryService;
        private readonly IAuthenticationService _authenticationService;
        private readonly ITranslationService _translationService;
        private readonly IMxDayQueryService _mxDayQueryService;

        public EventTagController(IMappingEngine mappingEngine,
            IForecastRegenerator forecastReGenerator,
            IForecastQueryService forecastQueryService,
            IUserAuthenticationQueryService userAuthenticationQueryService,
            IEventProfileTagQueryService eventProfileTagQueryService,
            IEventProfileTagCommandService eventProfileTagCommandService,
            IPeriodDetailQueryService periodDetailQueryService,
            IAuthenticationService authenticationService,
            IMxDayQueryService mxDayQueryService,
            ITranslationService translationService)
            : base(userAuthenticationQueryService)
        {
            _mappingEngine = mappingEngine;
            _forecastReGenerator = forecastReGenerator;
            _forecastQueryService = forecastQueryService;
            _eventProfileTagQueryService = eventProfileTagQueryService;
            _eventProfileTagCommandService = eventProfileTagCommandService;
            _periodDetailQueryService = periodDetailQueryService;
            _authenticationService = authenticationService;
            _translationService = translationService;
            _mxDayQueryService = mxDayQueryService;
        }

        [Permission(Task.Forecasting_Event_CanView)]
        public IEnumerable<EventProfileTag> GetEventProfileTags(Int64 eventProfileId)
        {
            var eventProfileTags = _eventProfileTagQueryService.GetByEventProfileId(eventProfileId);
            var eventProfileTagViewModels = _mappingEngine.Map<IList<EventProfileTag>>(eventProfileTags);
            foreach (var vm in eventProfileTagViewModels)
            {
                vm.EventProfileId = eventProfileId;
            }
            return eventProfileTagViewModels;
        }

        [Permission(Task.Forecasting_Event_CanView)]
        public void PostEventProfileTag([FromBody] EventProfileTag tag, Int64 entityId)
        {
            var user = _authenticationService.User;
            var l10N = _translationService.Translate<Models.Translations>(user.Culture);
            tag.Date = tag.Date.Date;

            if (IsInPast(entityId, tag.Date))
            {
                throw new CustomErrorMessageException(HttpStatusCode.Conflict, new ErrorMessage(l10N.EventProfileInPast));
            }

            var profileTagsForDate = _eventProfileTagQueryService.GetByEntityAndDateRange(entityId, tag.Date.Date, tag.Date.Date).ToList();
            
            if (profileTagsForDate.Any(t => t.EventProfile.Id == tag.EventProfileId))
            {
                throw new CustomErrorMessageException(HttpStatusCode.Conflict, new ErrorMessage(l10N.EventAlreadyScheduled));
            }
            
            EnsureNoClosedDays(entityId, tag, l10N);

            var request = GetEventProfileTagRequest(entityId, tag);

            _eventProfileTagCommandService.InsertEventProfileTag(request);

            if (_forecastQueryService.HasForecastByEntityIdByBusinessDay(entityId, tag.Date.Date))
            {
                _forecastReGenerator.RegenerateForecast(entityId, tag.Date, l10N.ForecastGenerationFailed);
            }
        }

        [Permission(Task.Forecasting_Event_CanView)]
        public void PutEventProfileTag([FromBody] EventProfileTag tag, Int64 entityId)
        {
            var user = _authenticationService.User;
            var l10N = _translationService.Translate<Models.Translations>(user.Culture);
            tag.Date = tag.Date.Date;

            if (IsInPast(entityId, tag.Date))
            {
                throw new CustomErrorMessageException(HttpStatusCode.Conflict, new ErrorMessage(l10N.EventProfileInPast));
            }

            var profileTagsForDate = _eventProfileTagQueryService.GetByEntityAndDateRange(entityId, tag.Date.Date, tag.Date.Date).ToList();
            var tagOriginal = _eventProfileTagQueryService.GetByEventTagId(tag.Id);

            if (tagOriginal == null)
            {
                throw new CustomErrorMessageException(HttpStatusCode.Conflict, new ErrorMessage(l10N.EventHasNotBeenFound));
            }

            if (profileTagsForDate.Any(t => t.EventProfile.Id == tag.EventProfileId))
            {
                throw new CustomErrorMessageException(HttpStatusCode.Conflict, new ErrorMessage(l10N.EventAlreadyScheduled));
            }

            if (tagOriginal.Date.Date != tag.Date.Date)
            {
                EnsureNoClosedDays(entityId, tag, l10N);
            }

            var request = GetEventProfileTagRequest(entityId, tag);

            _eventProfileTagCommandService.UpdateEventProfileTag(request);

            // reforecast the original date
            var refreshOriginalForecast = (tagOriginal.Date.Date != tag.Date.Date || tagOriginal.EventProfile.Id != tag.EventProfileId) &&
                                      _forecastQueryService.HasForecastByEntityIdByBusinessDay(entityId,
                                          tagOriginal.Date.Date);

            var hasTargetForecast = _forecastQueryService.HasForecastByEntityIdByBusinessDay(entityId, tag.Date.Date);

            if (refreshOriginalForecast)
            {
                _forecastReGenerator.RegenerateForecast(entityId, tagOriginal.Date.Date, l10N.ForecastGenerationFailed);

                // reforecast the target date
                if (hasTargetForecast)
                {
                    if (tagOriginal.Date.Date != tag.Date.Date || tagOriginal.EventProfile.Id != tag.EventProfileId)
                    {
                        _forecastReGenerator.RegenerateForecast(entityId, tag.Date, l10N.ForecastGenerationFailed);
                    }
                }

            }
        }

        [Permission(Task.Forecasting_Event_CanView)]
        public void DeleteEventProfileTag([FromUri] Int64 entityId, [FromUri] Int64 tagId, [FromUri] string connectionId)
        {
            var tag = _eventProfileTagQueryService.GetByEventTagId(tagId);
            var user = _authenticationService.User;
            var l10N = _translationService.Translate<Models.Translations>(user.Culture);

            if (IsInPast(entityId, tag.Date))
            {
                throw new CustomErrorMessageException(HttpStatusCode.Conflict, new ErrorMessage(l10N.EventProfileInPast));
            }

            _eventProfileTagCommandService.DeleteEventProfileTag(tagId);

            if (_forecastQueryService.HasForecastByEntityIdByBusinessDay(entityId, tag.Date.Date))
            {
                _forecastReGenerator.RegenerateForecast(entityId, tag.Date, l10N.ForecastGenerationFailed);
            }
        }

        private EventProfileTagRequest GetEventProfileTagRequest(Int64 entityId, EventProfileTag tag)
        {
            var request = new EventProfileTagRequest
            {
                Id = tag.Id,
                Date = tag.Date,
                Note = tag.Note,
                EventProfileId = tag.EventProfileId,
                EntityId = entityId
            };
            return request;
        }

        private void EnsureNoClosedDays(Int64 entityId, EventProfileTag tag, Models.Translations l10N)
        {
            var closedDays = GetClosedDays(entityId, tag);
            if (closedDays.ClosedDays.Count > 0)
            {
                throw new CustomErrorMessageException(HttpStatusCode.Conflict, new ErrorMessage(l10N.CannotScheduleEventOnClosedDay));
            }
        }

        private GetClosedDaysForWeekDateRangeResponse GetClosedDays(Int64 entityId, EventProfileTag tag)
        {
            var closedDays = _periodDetailQueryService.GetClosedDaysForWeekDateRange(new GetClosedDaysForWeekDateRangeRequest
            {
                EntityId = entityId,
                StartDate = tag.Date.Date,
                EndDate = tag.Date.Date,
            });

            return closedDays;
        }

        private bool IsInPast(long entityid, DateTime date)
        {
            var today = GetBusinessDate(entityid);
            return (today.Date > date.Date);
        }

        private DateTime GetBusinessDate(Int64 entityId)
        {
            var result = _mxDayQueryService.GetForTradingDate(new MxDayRequest { EntityId = entityId });
            return result.CalendarDay;
        }       
    }
}