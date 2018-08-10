using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Foundation.Services.Contracts.QueryServices;
using Mx.OperationalReporting.Services.Contracts.QueryServices;
using Mx.OperationalReporting.Services.Contracts.Requests;
using Mx.OperationalReporting.Services.Contracts.Responses;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Areas.Operations.Reporting.Api.Models;
using Mx.Web.UI.Config.Helpers;

namespace Mx.Web.UI.Areas.Operations.Reporting.Api.Services
{
    public class ReportExportService : IReportExportService
    {
        private Dictionary<string, string> _translations;
        private readonly IEntityQueryService _entityQueryService;
        private readonly ILocalisationQueryService _localisationQueryService;
        private readonly IReportAttributeService _reportAttrService;
        private readonly IReportEntitiesService _reportEntitiesService;
        private readonly IEntityService _entityService;
        private readonly IReportService _reportService;
        private readonly IAuthenticationService _authenticationService;
        private readonly IEntityTimeQueryService _entityTimeQueryService;
        

        private const String TranslationPageName = "OperationsReporting";

        public ReportExportService(
            IEntityQueryService entityQueryService, 
            ILocalisationQueryService localisationQueryService, 
            IReportAttributeService reportAttrService,
            IReportEntitiesService reportEntitiesService,
            IEntityService entityService,
            IReportService reportService,
            IAuthenticationService authenticationService,
            IEntityTimeQueryService entityTimeQueryService)
        {
            _entityQueryService = entityQueryService;
            _localisationQueryService = localisationQueryService;
            _reportAttrService = reportAttrService;
            _reportEntitiesService = reportEntitiesService;
            _entityService = entityService;
            _reportService = reportService;
            _authenticationService = authenticationService;
            _entityTimeQueryService = entityTimeQueryService;
        }


        // this is not intended to work in environments where the decimal delimiter is not ".". This method should be fixed if such support is required.
        // https://jira.hotschedules.com/browse/MX-13247
        public string ExportToCsv(ProductData data, BusinessUser user, long entityId, ReportType reportType)
        {
            InitialiseTranslations(user, reportType);

            var store = _entityQueryService.GetById(entityId);

            var groups = data.Groups.ToDictionary(x => x.GroupId);

            var sb = new StringBuilder();

            var columnNames = data.Columns.Select(column => Translate(column.ColumnLocalisationKey));
            sb.Append(string.Concat(
                Translate("ExportStoreName"), ",",
                Translate("Categories"), ",", 
                Translate("ColumnItemCode"), ",", 
                Translate("ColumnItemDescription"), ","
                ));
            sb.AppendLine(string.Join(",", columnNames));

            var index = 0;
            foreach (var product in data.Products)
            {

                var values = data.Columns.Select(column => EncodeCsvCell(column.Values.ElementAt(index), column.ColumnValueType));
                sb.Append(EncodeCsvCell(string.Concat(store.Number, "-", store.Name), ReportColumnValueType.String));
                sb.Append(",");

                sb.Append(EncodeCsvCell(groups[product.GroupId].GroupDescription, ReportColumnValueType.String));
                sb.Append(",");
                sb.Append(EncodeCsvCell(product.Code, ReportColumnValueType.String));
                sb.Append(",");
                sb.Append(EncodeCsvCell(product.Description, ReportColumnValueType.String));
                sb.Append(",");
                sb.AppendLine(string.Join(",", values));

                index++;
            }

            return sb.ToString();
        }

        // this is not intended to work in environments where the decimal delimiter is not ".". This method should be fixed if such support is required.
        // https://jira.hotschedules.com/browse/MX-13247
        public string ExportToCsv(ReportData report, BusinessUser user, long entityId, ReportType reportType)
        {
            InitialiseTranslations(user, reportType);

            var store = _entityQueryService.GetById(entityId);

            StringBuilder sb = new StringBuilder();

            IEnumerable<string> columnNames = report.Columns.Select(column => Translate(column.ColumnLocalisationKey));
            sb.Append(string.Concat(Translate("ColumnDate"), ",", Translate("ExportStoreName"), ","));
            sb.AppendLine(string.Join(",", columnNames));
            
            for (var i = 0; i < report.DateFrom.Until(report.DateTo).AsEnumerable().Count(); i ++)
            {
                var index = i;

                var values = report.Columns.Select(column => EncodeCsvCell(column.Values.ElementAt(index), column.ColumnValueType));

                sb.Append(string.Concat(EncodeCsvCell(report.DateFrom.AddDays(index).ToString("yyyy-MM-dd"), ReportColumnValueType.Date), ","));
                sb.Append(string.Concat(store.Number, "-", store.Name, ","));
                sb.AppendLine(string.Join(",", values));
            }

            return sb.ToString();
        }

