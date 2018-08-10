using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using AutoMapper;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Administration.Services.Contracts.Requests;
using Mx.Administration.Services.Contracts.Responses;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Services;

namespace Mx.Web.UI.Areas.Core.Api
{
    public class EntityController : ApiController
    {
        private readonly IEntityQueryService _entityQueryService;
        private readonly IMappingEngine _mapper;
        private readonly IMxDayQueryService _mxDayQueryService;
        private readonly IAuthenticationService _authenticationService;

        public EntityController(IEntityQueryService entityQueryService, 
            IMappingEngine mapper, 
            IMxDayQueryService mxDayQueryService,
            IAuthenticationService authService)
        {
            _entityQueryService = entityQueryService;
            _mapper = mapper;
            _mxDayQueryService = mxDayQueryService;
            _authenticationService = authService;
        }

        public EntityModel Get([FromUri] Int32 entityId)
        {
            var result = _mapper.Map<EntityModel>(_entityQueryService.GetById(entityId));
            // Culture is not currently returned
            result.CultureName = _entityQueryService.GetCultureNameForEntity(entityId);
            result.CurrentBusinessDay = _mxDayQueryService.GetForTradingDate(new MxDayRequest { EntityId = entityId }).CalendarDay;
            return result;
        }

        public IEnumerable<EntityModel> GetOpenEntities([FromUri] Int32 userId)
        {
            var result = _entityQueryService.GetEntitiesForUser(userId).Where(x=>x.Status.Equals("open", StringComparison.InvariantCultureIgnoreCase)).ToList();
            return _mapper.Map<IEnumerable<EntityModel>>(result);
        }

        public Int32 GetStartOfWeek(Int64 entityId, DateTime calendarDay)
        {
            var result = _mapper.Map<MxDayResponse>(_mxDayQueryService.GetMxDayForStartOfWeek(entityId, calendarDay));

            return (Int32)result.CalendarDay.DayOfWeek;
        }

        public IEnumerable<EntityModel> GetEntitiesByIds([FromUri] IEnumerable<Int64> entityIds)
        {
            var result = _entityQueryService.GetEntitiesByIds(entityIds);

            return _mapper.Map<IEnumerable<EntityModel>>(result);
        }

        public IEnumerable<EntityModel> GetEntitiesByEntityType([FromUri] EntityType entityTypeId)
        {
            var userId = _authenticationService.UserId;
            var result = _entityQueryService.GetEntitiesHierarchyForUser(userId, (Int64)entityTypeId).Where(x => x.TypeId == (Int64)entityTypeId);
            return _mapper.Map<IEnumerable<EntityModel>>(result);
        }
    }
}