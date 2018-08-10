using System;
using Mx.Web.UI.Config.Translations;

namespace Mx.Web.UI.Areas.Core.Api.Models
{
    [Translation("Core")]
    public class L10N
    {
        #region Menu Items

        public virtual String Workforce { get { return "Workforce"; } }

        public virtual String MenuOperations { get { return "Operations"; } }

        public virtual string HsSsoRedirect { get { return "HotSchedules"; } }

        #endregion

        #region general constants

        public virtual String Cancel { get { return "Cancel"; } }

        #endregion

        #region Date Range

        public virtual String Apply { get { return "Apply"; } }

        public virtual String Last { get { return "Last"; } }

        public virtual String Days { get { return "Days"; } }

        public virtual String CustomRange { get { return "Custom Range"; } }

        public virtual String To { get { return "To"; } }

        public virtual String From { get { return "From"; } }

        public virtual String SelectCustomRange { get { return "Select Custom Range"; } }

        #endregion

        #region Date Range Picker

        public virtual String PickerApply { get { return "Apply"; } }

        public virtual String PickerCancel { get { return "Cancel"; } }

        public virtual String PickerRange { get { return "Range"; } }

        public virtual String PickerWeek { get { return "Week"; } }

        public virtual String PickerMonth { get { return "Month"; } }

        public virtual String PickerTitle { get { return "Select Custom Range"; } }

        #endregion

        #region Backplane messages

        public virtual String BackplaneRefresh { get { return "Refresh"; } }

        public virtual String BackplaneMessage { get { return "System has been reinstated, click Refresh to reload"; } }

        public virtual String BackplaneTitle { get { return "System reinstated"; } }

        #endregion
    }
}