        // this is not intended to work in environments where the decimal delimiter is not ".". This method should be fixed if such support is required.
        // https://jira.hotschedules.com/browse/MX-13247
        public string ExportToCsv(ReportData report, BusinessUser user, IEnumerable<EntityModel> entities, ReportType reportType)
        {
            InitialiseTranslations(user, reportType);

            StringBuilder sb = new StringBuilder();

            IEnumerable<string> columnNames = report.Columns.Select(column => Translate(column.ColumnLocalisationKey));
            sb.Append(string.Concat(Translate("ColumnStore"), ",", Translate("ColumnDate"), ","));
            sb.AppendLine(string.Join(",", columnNames));
            var index = 0;
            foreach(var store in entities)
            {
                for (var i = 0; i < report.DateFrom.Until(report.DateTo).AsEnumerable().Count(); i++)
                {
                    var values = report.Columns.Select(column => EncodeCsvCell(column.Values.ElementAt(index), column.ColumnValueType));

                    if (store.Name.Contains(store.Number))
                    {
                        sb.Append(string.Concat(store.Name.Replace(",", ""), ","));
                    }
                    else
                    {
                        sb.Append(string.Concat(store.Number, "-", store.Name.Replace(",", ""), ","));
                    }
                    sb.Append(string.Concat(EncodeCsvCell(report.DateFrom.AddDays(i).ToString("yyyy-MM-dd"), ReportColumnValueType.Date), ","));
                    sb.AppendLine(string.Join(",", values));
                    index++;
                }
            }
            return sb.ToString();
        }

        private string EncodeCsvCell(object input, ReportColumnValueType type)
        {
            if (input == null) return "";

            var value = input.ToString().Replace("\"", "\"\"");
            if (!IsNumeric(type))
            {
                value = string.Concat("\"", value, "\"");
            }
            return value;
        }

        private bool IsNumeric(ReportColumnValueType type)
        {
            return type == ReportColumnValueType.Currency ||
                   type == ReportColumnValueType.Decimal ||
                   type == ReportColumnValueType.Integer ||
                   type == ReportColumnValueType.Percentage;
        }

        private void InitialiseTranslations(BusinessUser user, ReportType report)
        {
            _translations = _localisationQueryService.GetPageTranslation(TranslationPageName + report, user.Culture);
        }

        private string Translate(string key)
        {
            return _translations.ContainsKey(key) ? _translations[key] : key;
        }

        public string GenerateExportFileName(long? entityId, string viewName, ReportType reportType)
        {
            viewName = string.IsNullOrEmpty(viewName) ? reportType.ToString() : viewName;
            var entity = entityId.HasValue ? _entityQueryService.GetById(entityId.Value) : null;
            var currentTime = entityId.HasValue ? _entityTimeQueryService.GetCurrentStoreTime(entityId.Value) : DateTime.Now;
            var fileName = entity != null ?
                string.Concat(string.Join("_", entity.Number, viewName, currentTime.ToString("yyyyMMdd")), ".csv") :
                string.Concat(string.Join("_", viewName, currentTime.ToString("yyyyMMdd")), ".csv");
            return SanitiseFileName(fileName);
        }
        private static string SanitiseFileName(string input)
        {
            string invalidChars = Regex.Escape(new string(Path.GetInvalidFileNameChars()));
            string invalidRegStr = string.Format(@"([{0}]*\.+$)|([{0}]+)", invalidChars);

            return Regex.Replace(input, invalidRegStr, "_");
        }
    }
}