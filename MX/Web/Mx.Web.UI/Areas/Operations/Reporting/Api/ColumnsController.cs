using System;
using System.Linq;
using System.Web.Http;
using Mx.OperationalReporting.Services.Contracts.QueryServices;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Areas.Operations.Reporting.Api.Models;
using Mx.Web.UI.Areas.Operations.Reporting.Api.Services;
using Mx.Web.UI.Config.Translations;

namespace Mx.Web.UI.Areas.Operations.Reporting.Api
{
    public class ColumnsController : ApiController
    {
        private readonly IReportColumnNameLocalisationService _reportColumnNameLocalisationService;
        private readonly IReportService _reportService;
        private readonly ITranslationService _translationService;
        private readonly IAuthenticationService _authenticationService;
        private readonly IReportAttributeService _reportAttrService;

        public ColumnsController(IReportColumnNameLocalisationService reportColumnNameLocalisationService,
            IReportService reportService,
            ITranslationService translationService, IAuthenticationService authenticationService,
            IReportAttributeService reportAttrService)
        {
            _reportColumnNameLocalisationService = reportColumnNameLocalisationService;
            _reportService = reportService;
            _translationService = translationService;
            _authenticationService = authenticationService;
            _reportAttrService = reportAttrService;
        }

        /// <summary>
        /// return a list of columns and there localisation key for report.
        /// </summary>
        /// <remarks>
        /// This implementation ignores reportType as we only have one value.
        /// Will be implemented when we have extra report types.
        /// </remarks>
        public ColumnResponse Get(ReportType reportType)
        {
            _reportAttrService.CheckUserCanAccessViewManager(reportType);

            switch (reportType)
            {
                case ReportType.StoreSummary:
                    return TranslatedEnum<StoreSummary.Api.Models.L10N>(reportType);

                case ReportType.AreaSummary:
                    return TranslatedEnum<AreaSummary.Api.Models.L10N>(reportType);

                case ReportType.InventoryMovement:
                    return TranslatedEnum<InventoryMovement.Api.Models.L10N>(reportType);

                case ReportType.ProductMix:
                    return TranslatedEnum<ProductMix.Api.Models.L10N>(reportType);

                default:
                    throw new Exception("Report type is not defined " + reportType);
            }
        }

        private ColumnResponse TranslatedEnum<T>(ReportType reportType) where T : new()
        {
            var columnReponse = new ColumnResponse();

            var user = _authenticationService.User;
            var tran = _translationService.Translate<T>(user.Culture);
            var res = _reportColumnNameLocalisationService.GetColumnLocalisationMap(reportType);
            columnReponse.Columns = res.Select(x => new ReportColumnName
            {
                ColumnId = x.Key,
                ColumnName = tran.GetType()
                    .GetProperties()
                    .Single(pi => pi.Name == x.Value)
                    .GetValue(tran, null).ToString()
            }).OrderBy(x=>x.ColumnName.ToLower()).ToList();

           columnReponse.DefaultColumnIds = _reportService.GetDefaultReportViewColumns((OperationalReporting.Services.Contracts.Enums.ReportType)reportType);

            return columnReponse;
        }


    }
}