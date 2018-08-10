using System.Web.Http;
using Mx.OperationalReporting.Services.Contracts.QueryServices;
using Mx.OperationalReporting.Services.Contracts.Requests;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Areas.Operations.Reporting.Api.Models;
using Mx.Web.UI.Areas.Operations.Reporting.Api.Services;
using Mx.Web.UI.Config.Helpers;
using Mx.Web.UI.Config.WebApi;
using System.Collections.Generic;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Services.Shared.Exceptions;
using System;
using System.Linq;
using AutoMapper;
using Mx.Web.UI.Areas.Operations.Reporting.Api.Interfaces;

namespace Mx.Web.UI.Areas.Operations.Reporting.Api
{
    [Permission(Task.Operations_StoreSummary_CanAccess)]
    public class ProductController : ApiController, IProductController
    {
        private readonly IReportService _reportService;
        private readonly IReportMappingService _reportMappingService;
        private readonly IEntityService _entityService;
        private readonly IEntityQueryService _entityQueryService;
        private readonly IAuthenticationService _authService;
        private readonly IReportExportService _reportExportService;
        private readonly IMappingEngine _mapper;

        public ProductController(IReportService reportService,
            IReportMappingService reportMappingService,
            IEntityService entityService,
            IEntityQueryService entityQueryService,
            IAuthenticationService authService,
            IReportExportService reportExportService,
            IMappingEngine mapper)
        {
            _reportService = reportService;
            _reportMappingService = reportMappingService;
            _entityService = entityService;
            _entityQueryService = entityQueryService;
            _authService = authService;
            _reportExportService = reportExportService;
            _mapper = mapper;
        }

        public ProductData Get([FromUri]long entityId, string dateFrom, string dateTo, ReportType reportType, int? viewId = null, string searchText = null)
        {
            var entity = _entityQueryService.GetById(entityId);
            
            if(entity == null){
                throw new MissingResourceException();
            }

            IEnumerable<EntityModel> entities;

            if(entity.TypeId != (Int64)EntityType.Store){
                entities =  Mapper.Map<IEnumerable<EntityModel>>(_entityQueryService
                    .GetEntitiesHierarchyForUser(_authService.UserId, (Int64)EntityType.Store)
                    .Where(x => x.TypeId == (Int64)EntityType.Store && x.ParentId == entityId));
            }
            else
            {
                entities = new List<EntityModel>() { Mapper.Map<EntityModel>(entity) };
            }

            var request = new ReportRequest
            {
                ReportType = (OperationalReporting.Services.Contracts.Enums.ReportType)reportType,
                EntityIds = entities.Select(x => x.Id).ToList(),
                ViewId = viewId,
                // ReSharper disable PossibleInvalidOperationException
                DateFrom = dateFrom.AsDateTime().Value,
                DateTo = dateTo.AsDateTime().Value,
                // ReSharper restore PossibleInvalidOperationException
                SearchText = searchText == null ? string.Empty : searchText.Trim().ToUpperInvariant()
            };

            var res = _reportService.GetProduct(entityId, request) ?? _reportService.GetProduct(_entityService.CorporateEntityId(), request);
            if (res == null)
            {
                return null;
            }

            var result = _reportMappingService.Map(res, request);

            result.CurrentEntity = _mapper.Map<EntityModel>(entity);
            result.ExportFileName = _reportExportService.GenerateExportFileName(entityId, res.ViewName, reportType);

            return result;
        }
    }
}