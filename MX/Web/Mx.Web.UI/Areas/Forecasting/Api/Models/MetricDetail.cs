using System;
using Mx.Forecasting.Services.Contracts.Responses;
using Mx.Web.UI.Config.Mapping;

namespace Mx.Web.UI.Areas.Forecasting.Api.Models
{
    [MapFrom(typeof(MetricDetailResponse))]
    public class MetricDetail
    {
        public Int64? SalesItemId { get; set; }
        public DateTime IntervalStart { get; set; }
        public Decimal SystemSales { get; set; }
        public Decimal ManagerSales { get; set; }
        public Decimal ActualSales { get; set; }
        public Decimal LastYearSales { get; set; }
        public Double SystemTransactionCount { get; set; }
        public Double ManagerTransactionCount { get; set; }
        public Double ActualTransactions { get; set; }
        public Double LastYearTransactionCount { get; set; }
        public DateTime BusinessDay { get; set; }
    }
}