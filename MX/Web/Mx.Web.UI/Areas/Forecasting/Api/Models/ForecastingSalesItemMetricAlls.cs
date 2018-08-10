using System;
using System.Collections.Generic;
using Mx.Web.UI.Config.Mapping;
using Mx.Forecasting.Services.Contracts.Responses;

namespace Mx.Web.UI.Areas.Forecasting.Api.Models
{
    [MapFrom(typeof(ForecastingSalesItemMetricAlls))]
    public class ForecastingSalesItemMetricAllsCondensed
    {
        public Double[] ManagerTransactions { get; set; }
        public Double[] NewManagerTransactions { get; set; }
        public Double[] SystemTransactions { get; set; }
        public Double[] LastYearTransactions { get; set; }
        public Double[] ActualQuantitys { get; set; }
    }

    [MapFrom(typeof(ForecastSalesItemMetricAllResponse))]
    public class ForecastingSalesItemMetricAlls
    {
        public Int64 Id { get; set; }
        public Int64 EntityId { get; set; }
        public DateTime GenerationDate { get; set; }
        public DateTime BusinessDay { get; set; }
        public DateTime[] IntervalStarts { get; set; }
        public IEnumerable<DaySegment> DaySegments { get; set; }
        public int[] DaySegmentIndexes { get; set; }
        public int[] IntervalTypes { get; set; }
        public int[][] TypeIndexes { get; set; }
        public Double[] ManagerTransactions { get; set; }
        public Double[] NewManagerTransactions { get; set; }
        public Double[] SystemTransactions { get; set; }
        public Double[] LastYearTransactions { get; set; }
        public Double[] ActualQuantitys { get; set; }
    }
}