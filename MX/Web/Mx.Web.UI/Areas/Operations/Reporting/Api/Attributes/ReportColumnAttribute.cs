using System;
using Mx.OperationalReporting.Services.Contracts.Enums;

namespace Mx.Web.UI.Areas.Operations.Reporting.Api.Attributes
{
    [AttributeUsage(AttributeTargets.Property)]
    internal class ReportColumnAttribute : Attribute
    {
        public short ColumnId;

        public ReportColumnAttribute(StoreSummaryColumns columnId)
        {
            ColumnId = (short)columnId;
        }

        public ReportColumnAttribute(AreaSummaryColumns columnId)
        {
            ColumnId = (short)columnId;
        }

        public ReportColumnAttribute(InventoryMovementColumns columnId)
        {
            ColumnId = (short)columnId;
        }

        public ReportColumnAttribute(ProductMixColumns columnId)
        {
            ColumnId = (short) columnId;
        }
    }
}