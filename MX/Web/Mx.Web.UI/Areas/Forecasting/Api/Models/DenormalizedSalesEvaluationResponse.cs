using System;
using System.Collections.Generic;
using Mx.Web.UI.Areas.Core.Api.Models;

namespace Mx.Web.UI.Areas.Forecasting.Api.Models
{
    public class DenormalizedSalesEvaluationResponse : IDenormalizedData
    {
        public Int64 DaySegmentId { get; set; }
        public String DaySegmentDescription { get; set; }
        public IList<Boolean> HasBeenEdited { get; set; }
        public IList<DateTime> BusinessDate { get; set; }
        public IList<Decimal> SystemSales { get; set; }
        public IList<Decimal> ManagerSales { get; set; }
        public IList<Decimal> ActualSales { get; set; }
        public IList<Double> SystemAccuracy { get; set; }
        public IList<Double> ManagerAccuracy { get; set; }
    }
}