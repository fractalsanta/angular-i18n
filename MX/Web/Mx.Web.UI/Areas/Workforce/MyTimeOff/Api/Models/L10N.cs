using System;
using Mx.Web.UI.Config.Translations;

namespace Mx.Web.UI.Areas.Workforce.MyTimeOff.Api.Models
{
    [Translation("WorkforceMyTimeOff")]
    public class L10N
    {
        public virtual String MyTimeOff { get { return "My Time Off"; } }
        public virtual String NoTimeOffRequestsFound { get { return "No time off requests found."; } }
        public virtual String TimeOffRequest { get { return "Time Off Request"; } }
        public virtual String Approved { get { return "Approved"; } }
        public virtual String Pending { get { return "Pending"; } }
        public virtual String Denied { get { return "Denied"; } }
        public virtual String AllDay { get { return "All Day"; } }
        public virtual String Starts { get { return "Starts"; } }
        public virtual String Ends { get { return "Ends"; } }
        public virtual String Reason { get { return "Reason"; } }
        public virtual String Comment { get { return "Comment"; } }
        public virtual String SubmittedOn { get { return "Submitted on"; } }
        public virtual String By { get { return "By"; } }
        public virtual String ManagerComment { get { return "Manager Comment"; } }
        public virtual String Back { get { return "Back"; } }
        public virtual String RemoveRequest { get { return "Remove Time Off Request"; } }
        public virtual String ConfirmRemoveRequest { get { return "Confirm Remove Request"; } }
        public virtual String Remove { get { return "Remove"; } }
        public virtual String RequestRemoved { get { return "Request removed."; } }
        public virtual String RemoveRequestConfirmation { get { return "Remove Request Confirmation"; } }
        public virtual String RemoveTimeOffRequest { get { return "Remove Time Off Request?"; } }
        public virtual String PleaseSelectRequest { get { return "Please select a request."; } }
        public virtual String Add { get { return "Add"; } }
        public virtual String DiscardRequestConfirmation { get { return "Discard New Request"; } }
        public virtual String DiscardTimeOffRequest { get { return "Discard the time off request in progress?"; } }
        public virtual String AddTimeOffRequest { get { return "Add Time Off Request"; } }
        public virtual String Submit { get { return "Submit"; } }
        public virtual String TimeOffRequestOverlaps { get { return "New time off request overlaps with existing request."; } }
        public virtual String StartAndEndTimeCannotBeTheSame { get { return "Start and End Time cannot be the same."; } }
        public virtual String Confirm { get { return "Confirm"; } }
    }
}
