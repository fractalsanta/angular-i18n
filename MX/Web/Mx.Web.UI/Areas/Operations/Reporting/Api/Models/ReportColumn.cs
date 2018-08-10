namespace Mx.Web.UI.Areas.Operations.Reporting.StoreSummary.Api.Models
{
    public enum ReportColumn : short
    {
        GrossSales = 1,
        NetSales = 2,
        Tax = 3,
        TransactionCount = 4,
        TransactionCountMonthToDate = 5,
        TransactionCountYearToDate = 6,
        TransactionCountPercentageChangeLastWeek = 7,
        TransactionCountPercentageChangeLastYear = 8,

        NetSalesLastWeek = 12,
        NetSalesLastYear = 22,
        NetSalesMonthToDate = 23,
        NetSalesYearToDate = 24,
        NetSalesPercentageChangeLastWeek = 25,
        NetSalesPercentageChangeLastYear = 26,

    }
}