using System;
using Mx.Web.UI.Config.Translations;

namespace Mx.Web.UI.Areas.Workforce.MyAvailability.Api.Models
{
    [Translation("WorkforceMyAvailability")]
    public class L10N
    {
        public virtual String MyAvailability { get { return "My Availability"; } }
        public virtual String NoAvailability { get { return "No Availability"; } }
        public virtual String Hours { get { return "h"; } }
        public virtual String Minutes { get { return "m"; } }
        public virtual String Close { get { return "Close"; } }
        public virtual String Available { get { return "Available"; } }
        public virtual String AvailabilityFor { get { return "Availability for"; } }
        public virtual String AddAvailability { get { return "Add Availability"; } }
        public virtual String EditAvailability { get { return "Edit Availability"; } }
        public virtual String AllDay { get { return "All Day"; } }
        public virtual String DayOfWeek { get { return "Day Of Week"; } }
        public virtual String Day { get { return "Day"; } }
        public virtual String Yes { get { return "Yes"; } }
        public virtual String No { get { return "No"; } }
        public virtual String Back { get { return "Back"; } }
        public virtual String AvailabilitySave { get { return "Save"; } }
        public virtual String Cancel { get { return "Cancel"; } }
        public virtual String Time { get { return "Time"; } }
        public virtual String StartTime { get { return "Start Time"; } }
        public virtual String EndTime { get { return "End Time"; } }
        public virtual String PleaseSelectDay { get { return "Please Select a Day."; } }
        public virtual String Add { get { return "Add"; } }
        public virtual String Update { get { return "Update"; } }
        public virtual String OverLappingTimes { get { return "Availability entries cannot overlap"; } }
        public virtual String StartTimeBeforeEnd { get { return "Availability entries must be within calendar day (12am - 11:59pm)"; } }
        public virtual String TimeInvalid { get { return "Time is invalid"; } }

    }
}
