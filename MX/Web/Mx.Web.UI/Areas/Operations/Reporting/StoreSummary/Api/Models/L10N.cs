using Mx.OperationalReporting.Services.Contracts.Enums;
using Mx.Web.UI.Areas.Operations.Reporting.Api.Attributes;
using Mx.Web.UI.Config.Translations;

namespace Mx.Web.UI.Areas.Operations.Reporting.StoreSummary.Api.Models
{
    [Translation("OperationsReportingStoreSummary")]
    public class L10N
    {
        public virtual string StoreSummary { get { return "Store Summary"; } }
        public virtual string Total { get { return "TOTAL"; } }
        public virtual string ViewManager { get { return "View Manager"; } }
        public virtual string Actions { get { return "Actions"; } }
        public virtual string ExportToCsvCurrentView { get { return "Export View"; } }
        public virtual string ExportStoreName { get { return "Store Name"; } }
        
        #region Column Names

        public virtual string ColumnDate { get { return "Date"; } }
        
        [ReportColumn(StoreSummaryColumns.GrossSales)]
        public virtual string ColumnGrossSales { get { return "Gross Sales"; } }

        [ReportColumn(StoreSummaryColumns.NetSales)]
        public virtual string ColumnNetSales { get { return "Net Sales"; } }

        [ReportColumn(StoreSummaryColumns.Tax)]
        public virtual string ColumnTax { get { return "Tax"; } }

        [ReportColumn(StoreSummaryColumns.TransactionCount)]
        public virtual string ColumnTransactionCount { get { return "TRN Count"; } }
        
        [ReportColumn(StoreSummaryColumns.TransactionCountMonthToDate)]
        public virtual string ColumnTransactionCountMonthToDate { get { return "TRN Count MTD"; } }
        
        [ReportColumn(StoreSummaryColumns.TransactionCountYearToDate)]
        public virtual string ColumnTransactionCountYearToDate { get { return "TRN Count YTD"; } }
        
        [ReportColumn(StoreSummaryColumns.TransactionCountPercentageChangeLastWeek)]
        public virtual string ColumnTransactionCountPercentageChangeLastWeek { get { return "TRN Count % change vs LW"; } }
        
        [ReportColumn(StoreSummaryColumns.TransactionCountPercentageChangeLastYear)]
        public virtual string ColumnTransactionCountPercentageChangeLastyear { get { return "TRN Count % change vs LY"; } }
        
        [ReportColumn(StoreSummaryColumns.NetSalesLastWeek)]
        public virtual string ColumnNetSalesLastWeek { get { return "Net Sales LW"; } }
        
        [ReportColumn(StoreSummaryColumns.NetSalesLastYear)]
        public virtual string ColumnNetSalesLastYear { get { return "Net Sales LY"; } }
        
        [ReportColumn(StoreSummaryColumns.NetSalesMonthToDate)]
        public virtual string ColumnNetSalesMonthToDate { get { return "Net Sales MTD"; } }
        
        [ReportColumn(StoreSummaryColumns.NetSalesYearToDate)]
        public virtual string ColumnNetSalesYearToDate { get { return "Net Sales YTD"; } }
        
        [ReportColumn(StoreSummaryColumns.NetSalesPercentageChangeLastWeek)]
        public virtual string ColumnNetSalesPercentageChangeLastWeek { get { return "Net Sales % change vs LW"; } }
        
        [ReportColumn(StoreSummaryColumns.NetSalesPercentageChangeLastYear)]
        public virtual string ColumnNetSalesPercentageChangeLastYear { get { return "Net Sales % change vs LY"; } }

        [ReportColumn(StoreSummaryColumns.TransactionAverage)]
        public virtual string ColumnTransactionAverage { get { return "TRN Average"; } }

        [ReportColumn(StoreSummaryColumns.TransactionAverageLastWeek)]
        public virtual string ColumnTransactionAverageLastWeek { get { return "TRN Average LW"; } }

        [ReportColumn(StoreSummaryColumns.TransactionAverageLastYear)]
        public virtual string ColumnTransactionAverageLastYear { get { return "TRN Average LY"; } }

        [ReportColumn(StoreSummaryColumns.Voids)]
        public virtual string ColumnVoids { get { return "Voids"; } }
        
        [ReportColumn(StoreSummaryColumns.Discounts)]
        public virtual string ColumnDiscounts { get { return "Discounts"; } }

        [ReportColumn(StoreSummaryColumns.Coupons)]
        public virtual string ColumnCoupons { get { return "Coupons"; } }

        [ReportColumn(StoreSummaryColumns.VoidsPercentage)]
        public virtual string ColumnVoidsPercentage { get { return "Voids %"; } }
        
        [ReportColumn(StoreSummaryColumns.DiscountsPercentage)]
        public virtual string ColumnDiscountsPercentage { get { return "Discounts %"; } }

        [ReportColumn(StoreSummaryColumns.CouponsPercentage)]
        public virtual string ColumnCouponsPercentage { get { return "Coupons %"; } }

        [ReportColumn(StoreSummaryColumns.ProjectedSales)]
        public virtual string ColumnProjectedSales { get { return "Projected Sales"; } }

        [ReportColumn(StoreSummaryColumns.BudgetedSales)]
        public virtual string ColumnBudgetedSales { get { return "Budgeted Sales"; } }

        [ReportColumn(StoreSummaryColumns.ProjectedTransactionCount)]
        public virtual string ColumnProjectedTransactionCount { get { return "Projected TRN Count"; } }

        #endregion
    }
}
