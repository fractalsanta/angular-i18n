using Mx.Web.UI.Areas.Operations.Reporting.Api.Attributes;
using Mx.Web.UI.Areas.Core.Api.Models;
namespace Mx.Web.UI.Areas.Operations.Reporting.Api.Models
{
    public enum ReportType : short
    {
        [Report(Task.Operations_StoreSummary_CanAccess,
            Task.Operations_StoreSummary_CanAccessViewManager,
            Task.Operations_StoreSummary_CanCreateSharedViews,
            ReportViewType.ByEntity)]
        StoreSummary = 1,
        [Report(Task.Operations_AreaSummary_CanAccess,
            Task.Operations_AreaSummary_CanAccessViewManager,
            Task.Operations_AreaSummary_CanCreateSharedViews,
            ReportViewType.ByUser)]
        AreaSummary,
        [Report(Task.Operations_InventoryMovement_CanAccess,
            Task.Operations_StoreSummary_CanAccessViewManager,
            Task.Operations_StoreSummary_CanCreateSharedViews,
            ReportViewType.ByEntity)]
        InventoryMovement,
        [Report(Task.Operations_ProductMix_CanAccess,
            Task.Operations_ProductMix_CanAccessViewManager,
            Task.Operations_ProductMix_CanCreateSharedViews,
            ReportViewType.ByEntity)]
        ProductMix,
    }
}