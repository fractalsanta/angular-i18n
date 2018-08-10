using Mx.Services.Shared.Contracts.Enums;
using Mx.Services.Shared.Contracts.Services;
using Mx.Web.UI.Areas.Administration.Settings.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Services;
using System.Net;
using System.Web.Http;

namespace Mx.Web.UI.Areas.Administration.Settings.Api
{
    public class InventoryCountSettingsController : ApiController
    {
        private readonly IConfigurationService _configService;
        private readonly IAuthorizationService _authorizationService;

        public InventoryCountSettingsController(IConfigurationService configurationService, IAuthorizationService authorizationService)
        {
            _configService = configurationService;
            _authorizationService = authorizationService;
        }


        public InventoryCountSettingsViewModel GetInventoryCountSettings()
        {
            var inventoryCountSettingsViewModel = new InventoryCountSettingsViewModel
            {
                PendingColor = _configService.GetConfiguration(ConfigurationEnum.Inventory_Counts_Settings_VarianceColorPending).As<string>(),
                OutOfToleranceColor = _configService.GetConfiguration(ConfigurationEnum.Inventory_Counts_Settings_VarianceColorOutOfTolerance).As<string>(),
                CountedColor = _configService.GetConfiguration(ConfigurationEnum.Inventory_Counts_Settings_VarianceColorCounted).As<string>()
            };

            return inventoryCountSettingsViewModel;
        }
        
        public void PostInventoryCountSettings([FromBody] InventoryCountSettingsViewModel inventoryCountSettings)
        {
            if (!_authorizationService.HasAuthorization(Task.Administration_Settings_InventoryCount_CanAccess))
                throw new HttpResponseException(HttpStatusCode.Forbidden);

            _configService.SetConfiguration(ConfigurationEnum.Inventory_Counts_Settings_VarianceColorPending, inventoryCountSettings.PendingColor);
            _configService.SetConfiguration(ConfigurationEnum.Inventory_Counts_Settings_VarianceColorOutOfTolerance, inventoryCountSettings.OutOfToleranceColor);
            _configService.SetConfiguration(ConfigurationEnum.Inventory_Counts_Settings_VarianceColorCounted, inventoryCountSettings.CountedColor);
        }
    }
}