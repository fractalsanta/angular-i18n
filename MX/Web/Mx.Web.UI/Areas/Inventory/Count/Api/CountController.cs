using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web.Http;
using AutoMapper;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Foundation.Services.Contracts.QueryServices;
using Mx.Inventory.Services.Contracts.CommandServices;
using Mx.Inventory.Services.Contracts.Enums;
using Mx.Inventory.Services.Contracts.QueryServices;
using Mx.Inventory.Services.Contracts.Requests;
using Mx.Services.Shared.Contracts;
using Mx.Services.Shared.Contracts.Enums;
using Mx.Services.Shared.Contracts.Services;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Areas.Inventory.Count.Api.Models;
using Mx.Web.UI.Config.WebApi;
using Mx.Web.UI.Config.Helpers;
using Task = Mx.Web.UI.Areas.Core.Api.Models.Task;


namespace Mx.Web.UI.Areas.Inventory.Count.Api
{
    [Permission(Task.Inventory_InventoryCount_CanView)]
    public class CountController : ApiController
    {
        private const String TranslationPageName = "InventoryCount";

        private readonly IMappingEngine _mapper;
        private readonly IEntityTimeQueryService _entityTimeQueryService;
        private readonly IStockCountLocationQueryService _stockCountLocation;
        private readonly IStockCountLocationCommandService _stockCountLocationCommandService;
        private readonly IAuthenticationService _authenticationService;
        private readonly IOrderQueryService _orderQueryService;
        private readonly IConfigurationService _configurationService;
        private readonly ILocalisationQueryService _localisationQueryService;
        private readonly IVendorEntityItemQueryService _vendorItemQueryService;
        private readonly IMappingEngine _mappingEngine;


        public CountController(
            IMappingEngine mapper,
            IEntityTimeQueryService entityTimeQueryService,
            IStockCountLocationQueryService stockCountLocation,
            IStockCountLocationCommandService stockCountLocationCommandService,
            IAuthenticationService authenticationService,
            IOrderQueryService orderQueryService,
            IConfigurationService configurationService,
            ILocalisationQueryService localisationQueryService,
            IVendorEntityItemQueryService vendorItemQueryService,
            IMappingEngine mappingEngine)
        {
            _mapper = mapper;
            _entityTimeQueryService = entityTimeQueryService;
            _stockCountLocation = stockCountLocation;
            _stockCountLocationCommandService = stockCountLocationCommandService;
            _authenticationService = authenticationService;
            _orderQueryService = orderQueryService;
            _configurationService = configurationService;
            _localisationQueryService = localisationQueryService;
            _vendorItemQueryService = vendorItemQueryService;
            _mappingEngine = mappingEngine;
        }

        public InventoryCount Get(
            [FromUri]CountType countType,
            [FromUri]Int64 entityId,
            [FromUri]Int64? countId)
        {
            var user = _authenticationService.User;
            var requestTime = _entityTimeQueryService.GetCurrentStoreTime(entityId);
            var request = new GetCountRequest
            {
                EntityId = entityId,
                UserId = user.Id,
                UserName = user.UserName,
                CountTypeId = (Int32)countType,
                RequestTime = requestTime,
                CountTypeTranslatedName = Translate(countType.ToString()),
                CountId = null
            };

            if (CanCheckForPendingOrders(user))
            {
                var countInProgress = _stockCountLocation.CheckIfCountInProgress(entityId, (Int32)countType);

                if (!countInProgress)
                {
                    var hasPlacedOrders = _orderQueryService.CheckIfOutstandingOrdersExist(entityId, requestTime);

                    if (hasPlacedOrders)
                    {
                        // don't create or return new counts, just return an empty models with the orders flag set to true
                        return new InventoryCount { HasPlacedOrders = true, Locations = new CountLocation[] { } };
                    }
                }
            }
            var count = _stockCountLocation.GetExistingOrNewCount(request);

            var result = _mapper.Map<InventoryCount>(count);
            result.HasPlacedOrders = false;
            result.EntityId = entityId;
            result.CountName = request.CountTypeTranslatedName;

            // Don't show the areas without items.
            var locations = result.Locations.Where(l => l.Items.Any()).ToList();

            // Place system locations on top; don't change the rest of the order.
            var orderedLocations = locations
                .Where(l => l.SystemLocation)
                .Union(locations.Where(l => !l.SystemLocation))
                .ToList();

            result.Locations = orderedLocations;
            result.IsApplyDateReadOnly = IsApplyDateReadOnly();
            result.LocalStoreDateTime = GetLocalStoreDateTime(entityId);

            ApplicationHub.CountStateChanged(entityId);
            return result;
        }

        private Boolean CanCheckForPendingOrders(BusinessUser user)
        {
            // if the user does not have access to receive orders the business rule is to not check
            return _configurationService.GetConfiguration(ConfigurationEnum.StockCount_ShowPopupForPendingOrders).As<Boolean>()
                && user.Permission.HasPermission(Task.Inventory_Ordering_Receive_CanView)
                && user.Permission.HasPermission(Task.Inventory_Receiving_CanReceive);
        }

