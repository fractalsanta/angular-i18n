using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.RegularExpressions;
using System.Web.Http;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.OperationalReporting.Services.Contracts.QueryServices;
using Mx.OperationalReporting.Services.Contracts.Requests;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Areas.Operations.Reporting.Api.Models;
using Mx.Web.UI.Areas.Operations.Reporting.Api.Services;
using Mx.Web.UI.Config.Helpers;
using Mx.Web.UI.Config.WebApi;
using System;
using Mx.OperationalReporting.Services.Contracts.Responses;

namespace Mx.Web.UI.Areas.Operations.Reporting.Api
{
    [AllowAnonymous]
    [QueryStringAuthenticationFilter]
    public class ReportExportController : ApiController
    {
        private readonly IReportService _reportService;
        private readonly IReportMappingService _reportMappingService;
        private readonly IReportExportService _reportExportService;
        private readonly IAuthenticationService _authenticationService;
        private readonly IEntityQueryService _entityQueryService;
        private readonly IEntityTimeQueryService _entityTimeQueryService;
        private readonly IReportAttributeService _reportAttrService;
        private readonly IReportEntitiesService _reportEntitiesService;
        private readonly IEntityService _entityService;

        public ReportExportController(IReportService reportService,
            IReportExportService reportExportService,
            IReportMappingService reportMappingService,
            IAuthenticationService authenticationService,
            IEntityQueryService entityQueryService,
            IEntityTimeQueryService entityTimeQueryService,
            IReportAttributeService reportAttrService,
            IReportEntitiesService reportEntitiesService,
            IEntityService entityService
            )
        {
            _reportService = reportService;
            _reportExportService = reportExportService;
            _reportMappingService = reportMappingService;
            _authenticationService = authenticationService;
            _entityQueryService = entityQueryService;
            _entityTimeQueryService = entityTimeQueryService;
            _reportAttrService = reportAttrService;
            _reportEntitiesService = reportEntitiesService;
            _entityService = entityService;
        }

        public HttpResponseMessage Get([FromUri]string dateFrom, string dateTo, ReportType reportType, long? entityId = null, int? viewId = null)
        {
            _reportAttrService.CheckUserCanAccess(reportType);

            var entities = _reportEntitiesService.GetEntitiesFromEntityId(entityId);

            // ReSharper disable PossibleInvalidOperationException
            var startDate = dateFrom.AsDateTime().Value;
            var stopDate = dateTo.AsDateTime().Value;
            // ReSharper enable PossibleInvalidOperationException

            var user = _authenticationService.User;

            var request = new ReportRequest
            {
                ReportType = (OperationalReporting.Services.Contracts.Enums.ReportType)reportType,
                EntityIds =  entities.Select(x => x.Id).ToList(),
                ViewId = viewId,
                DateFrom = startDate,
                DateTo = stopDate
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
                res = _reportService.GetReport(request, null, _authenticationService.UserId);
            }

            var mapped = _reportMappingService.Map(res, request);

            var csv = (entities.Count() > 1 || !entityId.HasValue) ? 
                _reportExportService.ExportToCsv(mapped, user, entities, reportType) :
                _reportExportService.ExportToCsv(mapped, user, entityId.Value, reportType);

            var result = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(csv, Encoding.UTF8)
            };

            result.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment")
            {
                FileName = _reportExportService.GenerateExportFileName(entityId, res.ViewName, reportType)
            };

            result.Content.Headers.ContentType = new MediaTypeHeaderValue("text/csv");

            return result;
        }

        
    }
}