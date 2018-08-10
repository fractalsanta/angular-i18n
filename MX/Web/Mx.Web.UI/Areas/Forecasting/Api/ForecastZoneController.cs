using AutoMapper;
using System.Collections.Generic;
using Mx.Forecasting.Services.Contracts.QueryServices;
using Mx.Foundation.Services.Contracts.QueryServices;
using Mx.Services.Shared.Contracts.Constants;
using Mx.Web.UI.Areas.Forecasting.Api.Models;
using Mx.Web.UI.Config.WebApi;

namespace Mx.Web.UI.Areas.Forecasting.Api
{
    public class ForecastZoneController : RESTController
    {
        private readonly IZoneQueryService _zoneQueryService;
        private readonly IMappingEngine _mapper;

        public ForecastZoneController(IZoneQueryService zoneQueryService,
            IMappingEngine mapper,
            IUserAuthenticationQueryService authService)
            :base(authService)
        {
            _zoneQueryService = zoneQueryService;
            _mapper = mapper;
        }

        public IEnumerable<Zone> GetForecastZones()
        {
            return _mapper.Map<IEnumerable<Zone>>(_zoneQueryService.GetByZoneType(ZoneTypeName.Forecasting));
        }
    }
}
