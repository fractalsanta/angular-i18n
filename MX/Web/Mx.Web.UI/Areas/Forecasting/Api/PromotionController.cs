using System;
using System.Collections.Generic;
using System.Web.Http;
using AutoMapper;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Forecasting.Services.Contracts;
using Mx.Forecasting.Services.Contracts.CommandServices;
using Mx.Forecasting.Services.Contracts.QueryServices;
using Mx.Forecasting.Services.Contracts.Requests;
using Mx.Forecasting.Services.Contracts.Responses;
using Mx.Foundation.Services.Contracts.QueryServices;
using Mx.Services.Shared.Contracts;
using Mx.Services.Shared.Contracts.Constants;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Areas.Forecasting.Api.Models;
using Mx.Web.UI.Config.WebApi;
using IZoneQueryService = Mx.Forecasting.Services.Contracts.QueryServices.IZoneQueryService;
using PromotionTimeline = Mx.Web.UI.Areas.Forecasting.Api.Enums.PromotionTimeline;
using Zone = Mx.Web.UI.Areas.Forecasting.Api.Models.Zone;

namespace Mx.Web.UI.Areas.Forecasting.Api
{
    public class PromotionController : RESTController
    {
        private readonly IMappingEngine _mappingEngine;
        private readonly IAuthenticationService _authenticationService;
        private readonly ILocalisationQueryService _localisationQueryService;
        private readonly ISystemSettingsQueryService _systemQueryService;
        private readonly IZoneQueryService _zoneQueryService;
        private readonly IPromotionQueryService _promotionQueryService;
        private readonly IPromotionCommandService _promotionCommandService;
        private readonly IEntityService _entityService;

        public PromotionController(IMappingEngine mappingEngine
            , IUserAuthenticationQueryService userAuthenticationQueryService
            , IAuthenticationService authenticationService
            , ILocalisationQueryService localisationQueryService
            , ISystemSettingsQueryService systemQueryService
            , IZoneQueryService zoneQueryService
            , IPromotionQueryService promotionQueryService
            , IPromotionCommandService promotionCommandService
            , IEntityService entityService
        )
            : base(userAuthenticationQueryService)
        {
            _mappingEngine = mappingEngine;
            _authenticationService = authenticationService;
            _localisationQueryService = localisationQueryService;
            _systemQueryService = systemQueryService;
            _zoneQueryService = zoneQueryService;
            _promotionQueryService = promotionQueryService;
            _promotionCommandService = promotionCommandService;
            _entityService = entityService;
        }

        // GET api/<controller>
        [Permission(Task.Forecasting_Promotions_CanView)]
        public IEnumerable<PromotionListItem> Get(DateTime? startDate = null, DateTime? endDate = null, PromotionStatus? status = null)
        {
            var promoResponses = _promotionQueryService.Get(startDate, endDate, status);

            var promos = _mappingEngine.Map<IEnumerable<PromotionListItem>>(promoResponses);

            var user = _authenticationService.User;
            var translations = _localisationQueryService.GetPageTranslation("ForecastingPromotions", user.Culture);

            promos.Each(p =>
            {
                string key = "Timeline" + p.Timeline;
                p.TimelineText = translations.ContainsKey(key) ? translations[key] : p.Timeline.ToString();
            });
            
            return promos;
        }

        // GET api/<controller>/5
        [Permission(Task.Forecasting_Promotions_CanView)]
        public Promotion Get(long id)
        {
            var promoResponse = _promotionQueryService.GetById(id);
            var promo = _mappingEngine.Map<Promotion>(promoResponse);
            return promo;
        }

        [Permission(Task.Forecasting_Promotions_CanView)]
        public Promotion GetWithTimeline(long id, bool withTimeline)
        {
            var promoResponse = _promotionQueryService.GetByIdWithTimeline(id, _systemQueryService.GetSystemTime());
            var promo = _mappingEngine.Map<Promotion>(promoResponse);
            return promo;
        }

        [Permission(Task.Forecasting_Promotions_CanView)]
        public PromotionFormData GetFormData(long id, bool withFormData)
        {
            var systemTime = _systemQueryService.GetSystemTime();

            bool withEntities = true;
            bool withZones = true;
            Promotion promo = null;
            if (id > 0)
            {
                var promoResponse = _promotionQueryService.GetByIdWithTimeline(id, systemTime);
                promo = _mappingEngine.Map<Promotion>(promoResponse);
                if (promo.Timeline != PromotionTimeline.Pending)
                {
                    // don't send data we won't need
                    if (promo.UseZones)
                    {
                        withEntities = false;
                    }
                    else
                    {
                        withZones = false;
                    }
                }
            }

            var entities = withEntities
                ? _entityService.GetUserEntitiesForJsTree()
                : null;

            var zones = withZones
                ? _mappingEngine.Map<IEnumerable<Zone>>(_zoneQueryService.GetByZoneType(ZoneTypeName.Forecasting))
                : null;

            return new PromotionFormData
            {
                Promotion = promo, 
                Today = systemTime.Date, 
                Zones = zones,
                Entities = entities
            };
        }

        // POST api/<controller>
        [Permission(Task.Forecasting_Promotions_CanView)]
        public PromotionResult Post([FromBody]Promotion promo, bool checkOverlap)
        {
            var user = _authenticationService.User;
            var auditUser = _mappingEngine.Map<AuditUser>(user);
            var promoRequest = _mappingEngine.Map<PromotionRequest>(promo);

            PromotionResultResponse resultResponse;

            resultResponse = _promotionCommandService.Upsert(promoRequest, checkOverlap, auditUser);

            var result = _mappingEngine.Map<PromotionResult>(resultResponse);
            return result;
        }

        public void Post([FromBody] PopulateStoresForZonePromotionRequest request)
        {
            _promotionCommandService.PopulatePromotionEntityForZone(request.StartDate, request.EndDate);
        }

        // DELETE api/<controller>/5
        [Permission(Task.Forecasting_Promotions_CanView)]
        public void Delete(int id)
        {
            var user = _authenticationService.User;
            var auditUser = _mappingEngine.Map<AuditUser>(user);
            _promotionCommandService.Delete(id, auditUser);
        }
    }
}