using System.Collections.Generic;
using System.Web.Http;
using AutoMapper;
using Mx.Foundation.Services.Contracts.QueryServices;
using Mx.Foundation.Services.Contracts.Responses;
using Mx.Web.UI.Areas.Inventory.Waste.Api.Models;

namespace Mx.Web.UI.Areas.Inventory.Waste.Api
{
    public class WasteReasonController : ApiController
    {
        private readonly IDropDownListQueryService _dropDownListQueryService;
        private readonly IMappingEngine _mapper;

        public WasteReasonController(
            IDropDownListQueryService ddlQueryService,
            IMappingEngine mapper)
        {
            _dropDownListQueryService = ddlQueryService;
            _mapper = mapper;
        }

        public IEnumerable<DropKeyValuePair> Get()
        {
            var reasons = _dropDownListQueryService.GetByListId((int)DropDownListId.Waste);
            return _mapper.Map<IEnumerable<DropDownListItemResponse>, IEnumerable<DropKeyValuePair>>(reasons);
        }

        //Inherited from legacy project
        public enum DropDownListId
        {
            Waste = 49
        }

    }
}