using System;
using System.Linq;
using System.Web.Http;
using AutoMapper;
using Mx.Inventory.Services.Contracts.CommandServices;
using Mx.Inventory.Services.Contracts.QueryServices;
using Mx.Inventory.Services.Contracts.Requests;
using System.Collections.Generic;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Areas.Inventory.Transfer.Api.Models;
using Mx.Web.UI.Config.WebApi;
using Mx.Web.UI.Areas.Core.Api.Models;
using System.Net;
namespace Mx.Web.UI.Areas.Inventory.Transfer.Api
{
    public class TransferHistoryController : ApiController
    {
        private readonly IMappingEngine _mappingEngine;
        private readonly ITransferQueryService _transferQueryService;
        private readonly IAuthenticationService _authenticationService;

        public TransferHistoryController(
            ITransferQueryService transferQueryService,
            IMappingEngine mappingEngine,
            IAuthenticationService authenticationService)
        {
            _transferQueryService = transferQueryService;
            _mappingEngine = mappingEngine;
            _authenticationService = authenticationService;

            EnsurePermission();
        }

        public IEnumerable<TransferHeaderWithEntities> GetTransfersWithEntitiesByStoreAndDateRange(
           [FromUri] Int64 entityId,
           [FromUri] DateTime startTime,
           [FromUri] DateTime endTime)
        {
            var transfers = _transferQueryService.GetTransfersForEntityByCreateDateWithEntities(entityId, startTime, endTime);

            var result = _mappingEngine.Map<IEnumerable<TransferHeaderWithEntities>>(transfers);
            
            return result;
        }

        public Models.TransferReporting GetByTransferIdWithReportingUnits(
            [FromUri] Int64 transferId,
            [FromUri] Int64 entityId)
        {
            var transfer = _transferQueryService.GetTransferByIdWithReportingUnits(transferId, entityId);

            var result = _mappingEngine.Map<Models.TransferReporting>(transfer);

            return result;
        }

        private void EnsurePermission()
        {
            var requiredTaks = new[]
            {
                Task.Inventory_Transfers_CanRequestTransferIn,
                Task.Inventory_Transfers_CanCreateTransferOut
            };

            var user = _authenticationService.User;
            if (!requiredTaks.Intersect(user.Permission.AllowedTasks).Any())
            {
                throw new HttpResponseException(HttpStatusCode.Forbidden);
            }
        }
    }
}