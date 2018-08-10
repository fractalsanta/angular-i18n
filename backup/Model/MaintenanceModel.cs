using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml.Linq;
using Rockend.iStrata.StrataWebsite.Helpers;
using Rockend.WebAccess.Common.Helpers;

namespace Rockend.iStrata.StrataWebsite.Model
{
    public class MaintenanceModel : ModelBase
    {
        public List<WorkOrderSummary> WorkOrderSummaries { get; set; }
        public List<QuoteSummary> QuoteSummaries { get; set; }

        public bool ShowDetailLink
        {
            get
            {
                return (base.AgentContentStrata.ShowMaintenanceDetailsExec && base.UserSession.Role == Rockend.iStrata.StrataCommon.Role.ExecutiveMember)
                    || (base.AgentContentStrata.ShowMaintenanceDetailsOwner && base.UserSession.Role == Rockend.iStrata.StrataCommon.Role.Owner);
            }
        }
    }

    [Serializable]
    public class WorkOrderSummary
    {
        public int OwnersCorporationID { get; set; }
        public string PlanNumber { get; set; }
        public string DiarySubject { get; set; }
        public DateTime OrderDate { get; set; }
        public string Status { get; set; }
        public string OrderNumber { get; set; }
        public int WorkOrderID { get; set; }

        public string StatusString
        {
            get
            {
                return MaintenanceHelper.GetWorkOrderStatus(Status);
            }
        }

        public string JobStateCssClass
        {
            get
            {
                switch (Status)
                {
                    case "H":
                    case "A":
                    case "S":
                        return "open";
                    case "C":
                    case "R":
                    case "N":
                    case "V":
                    case "U":
                        return "closed";
                    default:
                        return "";
                }
            }
        }

        public static WorkOrderSummary FromXml(XElement element)
        {
            WorkOrderSummary summary = new WorkOrderSummary();
            summary.DiarySubject = XMLDataHelper.GetValueFromXml<string>(element, "DiarySubject");
            summary.OrderDate = XMLDataHelper.GetValueFromXml<DateTime>(element, "OrderDate");
            summary.OrderNumber = XMLDataHelper.GetValueFromXml<string>(element, "OrderNumber");
            summary.OwnersCorporationID = XMLDataHelper.GetValueFromXml<int>(element, "OwnersCorporationID");
            summary.PlanNumber = XMLDataHelper.GetValueFromXml<string>(element, "PlanNumber");
            summary.Status = XMLDataHelper.GetValueFromXml<string>(element, "Status");
            summary.WorkOrderID = XMLDataHelper.GetValueFromXml<int>(element, "WorkOrderID");

            return summary;
        }
    }

    [Serializable]
    public class QuoteSummary
    {
        public int OwnersCorporationID { get; set; }
        public string PlanNumber { get; set; }
        public string DiarySubject { get; set; }
        public DateTime QuoteRequestDate { get; set; }
        public string Status { get; set; }
        public string OrderNumber { get; set; }
        public int WorkOrderID { get; set; }
        public int QuoteID { get; set; }

        public string StatusString
        {
            get
            {
                return MaintenanceHelper.GetQuoteStatus(Status);
            }
        }

        public string JobStateCssClass
        {
            get
            {
                switch (Status)
                {
                    case "Q":
                    case "A":
                        return "open";
                    case "P":
                    case "R":
                    case "N":
                    case "D":
                    case "O":
                    case "U":
                        return "closed";
                    default:
                        return "";
                }
            }
        }

        public static QuoteSummary FromXml(XElement element)
        {
            QuoteSummary summary = new QuoteSummary();
            summary.DiarySubject = XMLDataHelper.GetValueFromXml<string>(element, "DiarySubject");
            summary.QuoteRequestDate = XMLDataHelper.GetValueFromXml<DateTime>(element, "QuoteRequestDate");
            summary.OrderNumber = XMLDataHelper.GetValueFromXml<string>(element, "OrderNumber");
            summary.OwnersCorporationID = XMLDataHelper.GetValueFromXml<int>(element, "OwnersCorporationID");
            summary.PlanNumber = XMLDataHelper.GetValueFromXml<string>(element, "PlanNumber");
            summary.Status = XMLDataHelper.GetValueFromXml<string>(element, "Status");
            summary.WorkOrderID = XMLDataHelper.GetValueFromXml<int>(element, "WorkOrderID");
            summary.QuoteID = XMLDataHelper.GetValueFromXml<int>(element, "QuoteEntryID");

            return summary;
        }
    }
}