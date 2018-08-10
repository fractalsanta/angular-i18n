using System.Collections.Generic;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Services.Shared.Exceptions;
using System;
using AutoMapper;
using Mx.Web.UI.Areas.Core.Api.Services;
using System.Linq;

namespace Mx.Web.UI.Areas.Operations.Reporting.Api.Services
{
    public class ReportEntitiesService : IReportEntitiesService
    {
        private readonly IEntityQueryService _entityQueryService;
        private readonly IAuthenticationService _authService;

        public ReportEntitiesService(IEntityQueryService entityQueryService,
            IAuthenticationService authService)
        {
            _entityQueryService = entityQueryService;
            _authService = authService;
        }

        public IEnumerable<EntityModel> GetEntitiesFromEntityId(long? entityId)
        {
            IEnumerable<EntityModel> entities;

            if (entityId.HasValue)
            {
                var entity = _entityQueryService.GetById(entityId.Value);

                if (entity == null)
                {
                    throw new MissingResourceException();
                }

                if (entity.TypeId != (Int64)EntityType.Store)
                {
                    entities = Mapper.Map<IEnumerable<EntityModel>>(_entityQueryService
                        .GetEntitiesHierarchyForUser(_authService.UserId, (Int64)EntityType.Store)
                        .Where(x => x.TypeId == (Int64)EntityType.Store && x.ParentId == entityId.Value));
                }
                else
                {
                    entities = new List<EntityModel>() { Mapper.Map<EntityModel>(entity) };
                }
            }
            else
            {
                entities = Mapper.Map<IEnumerable<EntityModel>>(_entityQueryService
                    .GetEntitiesHierarchyForUser(_authService.UserId, (Int64)EntityType.Store)
                    .Where(x => x.TypeId == (Int64)EntityType.Store));
            }
            return entities;

        }
    }
}