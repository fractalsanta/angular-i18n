using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using Rockend.iStrata.StrataWebsite.Helpers;
using Rockend.iStrata.StrataCommon.BusinessEntities;
using Rockend.iStrata.StrataCommon.Response;

namespace Rockend.iStrata.StrataWebsite.Model
{
    public class ReportsModel
    {
        private bool? hasOwnerReports;
        private bool? hasFinancialStatmentReports;
        private bool? hasExecutiveReports;
        private bool? hasOtherReports;
        private int currentLotIndex;
        private int planId;

        public List<WebAccessReports> ReportsForCurrentUser
        {
            get;
            set;
        }

        public int PlanId
        {
            get
            {
                return planId;
            }
            set
            {
                planId = value;
                ReportsForCurrentUser = this.UserSession.GetReports(value);
            }
        }

        public int CurrentLotIndex
        {
            get { return this.currentLotIndex; }
            set { this.currentLotIndex = value; }
        }

        UserSession session;

        public UserSession UserSession
        {
            get
            {
                if (this.session == null)
                {
                    this.session = HttpContext.Current.Session["UserSession"] as UserSession;
                }
                return this.session;
            }
        }

        public bool HasOwnerReports
        {
            get
            {
                if (this.hasOwnerReports.HasValue)
                    return this.hasOwnerReports.Value;

                this.hasOwnerReports = this.UserSession.CanAccessReport(ReportsForCurrentUser.FirstOrDefault(r => r.WebAccessReportsID == 4), PlanId);
                return this.hasOwnerReports.Value;
            }
        }

        public bool HasFinancialStatmentReports
        {
            get
            {
                if (this.hasFinancialStatmentReports.HasValue)
                    return this.hasFinancialStatmentReports.Value;

                List<int> reportIds = new List<int> { 1, 2, 3, 6 };
                this.hasFinancialStatmentReports = ReportsForCurrentUser.FirstOrDefault(r => reportIds.Contains(r.WebAccessReportsID)) != null;
                return this.hasFinancialStatmentReports.Value;
            }
        }

        public bool HasExecutiveReports
        {
            get
            {
                if (this.hasExecutiveReports.HasValue)
                    return this.hasExecutiveReports.Value;

                List<int> reportIds = new List<int> { 7, 9, 10, 11, 12 };
                this.hasExecutiveReports = ReportsForCurrentUser.FirstOrDefault(r => reportIds.Contains(r.WebAccessReportsID)) != null;
                return this.hasExecutiveReports.Value;
            }
        }

        public bool HasOtherReports
        {
            get
            {
                if (this.hasOtherReports.HasValue)
                    return this.hasOtherReports.Value;

                this.hasOtherReports = this.UserSession.CanAccessReport(ReportsForCurrentUser.FirstOrDefault(r => r.WebAccessReportsID == 5), PlanId); // insurance
                return hasOtherReports.Value;
            }
        }

        public int OwnerId 
        { 
            get; set; 
        }
    }
}
