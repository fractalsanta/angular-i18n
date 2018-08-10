using System;
using System.Collections.Generic;
using Mx.Web.UI.Areas.Core.Api.Models;

namespace Mx.Web.UI.Areas.Forecasting.Api.Models
{
    public class DenormalizedSalesItemEvaluationResponse : IDenormalizedData
    {
        public Int64 DaySegmentId { get; set; }        
        public String DaySegmentDescription { get; set; }
        public IList<Boolean> HasBeenEdited { get; set; }
        public IList<DateTime> BusinessDate { get; set; }
        public IList<Double> SystemQuantity { get; set; }
        public IList<Double> ManagerQuantity { get; set; }
        public IList<Double> ActualQuantity { get; set; }
        public IList<Double> SystemAccuracy { get; set; }
        public IList<Double> ManagerAccuracy { get; set; }
    }
}