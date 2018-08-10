using System;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Mx.OperationalReporting.Services.Contracts.Enums;
using Mx.Web.UI.Areas.Operations.Reporting.Api.Services;

using ReportType = Mx.Web.UI.Areas.Operations.Reporting.Api.Models.ReportType;

namespace Mx.Web.UI.Tests.Areas.Operations.Api
{
    [TestClass]
    public class ReportColumnTranslationTests
    {
        private IReportColumnNameLocalisationService _reportColumnNameLocalisationService;

        [TestInitialize]
        public void Initialize()
        {
            _reportColumnNameLocalisationService = new ReportColumnNameLocalisationService();
        }

        [TestMethod]
        public void When_getting_all_columns_for_report_Then_each_column_has_translation()
        {
            var columns = (StoreSummaryColumns[])Enum.GetValues(typeof(StoreSummaryColumns));

            var locColumns = _reportColumnNameLocalisationService.GetColumnLocalisationMap(ReportType.StoreSummary);

            foreach (var t in columns)
            {
                Assert.IsTrue(locColumns.Keys.Contains((short)t));
            }
            Assert.AreEqual(columns.Length, locColumns.Count);
        }


        [TestMethod]
        public void When_getting_all_columns_for_areasummary_Then_each_column_has_translation()
        {
            var columns = (AreaSummaryColumns[])Enum.GetValues(typeof(AreaSummaryColumns));

            var locColumns = _reportColumnNameLocalisationService.GetColumnLocalisationMap(ReportType.AreaSummary);

            foreach (var t in columns)
            {
                Assert.IsTrue(locColumns.Keys.Contains((short)t));
            }
            Assert.AreEqual(columns.Length, locColumns.Count);
        }



        [TestMethod]
        public void When_getting_all_columns_for_inventorymovement_Then_each_column_has_translation()
        {
            var columns = (InventoryMovementColumns[])Enum.GetValues(typeof(InventoryMovementColumns));

            var locColumns = _reportColumnNameLocalisationService.GetColumnLocalisationMap(ReportType.InventoryMovement);

            foreach (var t in columns)
            {
                Assert.IsTrue(locColumns.Keys.Contains((short)t), String.Format("Unable to locate column {0}", t));
            }
            foreach (var t in locColumns)
            {
                Assert.IsTrue(columns.Any(x => (short)x == t.Key), String.Format("Unable to locate column {0}", t));
            }
            Assert.AreEqual(columns.Length, locColumns.Count);
        }

    }
}
