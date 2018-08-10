using System;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Foundation.Services.Contracts.QueryServices;
using Mx.Reporting.Services.Contracts.CommandServices;
using Mx.Services.Shared.Exceptions;
using Mx.Web.UI.Config.WebApi;

namespace Mx.Web.UI.Areas.Forecasting.Api
{
    public class ReportMeasureGenerationController : RESTController
	{
        private IEntityQueryService _entityQueryService;
        private IDashboardReportCommandService _dashboardReportCommandService;

        public ReportMeasureGenerationController(
            IUserAuthenticationQueryService userAuthenticationQueryService,
            IEntityQueryService entityQueryService,
            IDashboardReportCommandService dashboardReportCommandService)
            : base(userAuthenticationQueryService)
		{
            _entityQueryService = entityQueryService;
            _dashboardReportCommandService = dashboardReportCommandService;
        }

        public void Post(Int64 entityId, DateTime businessDay)
        {
            var entity = _entityQueryService.GetById(entityId);
            if (entity == null)
                throw new MissingResourceException(String.Format("Entity {0} not found.", entityId));

            if (businessDay == DateTime.MinValue)
            {
                businessDay = DateTime.Today;
            }
            _dashboardReportCommandService.CreateMeasuresForStoreForDay(entityId, entity.TypeId, entity.ParentId, businessDay);
        }
	}
}
