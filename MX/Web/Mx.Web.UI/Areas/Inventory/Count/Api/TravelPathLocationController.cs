using System;
using System.Web.Http;
using Mx.Inventory.Services.Contracts.CommandServices;
using Mx.Inventory.Services.Contracts.Requests;
using Mx.Inventory.Services.Contracts.Responses;
using Mx.Web.UI.Areas.Inventory.Count.Api.Models;
using AutoMapper;

namespace Mx.Web.UI.Areas.Inventory.Count.Api
{
    public class TravelPathLocationController : ApiController
    {
        private readonly ITravelPathCommandService _travelPathCommandService;

        public TravelPathLocationController(ITravelPathCommandService travelPathCommandService)
        {
            _travelPathCommandService = travelPathCommandService;
        }

        public TravelPath PostAddLocation([FromUri] Int64 currentEntityId, [FromUri] String locationName, [FromUri] String connectionId)
        {
            var loc = new AddLocationRequest { EntityId = currentEntityId, Location = locationName };
            var newLocation = _travelPathCommandService.AddLocation(loc);
            var response = Mapper.Map<EntityLocationResponse, TravelPath>(newLocation);
            ApplicationHub.NewLocationReceived(currentEntityId, response, connectionId);
            return response;
        }

        public void PutLocation(
            [FromUri] Int64 locationId
            , [FromUri] Int64 currentEntityId
            , [FromUri] String newLocationName
            , [FromUri] Int64 targetLocationId
            , [FromUri] Int64 movingLocationId
            , [FromUri] Boolean activateLocation
            , [FromUri] Boolean deactivateLocation
            , [FromUri] Boolean renameLocation
            , [FromUri] Boolean resortLocation
            , [FromUri] String connectionId
            )
        {
            #region ActivateLocation
            if (activateLocation)
            {
                ActivateLocation(locationId, currentEntityId, connectionId);
            }
            #endregion

            #region DeactivateLocation
            if (deactivateLocation)
            {
                DeactivateLocation(locationId, currentEntityId, connectionId);
            }
            #endregion

            #region RenameLocation

            if (renameLocation)
            {
                RenameLocation(locationId, newLocationName, currentEntityId, connectionId);
            }

            #endregion

            #region Resort Location

            if (resortLocation)
            {
                ResortLocations(currentEntityId, targetLocationId, movingLocationId, connectionId);
            }

            #endregion
        }

        private void ResortLocations(Int64 currentEntityId, Int64 targetLocationId, Int64 movingLocationId, String connectionId)
        {
            var request = new UpdateLocationSortOrderRequest
            {
                EntityId = currentEntityId,
                MovingLocationId = movingLocationId,
                TargetId = targetLocationId
            };

            var locationIds = _travelPathCommandService.ResortLocation(request);
            ApplicationHub.ResortLocation(currentEntityId, locationIds, connectionId);
        }

        private void RenameLocation(Int64 locationId, String newLocationName, Int64 currentEntityId, String connectionId)
        {
            var renamedLocation = _travelPathCommandService.RenameLocation(locationId, newLocationName);
            var response = Mapper.Map<TravelPath>(renamedLocation);
            ApplicationHub.RenameLocation(currentEntityId, response, connectionId);
        }

        private void DeactivateLocation(Int64 locationId, Int64 currentEntityId, String connectionId)
        {
            var newLocation = _travelPathCommandService.DeactivateLocation(locationId);
            var response = Mapper.Map<TravelPath>(newLocation);
            ApplicationHub.DeActivateLocation(currentEntityId, response, connectionId);

        }

        private void ActivateLocation(Int64 locationId, Int64 currentEntityId, String connectionId)
        {
            var newLocation = _travelPathCommandService.ActivateLocation(locationId);
            var response = Mapper.Map<TravelPath>(newLocation);
            ApplicationHub.Group(currentEntityId).ActivateLocation(currentEntityId, response, connectionId);
        }

        public void DeleteLocation(Int64 locationId, Int64 currentEntityId, String connectionId)
        {
            DeactivateLocation(locationId, currentEntityId, connectionId);
        }
    }
}