        [Permission(Task.Inventory_InventoryCount_CanUpdate)]
        public void Delete(
            [FromUri] CountType countType,
            [FromUri] Int64 countId,
            [FromUri] Int64 entityId,
            [FromUri] String connectionId
            )
        {
            var user = (BaseIdentity)User.Identity;

            var auditUser = _mappingEngine.Map<AuditUser>(_authenticationService.User);

            _stockCountLocationCommandService.DeleteOpenCounts(entityId, (StockCountType)countType, auditUser);
            ApplicationHub.CountDeleted(entityId, connectionId, countId, user.Name);
            ApplicationHub.CountStateChanged(entityId);
        }


        [Permission(Task.Inventory_InventoryCount_CanUpdate)]
        [ClientTimeout(30)]
        public List<UpdatedItemCountStatus> PutCount(
            [FromBody] List<CountUpdate> countUpdates,
            [FromUri] Int64 entityId,
            [FromUri] String connectionId
            )
        {
            if (countUpdates.Any())
            {
                var countId = countUpdates[0].CountId;
                var isCountOpen = _stockCountLocation.CheckIfCountIsOpen(countId);
                if (!isCountOpen)
                {
                    throw new HttpResponseException(HttpStatusCode.Conflict);
                }
            }
            
            var result = new List<UpdatedItemCountStatus>();

            countUpdates.ForEach(countUpdate =>
            {
                var request = Mapper.Map<UpdateCountDetailRequest>(countUpdate);
                var storeTime = _entityTimeQueryService.GetCurrentStoreTime(entityId);
                request.RequestTime = storeTime;
                _stockCountLocationCommandService.UpdateCountDetail(entityId, request);

                var countstatus = CountStatus.Partial;
                if (!countUpdate.ReadyToApply)
                {
                    countstatus = CountStatus.NotCounted;
                }
                else if (countUpdate.CheckVariance)
                {
                    var countItemVariance = _stockCountLocation.GetCountItemVariance(entityId, countUpdate.CountId, countUpdate.ItemId, storeTime);
                    countstatus = countItemVariance.HasVariance ? CountStatus.Variance : CountStatus.Counted;
                    countUpdate.VariancePercent = countItemVariance.VariancePercent;
                }

                result.Add(new UpdatedItemCountStatus
                {
                    CountStatus = countstatus,
                    CountUpdate = countUpdate
                });

            });

            ApplicationHub.ItemsOfflineUpdated(entityId, connectionId, result);
            return result; 
        }

        public Boolean GetCheckIfCountApplied([FromUri] Int64 countId)
        {
            var result = _stockCountLocation.CheckIfCountApplied(countId);

            return result;
        }

        private String Translate(String key)
        {
            var user = _authenticationService.User;
            var translations = _localisationQueryService.GetPageTranslation(TranslationPageName, user.Culture);

            return !translations.ContainsKey(key) ? key : translations[key];
        }

        private bool IsApplyDateReadOnly()
        {
            var value = (StockCountApplyDateConfiguration)_configurationService.GetConfiguration(ConfigurationEnum.Inventory_Counts_CountApplyDateTimeSelectionMethod).As<int>();
            
            switch (value)
            {
                case StockCountApplyDateConfiguration.AllowEntry:
                case StockCountApplyDateConfiguration.ClientSpecific:
                    return false;

                case StockCountApplyDateConfiguration.UseStoreTime:
                    return true;
                
                default:
                    return false;
                
            }
        }
        
        private string GetLocalStoreDateTime(long entityId)
        {
            return _entityTimeQueryService.GetCurrentStoreTime(entityId).DateStr();
        }

        public IEnumerable<CountItem> GetEntityItemsAndVendorEntityItemsNotInCurrentCount([FromUri]Int64 entityId, [FromUri]Int64 countId, [FromUri]Int64 locationId, [FromUri]Int16 stockCountItemType, [FromUri] String search)
        {
            var vendorEntityItems = _mapper.Map<IEnumerable<CountItem>>(_stockCountLocation.SearchDisabledItemsNotInCountByEntityId(entityId, countId, locationId, (StockCountItemType)stockCountItemType, search));
            return vendorEntityItems;
        }

        public void PostUpdateCountWithCountItems([FromUri] Int64 entityId, [FromUri] Int64 countId, [FromUri]Int64 locationId, [FromBody] List<CountItem> countItems, Int16 countType)
        {
            var updateCountRequests = _mapper.Map <IEnumerable<UpdateCountDetailRequest>>(countItems);
            var updateCountDetailRequests = updateCountRequests as UpdateCountDetailRequest[] ?? updateCountRequests.ToArray();

            var auditUser = _mappingEngine.Map<AuditUser>(_authenticationService.User);

            foreach (var updateRequest in updateCountDetailRequests)
            {
                updateRequest.CountId = countId;
                updateRequest.LocationId = locationId;
                updateRequest.AuditUser = auditUser;
            }
            _stockCountLocationCommandService.AddDisabledItemsToCount(entityId, updateCountDetailRequests, (StockCountType)countType);
        }
    }
}
