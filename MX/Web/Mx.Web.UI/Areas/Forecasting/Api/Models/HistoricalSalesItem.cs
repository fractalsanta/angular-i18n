using System;
using Mx.Forecasting.Services.Contracts.Responses;
using Mx.Web.UI.Config.Mapping;

namespace Mx.Web.UI.Areas.Forecasting.Api.Models
{

    [MapFrom(typeof(ForecastSalesItemBasisResponse))]
    public class HistoricalSalesItem
    {
        public DateTime BusinessDate { get; set; }
        public DateTime IntervalStart { get; set; }
        public Int64 SalesItemId { get; set; }
        public Double Transactions { get; set; }
    }
}