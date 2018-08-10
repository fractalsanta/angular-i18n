using System;
using System.Web.Http;
using AutoMapper;
using Mx.Administration.Services.Contracts.CommandServices;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Web.UI.Areas.Administration.Hierarchy.Api.Models;
using Mx.Administration.Services.Contracts.Requests;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Services.Shared.Contracts;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Config.WebApi;

namespace Mx.Web.UI.Areas.Administration.Hierarchy.Api
{
    [Permission(Task.Administration_Hierarchy_CanView)]
    public class HierarchyController : ApiController
    {
        private readonly IMappingEngine _mappingEngine;
        private readonly IEntityQueryService _entityQueryService;
        private readonly IEntityCommandService _entityCommandService;
        private readonly IAuthenticationService _authenticationService;

        public HierarchyController(
            IMappingEngine mappingEngine,
            IEntityQueryService entityQueryService,
            IEntityCommandService entityCommandService,
            IAuthenticationService authenticationService)
        {
            _mappingEngine = mappingEngine;
            _entityQueryService = entityQueryService;
            _entityCommandService = entityCommandService;
            _authenticationService = authenticationService;
        }

        public HierarchyEntity GetHierarchy([FromUri] Int64 baseEntityId)
        {
            var result = _entityQueryService.GetEntitiesAsHierarchy(baseEntityId);

            return _mappingEngine.Map<HierarchyEntity>(result);
        }

        public String[] GetHierarchyLevels()
        {
            var results = _entityQueryService.GetEntityLevels();

            return results;
        }

        public Int64 PostCreateEntity(
            [FromUri] String number,
            [FromUri] String name,
            [FromUri] Int64 parentId,
            [FromUri] Int16 type
             )
        {
            var user = _authenticationService.User;
            var auditUser = _mappingEngine.Map<AuditUser>(user);

            var basicEntityRequest = new CreateBasicEntityRequest
            {
                Name = name,
                Number = number,
                ParentId = parentId,
                TypeId = type,
                AuditUser = auditUser
            };

            var id = _entityCommandService.CreateBarebonesEntity(basicEntityRequest);

            return id;
        }

        public void PutUpdateBarebonesEntity(
            [FromUri] Int64 id,
            [FromUri] String number,
            [FromUri] String name
             )
        {
            var user = _authenticationService.User;
            var auditUser = _mappingEngine.Map<AuditUser>(user);

            var basicEntityRequest = new UpdateBasicEntityRequest
            {
                Id = id,
                Name = name,
                Number = number,
                AuditUser = auditUser
            };

            _entityCommandService.UpdateBarebonesEntity(basicEntityRequest);
        }

        public void PutMoveHierarchy(
           [FromUri] Int64 id,
           [FromUri] Int64 parentId
            )
        {
            var user = _authenticationService.User;
            var auditUser = _mappingEngine.Map<AuditUser>(user);

            var moveEntityRequest = new MoveEntityRequest
            {
                Id = id,
                ParentId = parentId,
                AuditUser = auditUser
            };

            _entityCommandService.MoveEntity(moveEntityRequest);
        }
    }
}