using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using Rockend.iStrata.StrataCommon;
using Rockend.iStrata.StrataCommon.BusinessEntities;
using Rockend.iStrata.StrataWebsite.Model;
using Rockend.WebAccess.Common.Helpers;

namespace Rockend.iStrata.StrataWebsite.Helpers
{
    /// <summary>
    /// Extension methods to simplify handling of report metadata in the session.
    /// </summary>
    public static class ReportHelper
    {
        /// <summary>
        /// Determine if session has access to the named report and Corporate Owner (Plan) can run the report
        /// </summary>
        /// <param name="session">Session to check against</param>
        /// <param name="name">Name of the report</param>
        /// <param name="corpOwnerID">Corporate Owner ID to check</param>
        /// <returns>True if access allowed</returns>
        public static bool CanAccessReport(this UserSession session, string name, int corpOwnerID)
        {
            WebAccessReports report = session.FindReport(name, corpOwnerID);
            return session.CanAccessReport(report, corpOwnerID);
        }

        /// <summary>
        /// Determine if session has access to the named report.
        /// </summary>
        /// <param name="session">Session to check against.</param>
        /// <param name="report">The report.</param>
        /// <returns>True if the session has access, otherwise false.</returns>
        public static bool CanAccessReport(this UserSession session, WebAccessReports report, int planId)
        {
            if (report == null)
                return false;

            var perm = session.ReportPermissions.Where(p => p.PlanId == planId).FirstOrDefault(r => r.ReportId == report.WebAccessReportsID);
            
            if (report != null && report.IsAllowed.ToBoolean())
            {
                if (perm != null)
                {
                    if (session.Role == Role.ExecutiveMember && perm.AllowedExecutive)
                    {
                        return true;
                    }
                    if (session.Role == Role.Owner && perm.AllowedOwner)
                    {
                        return true;
                    }
                }
            }
            return false;
        }

        /// <summary>
        /// Ensure session has access to the named report, otherwise throws an exception.
        /// </summary>
        /// <param name="session">Session to check against.</param>
        /// <param name="name">Name of the report.</param>
        public static void EnsureReportAccess(this UserSession session, string name, int planNumber)
        {
            if (!session.CanAccessReport(name, planNumber))
            {
                throw new WebAccessException("Access to this report has been disallowed by the strata Agency.");
            }
        }
        
        /// <summary>
        /// Find the named report in the session.
        /// </summary>
        /// <param name="session">Session to search.</param>
        /// <param name="name">Name to search for.</param>
        /// <returns>WebAccessReports object, or null if not found.</returns>
        public static WebAccessReports FindReport(this UserSession session, string name, int planNumber)
        {
            return session.GetReports(planNumber).Where(r => r.ReportName == name).FirstOrDefault();
        }

        /// <summary>
        /// Returns the terminology name for the report
        /// </summary>
        /// <param name="session">Session to search.</param>
        /// <param name="name">Name to search for.</param>
        /// <returns>Terminology name for the given report.</returns>
        public static string GetReportDisplayName(this UserSession session, string name, int planNumber)
        {
            WebAccessReports report = session.FindReport(name, planNumber);
            if (report == null) return string.Empty;
            return session.Terminology[report.InternalName];
        }


        #region Budget Report

        public static List<BudgetDropdownItem> CreateBudgetList(List<BudgetItem> budgets, List<DropdownItem> ownersCorps)
        {
            return budgets.OrderByDescending(b => b.StartDate).Join(ownersCorps,
                    b => b.OwnerCorpOID,
                    o => o.Id,
                    (b, o) => CreateBudgetDropdownItem(b, o))
                .ToList();
        }

        public static BudgetDropdownItem CreateBudgetDropdownItem(BudgetItem budget, DropdownItem ownersCorp)
        {
            return new BudgetDropdownItem(
                budget.OID, budget.OwnerCorpOID,
                string.Format("{0} ({1})", budget.StartDate.Format(), ownersCorp.Name)
                );
        }

        #endregion

        /// <summary>
        /// Get the path to the temp folder.
        /// </summary>
        /// <returns>Path to the temp folder.</returns>
        public static string GetTempPath()
        {
            return Path.GetTempPath() + "Strata" + Path.DirectorySeparatorChar;
        }
    }
}
