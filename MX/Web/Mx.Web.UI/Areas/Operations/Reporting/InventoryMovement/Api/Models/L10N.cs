using Mx.OperationalReporting.Services.Contracts.Enums;
using Mx.Web.UI.Areas.Operations.Reporting.Api.Attributes;
using Mx.Web.UI.Config.Translations;

namespace Mx.Web.UI.Areas.Operations.Reporting.InventoryMovement.Api.Models
{
    [Translation("OperationsReportingInventoryMovement")]
    public class L10N
    {
        public virtual string InventoryMovement { get { return "Inventory Movement"; } }

        public virtual string Search { get { return "Search"; } }

        public virtual string DatePickerTitle { get { return "Select Reporting Period"; } }

        public virtual string NoData { get { return "No data"; } }

        public virtual string Total { get { return "TOTAL"; } }

        public virtual string Totals { get { return "Totals"; } }

        public virtual string Categories { get { return "Categories"; } }

        public virtual string ExportStoreName { get { return "Store Name"; } }

        public virtual string ColumnItemCode { get { return "Item Code"; } }

        public virtual string ColumnItemDescription { get { return "Item Description"; } }

        public virtual string ExportToCsvCurrentView { get { return "Export View"; } }

        [ReportColumn(InventoryMovementColumns.UnitOfMeasure)]
        public virtual string ColumnUnitOfMeasure { get { return "Unit of Measure"; } }

        [ReportColumn(InventoryMovementColumns.AverageUnitCost)]
        public virtual string ColumnAverageUnitCost { get { return "Avg Unit Cost"; } }

        [ReportColumn(InventoryMovementColumns.BeginInventory)]
        public virtual string ColumnBeginInventory { get { return "Begin Inventory"; } }

        [ReportColumn(InventoryMovementColumns.ReceivedQuantity)]
        public virtual string ColumnReceivedQuantity { get { return "Received"; } }

        [ReportColumn(InventoryMovementColumns.ReceivedValue)]
        public virtual string ColumnReceivedValue { get { return "Received $"; } }

        [ReportColumn(InventoryMovementColumns.DeliveredQuantity)]
        public virtual string ColumnDeliveredQuantity { get { return "Delivered"; } }

        [ReportColumn(InventoryMovementColumns.DeliveredValue)]
        public virtual string ColumnDeliveredValue { get { return "Delivered $"; } }

        [ReportColumn(InventoryMovementColumns.Returns)]
        public virtual string ColumnReturns { get { return "Returns"; } }

        [ReportColumn(InventoryMovementColumns.TransferIn)]
        public virtual string ColumnTransferIn { get { return "Transfer In"; } }

        [ReportColumn(InventoryMovementColumns.TransferOut)]
        public virtual string ColumnTransferOut { get { return "Transfer Out"; } }

        [ReportColumn(InventoryMovementColumns.EndInventory)]
        public virtual string ColumnEndInventory { get { return "End Inventory"; } }

        [ReportColumn(InventoryMovementColumns.ActualUsage)]
        public virtual string ColumnActualUsage { get { return "Actual Usage"; } }

        [ReportColumn(InventoryMovementColumns.TheoreticalUsage)]
        public virtual string ColumnTheoreticalUsage { get { return "Theoretical Usage"; } }

        [ReportColumn(InventoryMovementColumns.VarianceQuantity)]
        public virtual string ColumnVarianceQuantity { get { return "Variance Qty"; } }

        [ReportColumn(InventoryMovementColumns.VarianceDollars)]
        public virtual string ColumnVarianceDollars { get { return "Variance $"; } }

        [ReportColumn(InventoryMovementColumns.VariancePercentageSales)]
        public virtual string ColumnVariancePercentageSales { get { return "Variance % Sales"; } }

        [ReportColumn(InventoryMovementColumns.WasteUnits)]
        public virtual string ColumnWasteUnits { get { return "Waste (units)"; } }

        [ReportColumn(InventoryMovementColumns.WasteDollars)]
        public virtual string ColumnWasteDollars { get { return "Waste $"; } }

        [ReportColumn(InventoryMovementColumns.WastePercentage)]
        public virtual string ColumnWastePercentage { get { return "Waste %"; } }

        [ReportColumn(InventoryMovementColumns.MissingDollars)]
        public virtual string ColumnMissingDollars { get { return "Missing $"; } }

        [ReportColumn(InventoryMovementColumns.MissingQuantity)]
        public virtual string ColumnMissingQuantity { get { return "Missing Qty"; } }

        [ReportColumn(InventoryMovementColumns.MissingPercentage)]
        public virtual string ColumnMissingPercentage { get { return "Missing %"; } }

        [ReportColumn(InventoryMovementColumns.EfficiencyPercentage)]
        public virtual string ColumnEfficiencyPercentage { get { return "Efficiency %"; } }

        [ReportColumn(InventoryMovementColumns.StockOutstanding)]
        public virtual string ColumnStockOutstanding { get { return "Stock Outstanding"; } }

        [ReportColumn(InventoryMovementColumns.UnitCost)]
        public virtual string ColumnUnitCost { get { return "Unit Cost"; } }

        [ReportColumn(InventoryMovementColumns.SalesValue)]
        public virtual string ColumnSalesValue { get { return "Sales Value"; } }

    }
}
