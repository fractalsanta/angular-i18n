using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using AutoMapper;
using Elmah;
using Mx.Inventory.Services.Contracts.CommandServices;
using Mx.Inventory.Services.Contracts.QueryServices;
using Mx.Inventory.Services.Contracts.Requests;
using Mx.Services.Shared.Contracts.Enums;
using Mx.Services.Shared.Contracts.Services;
using Mx.Web.UI.Areas.Inventory.Count.Api.Models;

namespace Mx.Web.UI.Areas.Inventory.Count.Api
{
    public class TravelPathController : ApiController
    {
        #region Private Members

        private readonly IInventoryLocationQueryService _locationQueryService;
        private readonly ITravelPathCommandService _travelPathCommandService;
        private readonly IConfigurationService _configurationService;

        #endregion

        #region Constructors

        public TravelPathController(IInventoryLocationQueryService locationQueryService, ITravelPathCommandService travelPathCommandService, IConfigurationService configurationService)
        {
            _locationQueryService = locationQueryService;
            _travelPathCommandService = travelPathCommandService;
            _configurationService = configurationService;
        }

        #endregion

        public TravelPathEntity GetTravelPathData(
             [FromUri] Int64 entityId)
        {
            var locationsByEntity = _locationQueryService.GetLocationsByEntity(entityId);
            var mappedLocations = Mapper.Map<IEnumerable<TravelPath>>(locationsByEntity).ToList();
            var reorderedLocations = mappedLocations
                .Where(l => l.LocationType == Constants.NewLocationType)
                .Union(mappedLocations.Where(l => l.LocationType != Constants.NewLocationType))
                .ToList();

            var travelPathEntity = new TravelPathEntity
            {
                EntityId = entityId,
                TravelPath = reorderedLocations,
                CanShowDisableCountForStockTakeUnits = _configurationService.GetConfiguration(ConfigurationEnum.Inventory_InventoryCount_ShowEnableCountStockTakeUnitOptions).As<Boolean>()
            };

            return travelPathEntity;
        }

        public TravelPath GetTravelPathDataForLocation([FromUri] Int64 entityId, [FromUri] Int64 locationId)
        {
            var location = _locationQueryService.GetLocationsByEntity(entityId).Single(x => x.Id == locationId);
            return Mapper.Map<TravelPath>(location);
        }

        public List<TravelPathPartialUpdate> PostUpdateTravelPath(
            [FromBody] UpdateTravelPath update
            , [FromUri] String connectionId
            , [FromUri] Int64 currentEntityId)
        {
            var updateResponse = _travelPathCommandService.UpdateTravelPath(Mapper.Map<UpdateTravelPathRequest>(update), currentEntityId);
            var response = new List<TravelPathPartialUpdate>();

            try
            {
                if (updateResponse.Success)
                {
                    var locationIds = new[] { update.LocationId, update.TargetLocationId }.Where(x => x != 0);
                    foreach (var locationId in locationIds)
                    {
                        response.Add(new TravelPathPartialUpdate
                        {
                            Id = locationId,
                            EntityId = currentEntityId
                        });
                        ApplicationHub.TravelPathDataUpdatedPartial(currentEntityId, locationId, connectionId);
                    }
                }                
            }
            catch (Exception ex)
            {
                ErrorLog.GetDefault(null).Log(new Error(ex));
            }

            return response;
        }
    }
}