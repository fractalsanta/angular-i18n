using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Web.Http;
using AutoMapper;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Reporting.Services.Contracts.CommandServices;
using Mx.Reporting.Services.Contracts.QueryServices;
using Mx.Reporting.Services.Contracts.Requests;
using Mx.Reporting.Services.Contracts.Responses;
using Mx.Reporting.Services.Models.Enums;
using Mx.Services.Shared.Contracts.Enums;
using Mx.Services.Shared.Contracts.Services;
using Mx.Web.UI.Areas.Administration.Settings.Api.Models;
using Mx.Web.UI.Areas.Core.Api;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Services;

namespace Mx.Web.UI.Areas.Administration.Settings.Api
{
    public class SettingsController : ApiController
    {
        private readonly IDashboardReportQueryService _dashboardReportQueryService;
        private readonly IDashboardReportCommandService _dashboardReportCommandService;
        private readonly IMappingEngine _mapper;
        private readonly IAuthorizationService _authorizationService;
        private readonly IAuthenticationService _authenticationService;
        private readonly IEntityQueryService _entityQueryService;
        private readonly IConfigurationService _configService;

        public SettingsController(IDashboardReportQueryService dashboardReportQueryService, 
            IDashboardReportCommandService dashboardReportCommandService, 
            IMappingEngine mapper, 
            IAuthorizationService authorizationService, 
            IAuthenticationService authenticationService, 
            IEntityQueryService entityQueryService,
            IConfigurationService configurationService)
        {
            _dashboardReportQueryService = dashboardReportQueryService;
            _mapper = mapper;
            _authorizationService = authorizationService;
            _dashboardReportCommandService = dashboardReportCommandService;
            _authenticationService = authenticationService;
            _entityQueryService = entityQueryService;
            _configService = configurationService;
        }

        public IEnumerable<SettingGroup> GetMeasures([FromUri] SettingEnums type, [FromUri] long entityId)
        {
            IEnumerable<ReportMeasureConfigResponse> result = null;

            switch (type)
            {
                case SettingEnums.Application:
                    if (!_authorizationService.HasAuthorization(Task.Administration_Settings_Dashboard_Application_CanUpdate))
                        throw new HttpResponseException(HttpStatusCode.Forbidden);
                    result = _dashboardReportQueryService.GetDefaultMeasures().ToList();
                    break;
                case SettingEnums.Global:
                    if( !_authorizationService.HasAuthorization(Task.Administration_Settings_Dashboard_Global_CanUpdate))
                        throw new HttpResponseException(HttpStatusCode.Forbidden);
                    result = _dashboardReportQueryService.GetDefaultMeasures().Where(i => i.Visible || i.Enabled).ToList();
                    break;
                case SettingEnums.Store:
                    if (!_authorizationService.HasAuthorization(Task.Administration_Settings_Dashboard_Store_CanUpdate))
                        throw new HttpResponseException(HttpStatusCode.Forbidden);
                    result = _dashboardReportQueryService.GetStoreMeasures(entityId).Where(i => i.Visible || i.Enabled).ToList();
                    break;
            }

            var culture = _entityQueryService.GetCultureNameForEntity(entityId == 0 ? 1 : entityId); // for global culture use the top level entity

            if (result != null)
            {
                return result
                    .GroupBy(i => i.Group)
                    .Select(g => new SettingGroup
                    {
                        GroupId = g.Key,
                        Group = Enum.ToObject(typeof (MeasureGroupEnum), g.Key).ToString(),
                        Measures = g.Select(m => MapMeasure(m, culture)).ToArray()
                    })
                    .ToList();
            }
            return null;
        }

        private SettingMeasure MapMeasure(ReportMeasureConfigResponse m, String culture)
        {
            var measure = _mapper.Map<SettingMeasure>(m);

            var cultureInfo = new CultureInfo(culture);
            var numberFormatInfo = (NumberFormatInfo)cultureInfo.NumberFormat.Clone();

            measure.EditableToleranceMin = measure.ToleranceMin;
            measure.EditableToleranceMax = measure.ToleranceMax;

            switch (measure.ToleranceFormat)
            {
                case "c0":
                    measure.ToleranceSymbol = numberFormatInfo.CurrencySymbol;
                    measure.ToleranceFormatEnum = SettingToleranceFormatEnums.Currency;
                    break;
                case "p":
                    measure.ToleranceSymbol = "%";
                    measure.EditableToleranceMin = measure.ToleranceMin*100;
                    measure.EditableToleranceMax = measure.ToleranceMax * 100;
                    measure.ToleranceFormatEnum = SettingToleranceFormatEnums.Percentage;
                    break;
                case "n0":
                    measure.ToleranceSymbol = "";
                    measure.ToleranceFormatEnum = SettingToleranceFormatEnums.Number;
                    break;
            }

            if(measure.ToleranceFormat=="c0")

                measure.ToleranceSymbol = numberFormatInfo.CurrencySymbol;

            return measure;
        }

        public void POSTReportMeasureConfig([FromBody]SettingMeasure measure,[FromUri] string action)
        {
            switch (measure.SettingType)
            {
                case SettingEnums.Application:
                    if (!_authorizationService.HasAuthorization(Task.Administration_Settings_Dashboard_Application_CanUpdate))
                        throw new HttpResponseException(HttpStatusCode.Forbidden);
                    break;
                case SettingEnums.Global:
                    if (!_authorizationService.HasAuthorization(Task.Administration_Settings_Dashboard_Global_CanUpdate))
                        throw new HttpResponseException(HttpStatusCode.Forbidden);
                    break;
                case SettingEnums.Store:
                    if (!_authorizationService.HasAuthorization(Task.Administration_Settings_Dashboard_Store_CanUpdate))
                        throw new HttpResponseException(HttpStatusCode.Forbidden);
                    break;
            }

            if (action == "RESTORE"  && _authorizationService.HasAuthorization(Task.Administration_Settings_Dashboard_Store_CanUpdate))
            {
                var request = new RestoreDefaultForStoreRequest
                {
                    MeasureKey = measure.MeasureKey,
                    EntityId = measure.EntityId,
                };
                _dashboardReportCommandService.RestoreDefaultForStore(request);
            }
            else
            {
                var request = new ReportMeasureConfigRequest
                {
                    MeasureKey = measure.MeasureKey,
                    Enabled = measure.Enabled,
                    ToleranceMin = measure.ToleranceMin,
                    ToleranceMax = measure.ToleranceMax,
                    Visible = measure.Visible,
                    EntityId = measure.EntityId,
                };
                _dashboardReportCommandService.UpdateReportMeasureConfig(request);
            }

            
        }

        public IDictionary<ConfigurationSetting, String> GetConfigurationSettings([FromUri]ConfigurationSetting[] settings)
        {
            var result = new Dictionary<ConfigurationSetting, String>();

            foreach (var setting in settings)
            {
                result[setting] = _configService.GetConfiguration((ConfigurationEnum)setting).As<string>();
            }

            return result;
        }
    }
}