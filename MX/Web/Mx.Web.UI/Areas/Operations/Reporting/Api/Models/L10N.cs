    using Mx.Web.UI.Config.Translations;

namespace Mx.Web.UI.Areas.Operations.Reporting.Api.Models
{
    [Translation("OperationsReporting")]
    public class L10N
    {
        public virtual string ViewManager { get { return "View Manager"; } }
        public virtual string VmBack { get { return "Back"; } }
        public virtual string VmDefault { get { return "Default"; } }
        public virtual string VmCreate { get { return "Create"; } }
        public virtual string VmActions { get { return "Actions"; } }
        public virtual string VmActionSave { get { return "Save"; } }
        public virtual string VmActionDelete { get { return "Delete"; } }
        public virtual string VmViewName { get { return "View Name"; } }
        public virtual string VmManageColumns { get { return "Manage Columns"; } }
        public virtual string VmColumns { get { return "Columns"; } }
        public virtual string VmActiveColumns { get { return "Active Columns"; } }
        public virtual string VmCreateNewMessage { get { return "Please create or select view"; } }
        public virtual string VmUpdated { get { return "{0} updated"; } }
        public virtual string VmCreated { get { return "{0} created"; } }
        public virtual string VmDeleted { get { return "{0} deleted"; } }
        public virtual string VmGlobalView { get { return "Global View"; } }

        // Drag and drop dummy column descriptions
        public virtual string VmAddColumns { get { return "No columns selected"; } }
        public virtual string VmNoAvailableColumns { get { return "No columns available"; } }
    }
}