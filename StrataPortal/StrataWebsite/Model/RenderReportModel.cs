using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Rockend.iStrata.StrataCommon.BusinessEntities;

namespace Rockend.iStrata.StrataWebsite.Model
{
    public class RenderReportModel
    {
        private WebAccessReports webAccessReports;
        private int planId;

        public RenderReportModel(WebAccessReports webAccessReports, int planId)
        {
            this.webAccessReports = webAccessReports;
            this.planId = planId;
        }
        public WebAccessReports Report
        {
            get { return this.webAccessReports; }
            set { this.webAccessReports = value; }
        }
        public int PlanId
        {
            get { return this.planId; }
            set { this.planId = value; }
        }
        public int OwnerId
        {
            get;
            set;
        }
    }
}