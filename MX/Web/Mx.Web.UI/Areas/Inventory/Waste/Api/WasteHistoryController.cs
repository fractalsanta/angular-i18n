using System;
using System.Collections.Generic;
using System.Web.Http;
using AutoMapper;
using Mx.Inventory.Services.Contracts.CommandServices;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Inventory.Waste.Api.Models;
using Mx.Web.UI.Config.Helpers;
using Mx.Web.UI.Config.WebApi;

namespace Mx.Web.UI.Areas.Inventory.Waste.Api
{
    [Permission(Task.Inventory_Waste_History_CanView)]
    public class WasteHistoryController : ApiController
    {
        private readonly IWasteHistoryService _wasteHistoryService;
        private readonly IMappingEngine _mapper;

        public WasteHistoryController(IWasteHistoryService wasteHistoryService, IMappingEngine mapper)
        {
            _wasteHistoryService = wasteHistoryService;
            _mapper = mapper;
        }

        public IEnumerable<WasteHistoryItem> GetWasteHistory([FromUriAttribute] Int64 entityId,
            [FromUri] String fromDate,
            [FromUri] String toDate)
        {
            var startDate = fromDate.AsDateTime() ?? DateTime.Now;
            var endDate = toDate.AsDateTime() ?? DateTime.Now;
            var wasteItems = _wasteHistoryService.GetWasteHistory(entityId, startDate, endDate);
            var response = _mapper.Map<IEnumerable<WasteHistoryItem>>(wasteItems);

            return response;
        }
    }
}