using System;
using System.Net;
using System.Web.Http;
using Mx.Forecasting.Services.Contracts.CommandServices;
using Mx.Forecasting.Services.Contracts.QueryServices;
using Mx.Forecasting.Services.Contracts.Requests;
using Mx.Foundation.Services.Contracts.QueryServices;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Areas.Forecasting.Api.Models;
using Mx.Web.UI.Config.Translations;
using Mx.Web.UI.Config.WebApi;

namespace Mx.Web.UI.Areas.Forecasting.Api
{
    public class EventTagNoteController : RESTController
    {
        #region Injections

        private readonly IEventProfileTagQueryService _eventProfileTagQueryService;
        private readonly IEventProfileTagCommandService _eventProfileTagCommandService;
        private readonly IAuthenticationService _authenticationService;
        private readonly ITranslationService _translationService;

        public EventTagNoteController(IUserAuthenticationQueryService userAuthenticationQueryService,
            IEventProfileTagQueryService eventProfileTagQueryService,
            IEventProfileTagCommandService eventProfileTagCommandService,
            IAuthenticationService authenticationService,
            ITranslationService translationService)
            : base(userAuthenticationQueryService)
        {
            _eventProfileTagQueryService = eventProfileTagQueryService;
            _eventProfileTagCommandService = eventProfileTagCommandService;
            _authenticationService = authenticationService;
            _translationService = translationService;
        }

        #endregion


        [Permission(Task.Forecasting_Event_CanView)]
        public void PutEventProfileTagNote([FromBody] EventProfileTagNote tagnote, Int64 entityId)
        {
            var user = _authenticationService.User;
            var l10N = _translationService.Translate<Models.Translations>(user.Culture);

            var tagOriginal = _eventProfileTagQueryService.GetByEventTagId(tagnote.Id);

            if (tagOriginal == null)
            {
                throw new CustomErrorMessageException(HttpStatusCode.Conflict, new ErrorMessage(l10N.EventHasNotBeenFound));
            }

            var request = new EventProfileTagNoteRequest
            {
                Id = tagnote.Id,
                Note = tagnote.Note,
            };

            _eventProfileTagCommandService.UpdateEventProfileTagNote(request);

        }
    }
}