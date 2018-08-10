using Mx.Web.UI.Config.Translations;

namespace Mx.Web.UI.Areas.Workforce.MyTimeCard.Api.Models
{
    [Translation("WorkforceMyTimeCard")]
    public class L10N
    {
        public virtual string MyTimeCard { get { return "My Time Card"; } }
        public virtual string Paid { get { return "Paid"; } }
        public virtual string Unpaid { get { return "Unpaid"; } }
        public virtual string Meal { get { return "Meal"; } }
        public virtual string Rest { get { return "Rest"; } }
        public virtual string Break { get { return "Break"; } }
        public virtual string HoursFormat { get { return "{0}hrs"; } }
        public virtual string TotalHours { get { return "Total Hrs"; } }
    }
}
