using System;
using System.Collections.Generic;
using System.Web.Http;
using AutoMapper;
using Mx.Inventory.Services.Contracts.QueryServices;
using Mx.Web.UI.Areas.Inventory.Order.Api.Models;

namespace Mx.Web.UI.Areas.Inventory.Order.Api
{
    public class VendorController : ApiController
    {
        private readonly IMappingEngine _mappingEngine;
        private readonly IVendorQueryService _vendorQueryService;

        public VendorController(
            IMappingEngine mappingEngine,
            IVendorQueryService vendorQueryService)
        {
            _mappingEngine = mappingEngine;
            _vendorQueryService = vendorQueryService;
        }

        public IEnumerable<Vendor> Get([FromUri] Int64 entityId)
        {
            var vendors = _vendorQueryService.GetByEntity(entityId);

            return _mappingEngine.Map<IEnumerable<Vendor>>(vendors);
        }
    }
}