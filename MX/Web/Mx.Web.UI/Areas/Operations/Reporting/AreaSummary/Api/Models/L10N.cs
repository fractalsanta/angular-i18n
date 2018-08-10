using Mx.OperationalReporting.Services.Contracts.Enums;
using Mx.Web.UI.Areas.Operations.Reporting.Api.Attributes;
using Mx.Web.UI.Config.Translations;
using ReportType = Mx.Web.UI.Areas.Operations.Reporting.Api.Models.ReportType;

namespace Mx.Web.UI.Areas.Operations.Reporting.AreaSummary.Api.Models
{
    [Translation("OperationsReportingAreaSummary")]
    public class L10N
    {
        public virtual string AreaSummary { get { return "Area Summary"; } }
        public virtual string Total { get { return "TOTAL"; } }
        public virtual string ViewManager { get { return "View Manager"; } }
        public virtual string Actions { get { return "Actions"; } }
        public virtual string ExportToCsvCurrentView { get { return "Export View"; } }
        public virtual string ExportStoreName { get { return "Store Name"; } }
        public virtual string AllAreas { get { return "All Areas"; } }

        #region Column Names

        public virtual string ColumnStore { get { return "Store"; } }
        public virtual string ColumnDate { get { return "Date"; } }

        [ReportColumn(AreaSummaryColumns.GrossSales)]
        public virtual string ColumnGrossSales { get { return "Gross Sales"; } }

        [ReportColumn(AreaSummaryColumns.NetSales)]
        public virtual string ColumnNetSales { get { return "Net Sales"; } }

        [ReportColumn(AreaSummaryColumns.Tax)]
        public virtual string ColumnTax { get { return "Tax"; } }

        [ReportColumn(AreaSummaryColumns.TransactionCount)]
        public virtual string ColumnTransactionCount { get { return "TRN Count"; } }

        [ReportColumn(AreaSummaryColumns.TransactionCountMonthToDate)]
        public virtual string ColumnTransactionCountMonthToDate { get { return "TRN Count MTD"; } }

        [ReportColumn(AreaSummaryColumns.TransactionCountYearToDate)]
        public virtual string ColumnTransactionCountYearToDate { get { return "TRN Count YTD"; } }

        [ReportColumn(AreaSummaryColumns.TransactionCountPercentageChangeLastWeek)]
        public virtual string ColumnTransactionCountPercentageChangeLastWeek { get { return "TRN Count % change vs LW"; } }

        [ReportColumn(AreaSummaryColumns.TransactionCountPercentageChangeLastYear)]
        public virtual string ColumnTransactionCountPercentageChangeLastyear { get { return "TRN Count % change vs LY"; } }

        [ReportColumn(AreaSummaryColumns.NetSalesLastWeek)]
        public virtual string ColumnNetSalesLastWeek { get { return "Net Sales LW"; } }

        [ReportColumn(AreaSummaryColumns.NetSalesLastYear)]
        public virtual string ColumnNetSalesLastYear { get { return "Net Sales LY"; } }

        [ReportColumn(AreaSummaryColumns.NetSalesMonthToDate)]
        public virtual string ColumnNetSalesMonthToDate { get { return "Net Sales MTD"; } }

        [ReportColumn(AreaSummaryColumns.NetSalesYearToDate)]
        public virtual string ColumnNetSalesYearToDate { get { return "Net Sales YTD"; } }

        [ReportColumn(AreaSummaryColumns.NetSalesPercentageChangeLastWeek)]
        public virtual string ColumnNetSalesPercentageChangeLastWeek { get { return "Net Sales % change vs LW"; } }

        [ReportColumn(AreaSummaryColumns.NetSalesPercentageChangeLastYear)]
        public virtual string ColumnNetSalesPercentageChangeLastYear { get { return "Net Sales % change vs LY"; } }

        [ReportColumn(AreaSummaryColumns.TransactionAverage)]
        public virtual string ColumnTransactionAverage { get { return "TRN Average"; } }

        [ReportColumn(AreaSummaryColumns.TransactionAverageLastWeek)]
        public virtual string ColumnTransactionAverageLastWeek { get { return "TRN Average LW"; } }

        [ReportColumn(AreaSummaryColumns.TransactionAverageLastYear)]
        public virtual string ColumnTransactionAverageLastYear { get { return "TRN Average LY"; } }

        [ReportColumn(AreaSummaryColumns.Voids)]
        public virtual string ColumnVoids { get { return "Voids"; } }

        [ReportColumn(AreaSummaryColumns.Discounts)]
        public virtual string ColumnDiscounts { get { return "Discounts"; } }

        [ReportColumn(AreaSummaryColumns.Coupons)]
        public virtual string ColumnCoupons { get { return "Coupons"; } }

        [ReportColumn(AreaSummaryColumns.VoidsPercentage)]
        public virtual string ColumnVoidsPercentage { get { return "Voids %"; } }

        [ReportColumn(AreaSummaryColumns.DiscountsPercentage)]
        public virtual string ColumnDiscountsPercentage { get { return "Discounts %"; } }

        [ReportColumn(AreaSummaryColumns.CouponsPercentage)]
        public virtual string ColumnCouponsPercentage { get { return "Coupons %"; } }

        [ReportColumn(AreaSummaryColumns.ProjectedSales)]
        public virtual string ColumnProjectedSales { get { return "Projected Sales"; } }

        [ReportColumn(AreaSummaryColumns.BudgetedSales)]
        public virtual string ColumnBudgetedSales { get { return "Budgeted Sales"; } }

        [ReportColumn(AreaSummaryColumns.ProjectedTransactionCount)]
        public virtual string ColumnProjectedTransactionCount { get { return "Projected TRN Count"; } }

        [ReportColumn(AreaSummaryColumns.TransactionCountLastWeek)]
        public virtual string ColumnTransactionCountLastWeek { get { return "TRN Count LW"; } }

        [ReportColumn(AreaSummaryColumns.TransactionCountLastYear)]
        public virtual string ColumnTransactionCountLastYear { get { return "TRN Count LY"; } }

        #endregion

    }
}
