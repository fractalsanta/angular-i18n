using System.Web.Http;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Administration.Services.Contracts.CommandServices;
using Mx.Administration.Services.Contracts.Requests;
using Mx.Web.UI.Areas.Administration.Settings.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Config.WebApi;

namespace Mx.Web.UI.Areas.Administration.Settings.Api
{
    [Permission(Task.Administration_Settings_Site_CanAccess)]
    public class SiteSettingsController : ApiController
    {
        private readonly ISystemSettingsQueryService _systemSettingsQueryService;
        private readonly ISystemSettingsCommandService _systemSettingsCommandService;

        public SiteSettingsController(ISystemSettingsQueryService systemSettingsQueryService, ISystemSettingsCommandService systemSettingsCommandService)
        {
            _systemSettingsQueryService = systemSettingsQueryService;
            _systemSettingsCommandService = systemSettingsCommandService;
        }

        public SiteSettings GetSiteSettings()
        {
            var settings = new SiteSettings()
            {
                LoginColorScheme = _systemSettingsQueryService.GetSystemSettings().LoginColorScheme.GetValueOrDefault()
            };

            return settings;
        }

        public void PostSiteSettings([FromBody] SiteSettings settings)
        {
            var systemSettingsRequest = new SystemSettingsRequest()
            {
                LoginColorScheme = settings.LoginColorScheme
            };

            _systemSettingsCommandService.UpdateSystemSettings(systemSettingsRequest);
        }
    }
}