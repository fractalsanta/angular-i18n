using System;
using Mx.Web.UI.Config.T4;

namespace Mx.Web.UI.Areas.Core.Api.Models
{
    [MapToTypeScript]
    public class SystemSettings
    {
        public long Id { get; set; }
        public long CurrencyId { get; set; }
        public String CurrentFiscalYear { get; set; }
        public int? CurrentPeriodDetailNum { get; set; }
        public DateTime? CurrentStartDate { get; set; }
        public DateTime? CurrentEndDate { get; set; }
        public int? CurrentPeriodNo { get; set; }
        public long? TaxCode { get; set; }
        public Single? CurrencyConversionRate { get; set; }
        public Currency Currency { get; set; }
    }
}