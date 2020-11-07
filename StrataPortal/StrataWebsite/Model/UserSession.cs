using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Rockend.iStrata.StrataCommon.BusinessEntities;
using Rockend.iStrata.StrataCommon.Response;
using System.Text;
using System.Web.Mvc;
using Rockend.iStrata.StrataWebsite.Helpers;
using Rockend.iStrata.StrataCommon;
using Rockend.WebAccess.Common.Helpers;
using Rockend.Cms;
using Rockend.Cms.Providers;
using Communicator.DAL;
using System.Xml.Linq;

namespace Rockend.iStrata.StrataWebsite.Model
{
    /// <summary>
    /// Information about the current user that is consistant throughout the session.
    /// </summary>
    [Serializable]
    public class UserSession
    {
        public static UserSession CreateUserSession(LoginResponse loginResponse, Role selectedRole, string userName)
        {
            UserSession session = new UserSession();
            session.ReportPermissions = new List<ReportDataContainer>();
            session.ReportPermissions.AddRange(loginResponse.ReportPermissions);

            session.Reports = new List<WebAccessReports>();
            session.Reports.AddRange(loginResponse.Reports);
            
            session.ExecutiveMemberNames = CreateExecutiveMemberNames(loginResponse.ExecutiveMembers, loginResponse.LotList);

            if (selectedRole == Role.ExecutiveMember)
            {
                CreateExecutiveMemberNames(loginResponse.ExecutiveMembers, loginResponse.LotList);
            }

            // Add lot names to List
            session.LotNamesOnTitle = new List<string>();
            if (loginResponse.LotList != null)
                loginResponse.LotList.ForEach(l => session.LotNamesOnTitle.Add(l.OwnerNameOnTitle));

            session.LotNames = CreateLotNames(loginResponse.LotList);
            session.LotOwners = CreateLotOwners(loginResponse.LotList);
            session.IsOwner = loginResponse.IsOwner;
            session.OwnersCorpNames = CreateOwnersCorpNames(loginResponse.LotList);
            session.ExecutiveCorpNames = CreateExecutiveCorpNames(loginResponse.ExecutiveMembers, loginResponse.LotList);
            session.ExecutiveMemberNamesAndAddress = CreateExecutiveMemberNamesAndAddress(loginResponse.ExecutiveMembers, loginResponse.LotList);
            session.Terminology = loginResponse.Terminology;
            session.Role = selectedRole;
            session.UserName = userName;
            session.Meetings = loginResponse.MeetingList;
            session.CurrentContactID = loginResponse.MainContact.ContactID;
            session.CurrentUsersName = loginResponse.MainContact.Name;

            session.MaintenanceWorkOrders = GetWorkOrders(loginResponse.MaintenanceXml);
            session.MaintenanceQuotes = GetQuotes(loginResponse.MaintenanceXml);

            session.PlanNumbers = new List<string>();
            loginResponse.LotList.ForEach(l => session.PlanNumbers.Add(l.OwnerCorpName));

            return session;
        }

        private static List<WorkOrderSummary> GetWorkOrders(string xml)
        {
            if (string.IsNullOrWhiteSpace(xml))
            {
                return null;
            }

            try
            {
                List<WorkOrderSummary> orderObjects = new List<WorkOrderSummary>();
                XElement root = XElement.Parse(xml);
                IEnumerable<XElement> workOrders = root.Element("WorkOrders").Elements("WorkOrder");

                foreach (XElement workOrder in workOrders)
                {
                    orderObjects.Add(WorkOrderSummary.FromXml(workOrder));
                }

                return orderObjects;
            }
            catch (Exception e)
            {
                return null;
            }
        }

        private static List<QuoteSummary> GetQuotes(string xml)
        {
            if (string.IsNullOrWhiteSpace(xml))
            {
                return null;
            }

            try
            {
                List<QuoteSummary> orderObjects = new List<QuoteSummary>();
                XElement root = XElement.Parse(xml);
                IEnumerable<XElement> quotes = root.Element("Quotes").Elements("Quote");

                foreach (XElement quote in quotes)
                {
                    orderObjects.Add(QuoteSummary.FromXml(quote));
                }

                return orderObjects;
            }
            catch (Exception e)
            {
                return null;
            }
        }

