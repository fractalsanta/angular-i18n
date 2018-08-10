using Mx.OperationalReporting.Services.Contracts.Enums;
using Mx.Web.UI.Areas.Operations.Reporting.Api.Attributes;
using Mx.Web.UI.Config.Translations;

namespace Mx.Web.UI.Areas.Operations.Reporting.ProductMix.Api.Models
{
    [Translation("OperationsReportingProductMix")]
    public class L10N
    {
        public virtual string ProductMix { get { return "Product Mix"; } }
        public virtual string NoData { get { return "No data"; } }
        public virtual string Total { get { return "TOTAL"; } }
        public virtual string Totals { get { return "Totals"; } }
        public virtual string Categories { get { return "Categories"; } }
        public virtual string ColumnItemCode { get { return "Item Code"; } }
        public virtual string ColumnItemDescription { get { return "Item Description"; } }
        public virtual string Search { get { return "Search"; } }
        public virtual string ExportStoreName { get { return "Store Name"; } }
        public virtual string ExportToCsvCurrentView { get { return "Export View"; } }

        #region Column Names

        [ReportColumn(ProductMixColumns.SalesDepartment)]
        public string SalesDepartment { get { return "Sales Department"; } }

        public string SalesCategory { get { return "Sales Category";  } }

        public string ItemDescription { get { return "Item Description";  } }

        public string ItemCode { get { return "Item Code";  } }
        
        [ReportColumn(ProductMixColumns.InventoryUnit)]
        public string InventoryUnit { get { return "Inventory Unit";  } }

        [ReportColumn(ProductMixColumns.InventoryCost)]
        public string InventoryCost { get { return "Inventory Cost"; }}

        [ReportColumn(ProductMixColumns.PercOfTotalSales)]
        public string PercOfTotalSales { get { return "% of Sales";  } }

        [ReportColumn(ProductMixColumns.Units)]
        public string Units { get { return "Units"; } }

        [ReportColumn(ProductMixColumns.UnitsLastWeek)]
        public string UnitsLastWeek { get { return "Units Last Week"; } }

        [ReportColumn(ProductMixColumns.UnitsLastMonth)]
        public string UnitsLastMonth { get { return "Units Last Month"; } }

        [ReportColumn(ProductMixColumns.UnitsLastYear)]
        public string UnitsLastYear { get { return "Units Last Year"; } }

        [ReportColumn(ProductMixColumns.UnitsWeekToDate)]
        public string UnitsWeekToDate { get { return "Units Week to Date"; } }

        [ReportColumn(ProductMixColumns.UnitsMonthToDate)]
        public string UnitsMonthToDate { get { return "Units Month to Date"; } }

        [ReportColumn(ProductMixColumns.UnitsYearToDate)]
        public string UnitsYearToDate { get { return "Units Year to Date"; } }

        [ReportColumn(ProductMixColumns.NetSales)]
        public string NetSales { get { return "Net Sales"; } }

        [ReportColumn(ProductMixColumns.NetSalesLastWeek)]
        public string NetSalesLastWeek { get { return "Net Sales Last Week"; } }

        [ReportColumn(ProductMixColumns.NetSalesLastMonth)]
        public string NetSalesLastMonth { get { return "Net Sales Last Month"; } }

        [ReportColumn(ProductMixColumns.NetSalesLastYear)]
        public string NetSalesLastYear { get { return "Net Sales Last Year"; } }


        [ReportColumn(ProductMixColumns.NetSalesWeekToDate)]
        public string NetSalesWeekToDate { get { return "Net Sales Week to Date"; } }

        [ReportColumn(ProductMixColumns.NetSalesMonthToDate)]
        public string NetSalesMonthToDate { get { return "Net Sales Month to Date"; } }

        [ReportColumn(ProductMixColumns.NetSalesYearToDate)]
        public string NetSalesYearToDate { get { return "Net Sales Year to Date"; } }

        [ReportColumn(ProductMixColumns.SalesMixPerc)]
        public string SalesMixPerc { get { return "Sales Mix %";  } }

        [ReportColumn(ProductMixColumns.SalesMixPercLastWeek)]
        public string SalesMixPercLastWeek { get { return "Sales Mix % Last Week"; } }

        [ReportColumn(ProductMixColumns.SalesMixPercLastMonth)]
        public string SalesMixPercLastMonth { get { return "Sales Mix % Last Month"; } }

        [ReportColumn(ProductMixColumns.SalesMixPercLastYear)]
        public string SalesMixPercLastYear { get { return "Sales Mix % Last Year"; } }

        [ReportColumn(ProductMixColumns.SalesMixPercWeekToDate)]
        public string SalesMixPercWeekToDate { get { return "Sales Mix % Week to Date"; } }

        [ReportColumn(ProductMixColumns.SalesMixPercMonthToDate)]
        public string SalesMixPercMonthToDate { get { return "Sales Mix % Month to Date"; } }

        [ReportColumn(ProductMixColumns.SalesMixPercYearToDate)]
        public string SalesMixPercYearToDate { get { return "Sales Mix % Year to Date"; } }

        #endregion
    }
}