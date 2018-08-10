using System;
using System.Linq;
using System.Web.Http;
using AutoMapper;
using Mx.Inventory.Services.Contracts.CommandServices;
using Mx.Inventory.Services.Contracts.QueryServices;
using Mx.Inventory.Services.Contracts.Requests;
using System.Collections.Generic;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Areas.Inventory.Count.Api.Models;
using Mx.Web.UI.Areas.Inventory.Transfer.Api.Models;
using Mx.Web.UI.Config.WebApi;
using Mx.Web.UI.Areas.Core.Api.Models;
using System.Net;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Inventory.Services.Contracts.Responses;
using Mx.Labor.Services.Contracts.QueryServices;
using Mx.Labor.Services.Contracts.Requests;
using ApiEnums = Mx.Web.UI.Areas.Inventory.Transfer.Api.Enums;
using ContractEnums = Mx.Inventory.Services.Contracts.Enums;
using Mx.Web.UI.Areas.Inventory.Transfer.Api.Enums;
namespace Mx.Web.UI.Areas.Inventory.Transfer.Api
{
    public class TransferController : ApiController
    {
        private readonly IMappingEngine _mappingEngine;
        private readonly ITransferQueryService _transferQueryService;
        private readonly IAuthenticationService _authenticationService;
        private readonly ITransferCommandService _transferCommandService;
        private readonly IInventoryCountCommandService _inventoryCountCommandService;
        private readonly IPeriodCloseQueryService _periodCloseQueryService;
        private readonly IEntityTimeQueryService _entityTimeQueryService;

        public TransferController(
            ITransferQueryService transferQueryService,
            IMappingEngine mappingEngine,
            IAuthenticationService authenticationService,
            ITransferCommandService transferCommandService,
            IInventoryCountCommandService inventoryCountCommandService,
            IPeriodCloseQueryService periodCloseQueryService,
            IEntityTimeQueryService entityTimeQueryService)
        {
            _transferQueryService = transferQueryService;
            _mappingEngine = mappingEngine;
            _authenticationService = authenticationService;
            _transferCommandService = transferCommandService;
            _inventoryCountCommandService = inventoryCountCommandService;
            _periodCloseQueryService = periodCloseQueryService;
            _entityTimeQueryService = entityTimeQueryService;

            EnsurePermission();
        }

        public Models.Transfer GetByTransferIdAndEntityId(
            [FromUri] Int64 transferId, 
            [FromUri] Int64 entityId)
        {
            var transfer = _transferQueryService.GetTransferByIdAndEntityId(transferId, entityId);

            var result = _mappingEngine.Map<Models.Transfer>(transfer);

            return result;
        }

        public IEnumerable<TransferHeader> GetPendingTransfersFromStoreByEntityId(
            [FromUri] Int64 transferEntityId,
            [FromUri] Boolean showTransferIn,
            [FromUri] Boolean showTransferOut)
        {
            var transfersIn = new List<TransferHeaderResponse>();
            var transfersOut = new List<TransferHeaderResponse>();
            var transfers = new List<TransferHeaderResponse>();

            if (showTransferIn)
            {
                transfersIn = _transferQueryService.GetPendingTransferRequestsToApprove(transferEntityId).ToList();
                transfersIn.AddRange(_transferQueryService.GetPendingTransfersFromInsideRequestToReceive(transferEntityId));
            }
            if (showTransferOut)
            {
                transfersOut = _transferQueryService.GetPendingTransfersFromOutsideRequestToReceive(transferEntityId).ToList();
            }

            transfers = transfersIn.Union(transfersOut).ToList();

            var rs = _mappingEngine.Map<IEnumerable<TransferHeader>>(transfers);

            return rs;
        }

        public IEnumerable<TransferHeader> GetTransfersByStoreAndDateRange(
            [FromUri] Int64 entityId,
            [FromUri] DateTime startTime,
            [FromUri] DateTime endTime)
        {
            var transfers = _transferQueryService.GetTransfersForEntityByCreateDate(entityId, startTime, endTime);

            return _mappingEngine.Map<IEnumerable<TransferHeader>>(transfers);
        }

