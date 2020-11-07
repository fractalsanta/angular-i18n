using System;
using System.Collections.Generic;
using System.Linq;
using Rockend.iStrata.StrataCommon.BusinessEntities;
using Rockend.iStrata.StrataCommon.Response;
using Rockend.iStrata.StrataWebsite.Helpers;

namespace Rockend.iStrata.StrataWebsite.Model
{
    /// <summary>
    /// Base model for report parameters views
    /// </summary>
    [Serializable]
    public class ReportParametersModel
    {
        private IMessenger messenger;

        public ReportParametersModel(IMessenger messenger, UserSession session, string reportName, int planId)
        {
            switch (reportName)
            {
                case "rptBudget":
                    this.messenger = messenger;
                    BudgetReportResponse response = messenger.GetBudgetInfo(new List<int>() { planId });
                    this.BudgetItems = ReportHelper.CreateBudgetList(response.BudgetList, session.OwnersCorpNames);
                    break;
                case "rptFinancialPerformance":
                    this.ComparativePeriods = new List<DropdownItem>
                    {
                        new DropdownItem(0, "None"),
                        new DropdownItem(3, "Prior Year Complete")
                    };
                    OwnersCorporations = session.OwnersCorpNames;
                    break;
            }

            WebAccessReports currentReport = session.GetReports(planId).FirstOrDefault(r => r.ReportName == reportName);

            this.DisplayName = session.GetReportDisplayName(reportName, planId);
            this.ReportName = reportName;
            this.PlanId = planId;
        }

        public int PlanId { get; set; }
        public string DisplayName { get; set; }
        public string ReportName { get; set; }
        public List<BudgetDropdownItem> BudgetItems { get; set; }
        public int BudgetId { get; set; }
        public List<DropdownItem> ComparativePeriods { get; set; }
        public List<DropdownItem> OwnersCorporations { get; set; }
    }

    /// <summary>
    /// Extended dropdown item with additional OwnersCorpId property
    /// </summary>
    [Serializable]
    public class BudgetDropdownItem : DropdownItem
    {
        public BudgetDropdownItem(int budgetId, int ownersCorpId, string name)
            : base(budgetId, name)
        {
            OwnersCorpId = ownersCorpId;
        }

        public int OwnersCorpId { get; private set; }
    }
}
