using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using CommunicatorDto;
using Rockend.iStrata.StrataWebsite.Model;

namespace Rockend.iStrata.StrataWebsite.Helpers
{
    public static class MaintenanceHelper
    {
        public static string GetWorkOrderStatus(string status)
        {
            switch (status)
            {
                case "A":
                    return "Awaiting Approval";
                case "S":
                    return "Sent";
                case "C":
                    return "Completed";
                case "R":
                    return "Rejected";
                case "H":
                    return "Hold";
                case "V":
                    return "Removed";
                case "N":
                    return "None";
                case "U":
                    return "Closed";
                default:
                    return "Unknown";
            }
        }

        public static string GetQuoteStatus(string status)
        {
            switch (status)
            {
                case "Q":
                    return "Requested";
                case "A":
                    return "Awaiting Approval";
                case "P":
                    return "Accepted";
                case "R":
                    return "Rejected";
                case "N":
                    return "Not Received";
                case "D":
                    return "Deferred";
                case "O":
                    return "Obsolete";
                case "U":
                    return "Closed";
                default:
                    return "Unknown";
            }
        }

        public static bool ShowMaintenanceTab(AgentContentStrataDto content, UserSession session)
        {
            return (content != null && content.ShowMaintenancePageExec && session != null && session.Role == Rockend.iStrata.StrataCommon.Role.ExecutiveMember)
                    || (content != null && content.ShowMaintenancePageOwner && session != null && session.Role == Rockend.iStrata.StrataCommon.Role.Owner);
        }
    }
}