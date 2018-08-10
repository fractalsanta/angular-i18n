using System;
using Mx.Inventory.Services.Contracts.Responses;
using Mx.Web.UI.Config.Mapping;

namespace Mx.Web.UI.Areas.Inventory.Count.Api.Models
{
    [MapFrom(typeof(CountReviewItemResponse))]
    public class CountReviewItemViewModel
    {
        public Int64 ItemId { get; set; }
        public String Description { get; set; }
        public String UnitOfMeasure { get; set; }
        public Single CurrentCount { get; set; }
        public Single? PreviousCount { get; set; }
        public Decimal Cost { get; set; }
        public Decimal? PreviousCost { get; set; }
        public Decimal CurrentCountValue { get; set; }
        public Decimal PreviousCountValue { get; set; }
        public Decimal PurchasesValue { get; set; }
        public Decimal ItemSalesValue { get; set; }
        public Decimal TransfersInValue { get; set; }
        public Decimal TransfersOutValue { get; set; }
        public Decimal WasteValue { get; set; }
        public Decimal Usage { get; set; }
        public Decimal CostPercent { get; set; }
        public Decimal? ClassificationSalesValue { get; set; }
        public String ProductCode { get; set; }
        public Decimal CountVariance { get; set; }
        public Decimal CountVariancePercent { get; set; }
    }
}