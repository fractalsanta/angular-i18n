using System;
using System.Collections.Generic;
using Mx.OperationalReporting.Services.Contracts.Responses;
using Mx.Web.UI.Config.Converters;
using Mx.Web.UI.Config.Mapping;
using Newtonsoft.Json;
using Mx.Web.UI.Areas.Core.Api.Models;

namespace Mx.Web.UI.Areas.Operations.Reporting.Api.Models
{
    [MapFrom(typeof(ReportResponse))]
    public class ReportData
    {
        public IEnumerable<ReportColumnData> Columns { get; set; }
        public IEnumerable<EntityModel> Entities { get; set; }
        
        [JsonConverter(typeof(DateNoTimezoneConverter))]
        public DateTime DateFrom { get; set; }

        [JsonConverter(typeof(DateNoTimezoneConverter))]
        public DateTime DateTo { get; set; }
        public string ExportFileName { get; set; }
    }
}