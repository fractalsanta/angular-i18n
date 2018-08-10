using System;
using System.Collections.Generic;
using System.Web.Http;
using AutoMapper;
using Mx.Inventory.Services.Contracts.QueryServices;
using Mx.Web.UI.Areas.Inventory.Count.Api.Models;
using Mx.Web.UI.Config.WebApi;
using Task = Mx.Web.UI.Areas.Core.Api.Models.Task;


namespace Mx.Web.UI.Areas.Inventory.Count.Api
{
    [Permission(Task.Inventory_InventoryCount_CanView)]
    public class CountVarianceController : ApiController
    {        
        private readonly IMappingEngine _mapper;
        private readonly IStockCountLocationQueryService _stockCountLocation;

        public CountVarianceController(IMappingEngine mapper, IStockCountLocationQueryService stockCountLocation)
        {
            _mapper = mapper;
            _stockCountLocation = stockCountLocation;
        }

        public List<CountItemVariance> GetCountItemsVariances([FromUri] Int64 entityId, [FromUri] Int64 countId)
        {
            var variances = _stockCountLocation.GetCountItemsVariances(entityId, countId);
            return _mapper.Map<List<CountItemVariance>>(variances);
        }
    }
}
