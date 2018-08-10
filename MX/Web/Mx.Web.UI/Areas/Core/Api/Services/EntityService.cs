using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Services.Shared.ExtensionMethods;
using Mx.Web.UI.Areas.Core.Api.Models;

namespace Mx.Web.UI.Areas.Core.Api.Services
{
    public class EntityService : IEntityService
    {
        private readonly IAuthenticationService _authenticationService;
        private readonly IEntityQueryService _entityQueryService;
        private readonly IMappingEngine _mappingEngine;

        private Boolean _corporateLoaded = false;
        private long _corporateEntityId;

        public EntityService(IEntityQueryService entityQueryService,
            IAuthenticationService authenticationService,
            IMappingEngine mappingEngine)
        {
            _entityQueryService = entityQueryService;
            _authenticationService = authenticationService;
            _mappingEngine = mappingEngine;
        }

        public long CorporateEntityId()
        {
            if (!_corporateLoaded)
            {
                var entities = _entityQueryService.GetEntitiesHierarchyForUser(_authenticationService.User.Id, 1).ToList();
                if (!entities.Any())
                {
                    throw new Exception("Unable to determine corporate entity, should never happen");
                }
                _corporateEntityId = entities.Where(x=>x.TypeId == 1).Select(x => x.Id).Single();
            }
            return _corporateEntityId;
        }

        public IEnumerable<JsTreeNode> GetUserEntitiesForJsTree()
        {
            var nodes = _mappingEngine.Map<IEnumerable<JsTreeNode>>(
                _entityQueryService.GetEntitiesHierarchyForUser(_authenticationService.User.Id, (long)EntityType.Corporate));

            // root node with EntityTypeId 1
            nodes.Single(e => e.data.Equals((long)EntityType.Corporate)).parent = "#";

            return nodes;
        }
    }
}