        public List<WebAccessReports> GetReports(int planId)
        {
            List<int> reportIds = this.ReportPermissions.Where(r => r.PlanId == planId).Select(r => r.ReportId).ToList();
            return this.Reports.Where(r => reportIds.Contains(r.WebAccessReportsID)).ToList();
        }

        public static List<DropdownItem> CreateExecutiveMemberNames(List<ExecutiveDescription> executiveMembers, List<LotInfo> lots)
        {
            List<DropdownItem> retVal = executiveMembers.Select(em => CreateExecutiveMemberNamesItem(em, lots)).ToList();
            return retVal;
        }

        public static List<ExecMemberAndAddress> CreateExecutiveMemberNamesAndAddress(List<ExecutiveDescription> executiveMembers, List<LotInfo> lots)
        {
            List<ExecMemberAndAddress> list = new List<ExecMemberAndAddress>();
            
            executiveMembers.ForEach(em => {
                ExecMemberAndAddress member = new ExecMemberAndAddress();
                member.Name = em.Name;
                member.Address = GetLotAddress(lots.FirstOrDefault(l => l.LotID == em.LotID));
                list.Add(member);
            });

            return list;
        }

        public static DropdownItem CreateExecutiveMemberNamesItem(ExecutiveDescription member, List<LotInfo> lotList)
        {
            StringBuilder execName = new StringBuilder();
            if (!string.IsNullOrEmpty(member.Name))
            {
                execName.Append("Member - ");
                execName.Append(member.Name);
                execName.Append(" / ");
            }

            LotInfo lot = lotList.FirstOrDefault(l => l.LotID == member.LotID);
            if (lot != null)
            {
                execName.Append(GetLotAddress(lot));
            }

            return new DropdownItem(member.ExecMemberID, HttpUtility.HtmlEncode(execName));
        }

        private static string GetLotAddress(LotInfo lot)
        {
            if (lot == null)
            {
                return string.Empty;
            }

            StringBuilder execName = new StringBuilder();
            execName.Append("Lot ");
            execName.Append(lot.LotNumberPrefix);
            execName.Append(lot.LotNumber);
            execName.Append(lot.LotNumberSuffix);
            execName.Append(", Unit ");
            execName.Append(lot.UnitName);
            execName.Append(", ");
            execName.Append(lot.OwnerCorpType);
            execName.Append(" ");
            execName.Append(lot.OwnerCorpName);

            return execName.ToString();
        }

        public static List<DropdownItem> CreateLotNames(List<LotInfo> lots)
        {
            List<DropdownItem> retVal = lots.Select(lot => CreateLotNamesItem(lot)).ToList();
            return retVal;
        }

        public static DropdownItem CreateLotNamesItem(LotInfo lot)
        {
            StringBuilder lotName = new StringBuilder();
            if (!string.IsNullOrEmpty(lot.OwnerNameOnTitle))
            {
                lotName.Append("Lot Owner - ");
                lotName.Append(lot.OwnerNameOnTitle);
                lotName.Append(" / ");
            }

            lotName.Append("Lot ");
            lotName.Append(lot.LotNumberPrefix);
            lotName.Append(lot.LotNumber);
            lotName.Append(lot.LotNumberSuffix);
            lotName.Append(", Unit ");
            lotName.Append(lot.UnitName);
            lotName.Append(", ");
            lotName.Append(lot.OwnerCorpType);
            lotName.Append(" ");
            lotName.Append(lot.OwnerCorpName);

            return new DropdownItem(lot.LotID, HttpUtility.HtmlEncode(lotName), lot.OwnerCorpID, lot.LotNumber);
        }

        public static List<DropdownItem> CreateLotOwners(List<LotInfo> lots)
        {
            IEnumerable<int> ownerIds = lots.Select(lot => lot.OwnerID).Distinct();
            List<DropdownItem> retVal = ownerIds.Select(
                id => CreateLotOwnersItem(lots.Where(lot => lot.OwnerID == id))
            ).ToList();
            return retVal;
        }

