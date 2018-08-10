using System;
using Mx.Web.UI.Config.Translations;

namespace Mx.Web.UI.Areas.Workforce.MySchedule.Api.Models
{
    [Translation("WorkforceMySchedule")]
    public class L10N
    {
        public virtual String MySchedule { get { return "My Schedule"; } }
        public virtual String Refresh { get { return "Refresh"; } }
        public virtual String Share { get { return "Share"; } }
        public virtual String ScheduledHours { get { return "Scheduled Hours"; } }
        public virtual String Hours { get { return "h"; } }
        public virtual String Minutes { get { return "m"; } }
        public virtual String ShareSchedule { get { return "Share Schedule"; } }
        public virtual String AddToCalendar { get { return "Add To Calendar"; } }
        public virtual String ShareViaEmail { get { return "Share via Email"; } }
        public virtual String Close { get { return "Close"; } }
        public virtual String TimeOffRequestApproved { get { return "Time Off Request Approved"; } }
        public virtual String TimeOffRequestPending { get { return "Time Off Request Pending"; } }
        public virtual String TimeOffRequestDenied { get { return "Time Off Request Denied"; } }
        public virtual String TimeOffRequestExpired { get { return "Time Off Request Expired"; } }
        public virtual String TimeOffRequestCancelled { get { return "Time Off Request Cancelled"; } }
        public virtual String Back { get { return "Back"; } }
        public virtual String Break { get { return "Break"; } }
        public virtual String Manager { get { return "Manager"; } }
        public virtual String Team { get { return "Team"; } }       
        public virtual String NoConfirmedSchedules { get { return "There are no confirmed shifts for week"; } }
        public virtual String PleaseSelectShift { get { return "Please select a shift."; } }
        public virtual String ScheduleEmailIntroMessage { get { return "Please see your calendar below:"; } }
        public virtual String ScheduleAllDay { get { return "All Day"; } }
    }
}
