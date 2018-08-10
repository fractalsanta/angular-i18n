using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using AutoMapper;
using Mx.Inventory.Services.Contracts.QueryServices;
using Mx.Inventory.Services.Contracts.Requests;
using Mx.Web.UI.Areas.Inventory.Transfer.Api.Models;
using Mx.Web.UI.Config.WebApi;
using Mx.Web.UI.Areas.Core.Api.Models;
using System.Net;
using Mx.Web.UI.Areas.Core.Api.Services;
using contractEnums = Mx.Inventory.Services.Contracts.Enums;
using apiEnums = Mx.Web.UI.Areas.Inventory.Transfer.Api.Enums;

namespace Mx.Web.UI.Areas.Inventory.Transfer.Api
{
    public class TransferStoreController : ApiController
    {
        private readonly ITransferQueryService _transferQueryService;
        private readonly IAuthenticationService _authenticationService;
        private readonly IMappingEngine _mapper;

        private enum ZoneType
        {
            Transfer
        }

        public TransferStoreController(
           ITransferQueryService transferQueryService,
            IAuthenticationService authenticationService,
            IMappingEngine mapper)
        {
            _transferQueryService = transferQueryService;
            _authenticationService = authenticationService;
            _mapper = mapper;
        }

        public IEnumerable<StoreItem> GetNeighboringStores(
            [FromUri] Int64 currentStoreId,
            [FromUri] apiEnums.TransferDirection direction)
        {
            EnsurePermission(direction);

            var result = _transferQueryService.GetStoresForSameZoneType(new GetStoresForSameZoneTypeRequest
            {
                ZoneTypeName = ZoneType.Transfer.ToString(),
                IdOfStoreInSameZone = currentStoreId
            });

            return _mapper.Map<IEnumerable<StoreItem>>(result);
        }

        public IEnumerable<TransferableItem> GetTransferableItemsBetweenStoresLimited(
            [FromUri] Int64 fromEntityId,
            [FromUri] Int64 toEntityId,
            [FromUri] String filter,
            [FromUri] apiEnums.TransferDirection direction)
        {
            EnsurePermission(direction);

            var result = _transferQueryService.GetTransferableItemsBetweenStores(new GetTransferableItemsBetweenStoresRequest
            {
                FromEntityId = fromEntityId,
                ToEntityId = toEntityId,
                Filter = filter,
                Limit = 100,
                Direction = (contractEnums.TransferDirection)direction
            });

            return _mapper.Map<IEnumerable<TransferableItem>>(result);
        }

        private void EnsurePermission(apiEnums.TransferDirection direction)
        {
            var user = _authenticationService.User;
            if (( direction == apiEnums.TransferDirection.TransferOut && !user.Permission.HasPermission(Task.Inventory_Transfers_CanCreateTransferOut))
                || ( direction == apiEnums.TransferDirection.TransferIn && !user.Permission.HasPermission(Task.Inventory_Transfers_CanRequestTransferIn)))
            {
                throw new HttpResponseException(HttpStatusCode.Forbidden);
            }
        }
    }
}