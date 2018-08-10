using System;
using Mx.Web.UI.Config.Translations;

namespace Mx.Web.UI.Areas.Workforce.DriverDistance.Api.Models
{
    [Translation("WorkforceDriverDistance")]
    public class L10N
    {
        public virtual String DriverDistance { get { return "Driver Distance"; } }
        public virtual String DriveDistanceRecords { get { return "Drive Distance Records"; } }
        public virtual String Employee { get { return "Employee"; } }
        public virtual String TotalShiftDistance { get { return "Total Shift Distance"; } }
        public virtual String AuthorizedBy { get { return "Authorized By"; } }
        public virtual String Status { get { return "Status"; } }
        public virtual String AddDriveRecord { get { return "Add Drive Record"; } }
        public virtual String Approve { get { return "Approve"; } }
        public virtual String Deny { get { return "Deny"; } }
        public virtual String Approved { get { return "Approved"; } }
        public virtual String Denied { get { return "Denied"; } }
        public virtual String PendingApproval { get { return "Pending Approval"; } }
        public virtual String DriveRecord { get { return "Drive Record"; } }
        public virtual String PleaseSelect { get { return "Please select..."; } }
        public virtual String ShiftStartOdom { get { return "Shift Start Odom Read"; } }
        public virtual String ShiftEndOdom { get { return "Shift End Odom Read"; } }
        public virtual String Authorize { get { return "Authorize"; } }
        public virtual String Submit { get { return "Submit"; } }
        public virtual String Cancel { get { return "Cancel"; } }
        public virtual String ApproveTitle { get { return "Authorization"; } }
        public virtual String ApproveMessage { get { return "Approve drive record for"; } }
        public virtual String DenyTitle { get { return "Are you sure you want to deny this entry?"; } }
        public virtual String DenyMessage { get { return "Deny drive record for"; } }
        public virtual String InvalidCredentials { get { return "Credentials supplied are invalid to authorize this request."; } }
        public virtual String OdomError { get { return "Start reading must be less than end reading."; } }
    }
}