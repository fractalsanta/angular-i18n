using System.Linq;
using AutoMapper;
using Mx.OperationalReporting.Services.Contracts.Requests;
using Mx.OperationalReporting.Services.Contracts.Responses;
using Mx.Web.UI.Areas.Operations.Reporting.Api.Models;
using Mx.Web.UI.Config.Helpers;
using System.Collections.Generic;
using ProductDetails = Mx.Web.UI.Areas.Operations.Reporting.Api.Models.ProductDetails;

namespace Mx.Web.UI.Areas.Operations.Reporting.Api.Services
{
    public class ReportMappingService : IReportMappingService
    {
        private readonly IMappingEngine _mapper;
        private readonly IReportColumnNameLocalisationService _reportColumnNameLocalisationService;

        public ReportMappingService(IMappingEngine mapper
            , IReportColumnNameLocalisationService reportColumnNameLocalisationService)
        {
            _mapper = mapper;
            _reportColumnNameLocalisationService = reportColumnNameLocalisationService;
        }

        public ReportData Map(ReportResponse source, ReportRequest req)
        {
            var reportData = _mapper.Map<ReportData>(source);

            reportData.DateFrom = req.DateFrom;
            reportData.DateTo = req.DateTo;

            var columnLocalisationMap = _reportColumnNameLocalisationService.GetColumnLocalisationMap((ReportType)req.ReportType);

            var range = reportData.DateFrom.Until(reportData.DateTo);

            foreach (var col in source.Columns)
            {
                var colLocal = col;
                var destCol = reportData.Columns.Single(c => c.ColumnId == col.ColumnId);

                destCol.ColumnLocalisationKey = columnLocalisationMap[destCol.ColumnId] ?? "";
                
                destCol.Values = destCol.Values ?? new List<object>();

                foreach (var entityId in source.EntityIds)
                {
                    destCol.Values = destCol.Values.Concat(range.AsEnumerable()
                        .Select(day => colLocal.Values.FirstOrDefault(c => c.Date.Date == day && c.Id == entityId))
                        .Select(val => val == null ? null : val.Value)
                        .ToList());
                }
            }

            return reportData;
        }

        public ProductData Map(ProductResponse source, ReportRequest req)
        {
            var reportData = new ProductData
            {
                Products = source.Products
                    .OrderBy(x => x.SortOrder)
                    .ThenBy(x => x.GroupDescription)
                    .ThenBy(x => x.ItemCode) // same order as in InventoryMovementRepository.Get(ReportRequest request, DateTime dateFrom, DateTime dateTo)
                    .Select(x => new ProductDetails
                    {
                        GroupId = x.GroupId,
                        Code = x.ItemCode,
                        Description = x.ItemDescription,
                    }),
                Columns = _mapper.Map<IEnumerable<ReportColumnData>>(source.Columns),
                Groups = source.Products.GroupBy(x => x.GroupId)
                    .Select(x => new ProductGroupDetails
                    {
                        GroupId = x.Key,
                        GroupDescription = x.First().GroupDescription,
                        SortOrder = x.First().SortOrder
                    }),
                ViewName = source.ViewName
            };

            var columnLocalisationMap = _reportColumnNameLocalisationService.GetColumnLocalisationMap((ReportType)req.ReportType);

            foreach (var col in source.Columns)
            {
                var destCol = reportData.Columns.Single(c => c.ColumnId == col.ColumnId);
                destCol.ColumnLocalisationKey = columnLocalisationMap[destCol.ColumnId] ?? "";
                destCol.Values = source.Columns.Single(x => x.ColumnId == destCol.ColumnId).Values.Select(x => x.Value).ToList();
            }
            return reportData;
        }

    }
}