using System;
using Mx.Forecasting.Services.Contracts.Responses;
using Mx.Web.UI.Config.Mapping;

namespace Mx.Web.UI.Areas.Forecasting.Api.Models
{
    [MapFrom(typeof(ForecastResponse))]
    public class Forecast
    {
        public Int64 Id { get; set; }
        public Int64 EntityId { get; set; }
        public Int32 ForecastStatus { get; set; }
        public DateTime BusinessDay { get; set; }
        public DateTime BusinessDayStart { get; set; }
        public DateTime BusinessDayEnd { get; set; }
        public DateTime GenerationDate { get; set; }
        public Decimal LastYearSales { get; set; }
        public Decimal ManagerSales { get; set; }
        public Double LastYearTransactionCount { get; set; }
        public Double ManagerTransactionCount { get; set; }
        public Int64 Version { get; set; }
        public Boolean IsDayLocked { get; set; }
        public Boolean HasBeenEdited { get; set; }
    }
}