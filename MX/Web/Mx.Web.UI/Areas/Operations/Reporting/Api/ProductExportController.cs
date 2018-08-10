using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.RegularExpressions;
using System.Web.Http;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Areas.Operations.Reporting.Api.Interfaces;
using Mx.Web.UI.Areas.Operations.Reporting.Api.Models;
using Mx.Web.UI.Areas.Operations.Reporting.Api.Services;
using Mx.Web.UI.Config.WebApi;

namespace Mx.Web.UI.Areas.Operations.Reporting.Api
{
    [AllowAnonymous]
    [QueryStringAuthenticationFilter]
    [Permission(Task.Operations_InventoryMovement_CanAccess)]
    public class ProductExportController : ApiController
    {
        private readonly IReportExportService _reportExportService;
        private readonly IAuthenticationService _authenticationService;
        private readonly IEntityQueryService _entityQueryService;
        private readonly IEntityTimeQueryService _entityTimeQueryService;
        private readonly IProductController _productController;

        public ProductExportController(  IProductController productController,
            IReportExportService reportExportService,
            IAuthenticationService authenticationService,
            IEntityQueryService entityQueryService,
            IEntityTimeQueryService entityTimeQueryService
            )
        {
            _productController = productController;
            _reportExportService = reportExportService;
            _authenticationService = authenticationService;
            _entityQueryService = entityQueryService;
            _entityTimeQueryService = entityTimeQueryService;
        }

        public HttpResponseMessage Get([FromUri] long entityId, string dateFrom, string dateTo, ReportType reportType, int? viewId)
        {
            var data = _productController.Get(entityId, dateFrom, dateTo, reportType, viewId, string.Empty);
            var user = _authenticationService.User;

            var csv = _reportExportService.ExportToCsv(data, user, entityId, reportType);

            var result = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(csv, Encoding.UTF8)
            };

            result.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment")
            {
                FileName = CreateFileName(entityId, data.ViewName, reportType)
            };

            result.Content.Headers.ContentType = new MediaTypeHeaderValue("text/csv");

            return result;
        }

        private string CreateFileName(long entityId, string viewName, ReportType reportType)
        {
            viewName = string.IsNullOrEmpty(viewName) ? reportType.ToString() : viewName;
            var entity = _entityQueryService.GetById(entityId);
            var currentTime = _entityTimeQueryService.GetCurrentStoreTime(entityId);
            var fileName = string.Concat(string.Join("_", entity.Number, viewName, currentTime.ToString("yyyyMMdd")), ".csv");
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