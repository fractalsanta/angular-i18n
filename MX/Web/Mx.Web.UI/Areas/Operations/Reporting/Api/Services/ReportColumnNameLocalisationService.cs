using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Mx.Web.UI.Areas.Operations.Reporting.Api.Attributes;
using Mx.Web.UI.Areas.Operations.Reporting.Api.Models;


namespace Mx.Web.UI.Areas.Operations.Reporting.Api.Services
{
    public class ReportColumnNameLocalisationService : IReportColumnNameLocalisationService
    {
        public IDictionary<short, string> GetColumnLocalisationMap(Models.ReportType reportType)
        {
            var localisationMap = new Dictionary<ReportType, Type>()
            {
                { Models.ReportType.StoreSummary, typeof(StoreSummary.Api.Models.L10N) },
                { Models.ReportType.AreaSummary, typeof(AreaSummary.Api.Models.L10N) },
                { Models.ReportType.InventoryMovement, typeof(InventoryMovement.Api.Models.L10N) },
                { Models.ReportType.ProductMix, typeof(ProductMix.Api.Models.L10N) }
            };

            if (localisationMap.ContainsKey(reportType))
            {
                return localisationMap[reportType].GetProperties(BindingFlags.Public | BindingFlags.Instance)
                        .Where(p => p.GetCustomAttributes(typeof (ReportColumnAttribute), false).Any())
                        .Select(prop =>
                        {
                            var attr = prop.GetCustomAttributes(typeof (ReportColumnAttribute), false).First();
                            var rtattr = (ReportColumnAttribute) attr;
                            return new {rtattr.ColumnId, LocName = prop.Name};
                        })
                        .ToDictionary(k => k.ColumnId, v => v.LocName);
            }            
            
            throw new Exception("Report type name mapping not defined for " + reportType);            
        }
    }
}