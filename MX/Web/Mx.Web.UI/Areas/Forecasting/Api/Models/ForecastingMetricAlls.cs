using System;
using System.Collections.Generic;
using Mx.Forecasting.Services.Contracts.Responses;
using Mx.Web.UI.Config.Mapping;

namespace Mx.Web.UI.Areas.Forecasting.Api.Models
{
    [MapFrom(typeof(ForecastingMetricAlls))]
    public class ForecastingMetricAllsCondensed
    {
        public Decimal[] ManagerSales { get; set; }
        public Decimal[] NewManagerSales { get; set; }
        public Double[] ManagerTransactions { get; set; }
        public Double[] NewManagerTransactions { get; set; }
        public Double[] ManagerAdjustments { get; set; }
        public Double[] NewManagerAdjustments { get; set; }
        public Decimal[] LastYearSales { get; set; }
        public Double[] LastYearTransactions { get; set; }
        public Decimal[] ActualSales { get; set; }
        public Double[] ActualTransactions { get; set; }
        public Int32[] ServiceTypes { get; set; }
        public Decimal[] SystemSales { get; set; }
        public Double[] SystemTransactions { get; set; }
    }

    [MapFrom(typeof(ForecastMetricAllResponse))]
    public class ForecastingMetricAlls
    {
        public Forecast Forecast { get; set; }
        public IEnumerable<DaySegment> DaySegments { get; set; }
        public DateTime[] IntervalStarts { get; set; }
        public int[] DaySegmentIndexes { get; set; }
        public int[] IntervalTypes { get; set; }
        public int[][] TypeIndexes { get; set; }
        public Decimal[] ManagerSales { get; set; }
        public Decimal[] NewManagerSales { get; set; }
        public Double[] ManagerTransactions { get; set; }
        public Double[] NewManagerTransactions { get; set; }
        public Double[] ManagerAdjustments { get; set; }
        public Double[] NewManagerAdjustments { get; set; }
        public Decimal[] LastYearSales { get; set; }
        public Double[] LastYearTransactions { get; set; }
        public Decimal[] ActualSales { get; set; }
        public Double[] ActualTransactions { get; set; }
        public Int32[] ServiceTypes { get; set; }
        public Decimal[] SystemSales { get; set; }
        public Double[] SystemTransactions { get; set; }
    }
}