        public void PostCreateInventoryTransfer(
            [FromUri] Int64 transferFromEntityId,
            [FromUri] Int64 transferToEntityId,
            [FromBody] TransferItemsRequest body)
        {
            if (body.Items.Count == 0)
            {
                return;
            }

            var transferId = this.CreateInventoryTransfer(transferFromEntityId, transferToEntityId, body.Direction, body.Items);

            if (body.UpdateCosts.Count != 0)
            {
                this.PutUpdateNoCostItems(transferId, transferFromEntityId, body.UpdateCosts);
            }
        }

        public void PutUpdateTransferQuantities(
            [FromBody] Models.Transfer transfer,
            [FromUri] Boolean isApproved,
            [FromUri] String reason
           )
        {
            EnsurePeriodStatus(transfer.SendingEntityId, transfer.RequestingEntityId);

            if (isApproved)
            {
                UpdateInventoryTransferQtys(transfer);
            }

            UpdateTransferStatus(transfer, isApproved, reason);
        }

        private Decimal GetTransferCost(
            TransferableItem item)
        {
            var unitItem = new CreateUnitTransferCostRequest()
            {
                ItemQty1 = item.TransferQty1,
                ItemQty2 = item.TransferQty2,
                ItemQty3 = item.TransferQty3,
                ItemQty4 = item.TransferQty4,
                Unit1 = item.TransferUnit1,
                Unit2 = item.TransferUnit2,
                Unit3 = item.TransferUnit3,
                Unit4 = item.TransferUnit4,
                InventoryUnit = item.TransferUnit3,
                TransferUnitCost = item.InventoryUnitCost
            };

            var result = _transferCommandService.GetUnitTransferCost(unitItem);

            return result;
        }

        public TransferDetail PutTransferDetailWithUpdatedCostAndQuantity(
            [FromBody] TransferDetail transferDetail)
        {
            var request = _mappingEngine.Map<UpdateInventoryTransferRequestItem>(transferDetail);

            var transferDetailResponse = _transferCommandService.GetTransferDetailWithUpdatedCostAndQuantity(request);

            var result = _mappingEngine.Map<TransferDetail>(transferDetailResponse);

            return result;
        }


        public void PutUpdateNoCostItems([FromUri] Int64 transferId
            , [FromUri] Int64 entityId
            , [FromBody]List<UpdateCostViewModel> updateCostItems)
        {

            _inventoryCountCommandService.UpdateInventoryUnitCost(GetUpdateInventoryUnitCostRequest(entityId, updateCostItems));
            _transferCommandService.UpdateInventoryTransferNoCostItems(GetUpdateInventoryUnitCostRequest(entityId, updateCostItems), transferId);
        }

        private Int64 CreateInventoryTransfer(Int64 transferFromEntityId, Int64 transferToEntityId, ApiEnums.TransferDirection direction, List<TransferableItem> items)
        {
            EnsurePeriodStatus(transferFromEntityId, transferToEntityId);

            var inventoryTransferRequestItems = items.Select(item => new CreateInventoryTransferRequestItem
            {
                Code = item.Code,
                Description = item.Description,
                ItemId = item.Id,
                TransferQty1 = item.TransferQty1,
                TransferQty2 = item.TransferQty2,
                TransferQty3 = item.TransferQty3,
                TransferQty4 = item.TransferQty4,
                OriginalTransferQty1 = item.TransferQty1,
                OriginalTransferQty2 = item.TransferQty2,
                OriginalTransferQty3 = item.TransferQty3,
                OriginalTransferQty4 = item.TransferQty4,
                TransferUnitCost = item.InventoryUnitCost,
                TransferUnit1 = item.TransferUnit1,
                TransferUnit2 = item.TransferUnit2,
                TransferUnit3 = item.TransferUnit3,
                TransferUnit4 = item.TransferUnit4,
                InventoryUnit = item.PurchaseUnit,
                TransferCost = GetTransferCost(item)
            });

            var request = new CreateInventoryTransferRequest
            {
                TransferFromEntityId = transferFromEntityId,
                TransferToEntityId = transferToEntityId,
                Direction = direction == ApiEnums.TransferDirection.TransferIn ? ContractEnums.TransferDirection.TransferIn : ContractEnums.TransferDirection.TransferOut,
                Items = inventoryTransferRequestItems,
                RequestedBy = direction == ApiEnums.TransferDirection.TransferIn ?_authenticationService.User.FormatNameFirstLastId() : null,
                TransferedBy = direction == ApiEnums.TransferDirection.TransferOut ? _authenticationService.User.FormatNameFirstLastId() : null
            };
            if (direction == ApiEnums.TransferDirection.TransferIn)
            {
                //When a user request a transfer in to his store
                return _transferCommandService.CreateInventoryTransferRequest(request);
            }
            else
            {
                //When a user create a transfer out from his store to another store
                return _transferCommandService.CreateInventoryTransferOut(request);
            }
        }

