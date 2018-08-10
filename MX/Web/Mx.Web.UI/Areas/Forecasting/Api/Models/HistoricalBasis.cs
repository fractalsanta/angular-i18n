using System;
using Mx.Forecasting.Services.Contracts.Responses;
using Mx.Web.UI.Config.Mapping;

namespace Mx.Web.UI.Areas.Forecasting.Api.Models
{
    [MapFrom(typeof(ForecastBasisResponse))]
    public class HistoricalBasis
    {
        public DateTime BusinessDate { get; set; }
        public DateTime IntervalStart { get; set; }
        public Decimal Sales { get; set; }
        public Double Transactions { get; set; }
    }
}