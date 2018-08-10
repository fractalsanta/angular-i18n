using System.Web.Http;
using Mx.OperationalReporting.Services.Contracts.QueryServices;
using Mx.OperationalReporting.Services.Contracts.Requests;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Areas.Operations.Reporting.Api.Models;
using Mx.Web.UI.Areas.Operations.Reporting.Api.Services;
using Mx.Web.UI.Config.Helpers;
using Mx.Administration.Services.Contracts.QueryServices;
using System.Linq;
using AutoMapper;
using Mx.Administration.Services.Contracts.Responses;
using Mx.OperationalReporting.Services.Contracts.Responses;
using Mx.Web.UI.Areas.Core.Api.Models;


namespace Mx.Web.UI.Areas.Operations.Reporting.Api
{
    public class ReportController : ApiController
    {
        private readonly IReportService _reportService;
        private readonly IReportMappingService _reportMappingService;
        private readonly IEntityService _entityService;
        private readonly IAuthenticationService _authService;
        private readonly IReportAttributeService _reportAttrService;
        private readonly IReportEntitiesService _reportEntitiesService;
        private readonly IReportExportService _reportExportService;

        public ReportController(IReportService reportService,
            IReportMappingService reportMappingService,
            IEntityService entityService,
            IAuthenticationService authService,
            IReportAttributeService reportAttrService,
            IReportEntitiesService reportEntitiesService,
            IReportExportService reportExportService)
        {
            _reportService = reportService;
            _reportMappingService = reportMappingService;
            _entityService = entityService;
            _authService = authService;
            _reportAttrService = reportAttrService;
            _reportEntitiesService = reportEntitiesService;
            _reportExportService = reportExportService;
        }

        public ReportData Get([FromUri]string dateFrom, string dateTo, ReportType reportType, long? entityId = null, int? viewId = null)
        {
            _reportAttrService.CheckUserCanAccess(reportType);

            var entities = _reportEntitiesService.GetEntitiesFromEntityId(entityId);

            var request = new ReportRequest
            {
                ReportType = (OperationalReporting.Services.Contracts.Enums.ReportType)reportType,
                EntityIds = entities.Select(x => x.Id).ToList(),
                ViewId = viewId,
                // ReSharper disable PossibleInvalidOperationException
                DateFrom = dateFrom.AsDateTime().Value,
                DateTo = dateTo.AsDateTime().Value
                // ReSharper restore PossibleInvalidOperationException
            };

            ReportResponse res;
            if (_reportAttrService.GetReportViewType(reportType) == ReportViewType.ByEntity)
            {
                var corpEntityId = _entityService.CorporateEntityId();
                res = _reportService.GetReport(request, entityId.GetValueOrDefault(corpEntityId)) ?? _reportService.GetReport(request, corpEntityId);
            }
            else
            {
                if (reportType == ReportType.AreaSummary)
                {
                    request.AreaId = entityId.GetValueOrDefault();
                }
                res = _reportService.GetReport(request, null, _authService.UserId);
            }
            if (res == null)
            {
                return null;
            }

            var reportData = _reportMappingService.Map(res, request);
            reportData.Entities = entities;
            reportData.ExportFileName = _reportExportService.GenerateExportFileName(entityId, res.ViewName, reportType);

            return reportData;
        }

    }
}