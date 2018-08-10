using System;
using System.Collections.Generic;
using System.Web.Http;
using AutoMapper;
using Mx.Inventory.Services.Contracts.QueryServices;
using Mx.Web.UI.Areas.Inventory.Count.Api.Models;

namespace Mx.Web.UI.Areas.Inventory.Count.Api
{
    public class CountTypeController : ApiController
    {
        private readonly IStockCountLocationQueryService _stockCountLocationQueryService;
        private readonly IMappingEngine _mapper;

        public CountTypeController(
            IStockCountLocationQueryService stockCountLocationQueryService,
            IMappingEngine mapper
            )
        {
            _stockCountLocationQueryService = stockCountLocationQueryService;
            _mapper = mapper;
        }

        // GET api/<controller>/5
        public IEnumerable<CountStatusResponse> Get(Int64 entityId)
        {
            return _mapper.Map<IEnumerable<CountStatusResponse>>(_stockCountLocationQueryService.GetCountStatus(entityId));
        }
    }
}