        public static DropdownItem CreateLotOwnersItem(IEnumerable<LotInfo> lots)
        {
            StringBuilder lotNums = new StringBuilder(lots.Count() > 1 ? "Lots " : "Lot ");
            StringBuilder unitNums = new StringBuilder(lots.Count() > 1 ? "Units " : "Unit ");
            LotInfo firstLot = null;
            foreach (LotInfo lot in lots)
            {
                string unitNumber = lot.UnitName.Replace("/", "\\");
                int index = unitNumber.IndexOf("unit", StringComparison.InvariantCultureIgnoreCase);
                while (index >= 0)
                {
                    unitNumber = unitNumber.Remove(index, 4);
                    index = unitNumber.IndexOf("unit", StringComparison.InvariantCultureIgnoreCase);
                }

                if (firstLot == null)
                {
                    firstLot = lot;
                }
                else
                {
                    lotNums.Append(",");
                    unitNums.Append(",");
                }
                lotNums.Append(lot.LotNumberPrefix);
                lotNums.Append(lot.LotNumber);
                lotNums.Append(lot.LotNumberSuffix);
                unitNums.Append(unitNumber);
            }
            if (firstLot == null)
            {
                return null;
            }

            return new DropdownItem(
                firstLot.OwnerID,
                string.Format("{0} {1}/{2}", lotNums, unitNums, firstLot.LotAddressLine1), firstLot.OwnerCorpID, firstLot.LotNumber);

        }

        public static List<DropdownItem> CreateExecutiveCorpNames(List<ExecutiveDescription> exec, List<LotInfo> lots)
        {
            List<DropdownItem> result = new List<DropdownItem>();

            foreach (ExecutiveDescription ed in exec)
            {
                LotInfo li = (from l in lots
                              where l.LotID == ed.LotID
                              select l).FirstOrDefault();

                if (li != null)
                {
                    result.Add(CreateOwnersCorpNamesItem(li));
                }
            }

            return result;
        }

        public static List<DropdownItem> CreateOwnersCorpNames(List<LotInfo> lots)
        {
            List<DropdownItem> retVal = lots.Select(lot => CreateOwnersCorpNamesItem(lot)).Distinct().ToList();
            return retVal;
        }

        public static DropdownItem CreateOwnersCorpNamesItem(LotInfo lot)
        {
            string name = lot.OwnerCorpType + " " + lot.OwnerCorpName;
            return new DropdownItem(lot.OwnerCorpID, HttpUtility.HtmlEncode(name));
        }

        public override string ToString()
        {
            return string.Format("UserSession: username:{0} role:{1}"
                , UserName ?? "null", Role);
        }

        public List<string> LotNamesOnTitle { get; set; }

        public List<ReportDataContainer> ReportPermissions { get; private set; }

        public List<WebAccessReports> Reports { get; set; }

        public List<BudgetDropdownItem> Budgets { get; set; }

        public List<DropdownItem> ExecutiveMemberNames { get; private set; }

        public bool IsOwner { get; private set; }

        public List<DropdownItem> LotNames { get; private set; }

        public List<DropdownItem> LotOwners { get; private set; }

        public List<DropdownItem> OwnersCorpNames { get; private set; }

        public List<DropdownItem> ExecutiveCorpNames { get; private set; }

        public Dictionary<string, string> Terminology { get; private set; }

        public Role Role { get; private set; }

        public string UserName { get; private set; }

        public List<ExecMemberAndAddress> ExecutiveMemberNamesAndAddress { get; set; }

        public Dictionary<int, List<MeetingResponse>> Meetings { get; set; }

        public int CurrentContactID { get; set; }

        public AgencyModel Agency { get; set; }

        public List<string> PlanNumbers { get; set; }

        public string CurrentUsersName { get; set; }

        public bool HasFileSmartEnabled { get; set; }

        public List<WorkOrderSummary> MaintenanceWorkOrders { get; set; }
        public List<QuoteSummary> MaintenanceQuotes { get; set; }
        public int StrataVersionNumber { get; set; }
    }

    [Serializable]
    public class ExecMemberAndAddress
    {
        public string Name { get; set; }
        public string Address { get; set; }
        public int ID { get; set; }
    }
}