        private UpdateInventoryUnitCostRequest GetUpdateInventoryUnitCostRequest(Int64 entityId,
            IEnumerable<UpdateCostViewModel> updateCostItems)
        {
            return new UpdateInventoryUnitCostRequest
            {
                EntityId = entityId,
                Items = Mapper.Map<IEnumerable<UpdateInventoryUnitCostRequestItem>>(updateCostItems)
            };
        }

        private void UpdateTransferStatus(Models.Transfer transfer, Boolean isApproved, String reason)
        {
            var updateTransferStatusRequest = new UpdateTransferStatusRequest()
            {
                Id = transfer.Id,
                UserName = _authenticationService.User.FormatNameFirstLastId(),
                Comment = reason,
                IsApproved = isApproved
            };
            if (transfer.Direction == TransferDirection.TransferIn)
            {
                //When a user receive a pending transfer to his store (transfer is already sent)
                //Need to update stock for his store only.
                _transferCommandService.UpdateTransferStatusForPendingTransfer(updateTransferStatusRequest);
            }
            else
            {
                //When a user approve a transfer request from his store to another store
                //Need to update stock for his store and the receiving store.
                _transferCommandService.UpdateInventoryMovementForSendingStore(updateTransferStatusRequest);
                _transferCommandService.UpdateStatusForReceivingStore(updateTransferStatusRequest);
            }
        }

        private void UpdateInventoryTransferQtys(Models.Transfer transfer)
        {
            if (!transfer.Details.Any())
            {
                return;
            }

            var inventoryTransferRequestItems = _mappingEngine.Map<IEnumerable<UpdateInventoryTransferRequestItem>>(transfer.Details);

            var request = new UpdateInventoryTransferRequest
            {
                Id = transfer.Id,
                TransferToEntityId = transfer.RequestingEntityId,
                Items = inventoryTransferRequestItems,
                RequestedBy = _authenticationService.User.FormatNameFirstLastId()
            };

            _transferCommandService.UpdateInventoryTransfer(request);
        }

        private void EnsurePermission()
        {
            var requiredTasks = new[]
            {
                Task.Inventory_Transfers_CanRequestTransferIn,
                Task.Inventory_Transfers_CanCreateTransferOut
            };

            var user = _authenticationService.User;
            if (!requiredTasks.Intersect(user.Permission.AllowedTasks).Any())
            {
                throw new HttpResponseException(HttpStatusCode.Forbidden);
            }
        }
        private void EnsurePeriodStatus(Int64 sendingEntityId, Int64 recievingEntityID)
        {
            var isPeriodClosed = false;

            var user = _authenticationService.User;

            var currentStoreTime = _entityTimeQueryService.GetCurrentStoreTime(sendingEntityId);

            //Sending Entity
            var periodRequest = new PeriodCloseRequest 
            {
                EntityId = sendingEntityId,
                CalendarDay = currentStoreTime.Date
            };
            var period = _periodCloseQueryService.GetForDate(periodRequest);
            if (period.IsClosed)
            {
                isPeriodClosed = true;   
            }

            //Recieving entity
            periodRequest = new PeriodCloseRequest
            {
                EntityId = recievingEntityID,
                CalendarDay = currentStoreTime.Date
            };
            period = _periodCloseQueryService.GetForDate(periodRequest);
            if (period.IsClosed)
            {
                isPeriodClosed = true;
            }

            if (isPeriodClosed && !user.Permission.HasPermission(Task.Waste_CanEditClosedPeriods))
            {
                throw new HttpResponseException(HttpStatusCode.Forbidden);
            }
        }
    }
}