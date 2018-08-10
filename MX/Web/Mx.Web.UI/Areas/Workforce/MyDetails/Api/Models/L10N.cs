using System;
using Mx.Web.UI.Config.Translations;

namespace Mx.Web.UI.Areas.Workforce.MyDetails.Api.Models
{
    [Translation("WorkforceMyDetails")]
    public class L10N
    {
        public virtual String MyDetails { get { return "My Details"; } }
        public virtual String Cancel { get { return "Cancel"; } }
        public virtual String Edit { get { return "Edit"; } }
        public virtual String ContactDetails { get { return "Contact Details"; } }
        public virtual String Name { get { return "Name"; } }
        public virtual String Phone { get { return "Phone"; } }
        public virtual String Mobile { get { return "Mobile"; } }
        public virtual String Email { get { return "Email"; } }
        public virtual String AddressDetails { get { return "Address Details"; } }
        public virtual String Home { get { return "Home"; } }
        public virtual String Mailing { get { return "Mailing"; } }
        public virtual String SameAsHome { get { return "Same as Home"; } }
        public virtual String EmergencyContact { get { return "Emergency Contact"; } }
        public virtual String Relationship { get { return "Relationship"; } }
        public virtual String Save { get { return "Save"; } }
        public virtual String CancelChanges { get { return "Cancel Changes"; } }
        public virtual String ExitMyDetails { get { return "Exit My Details without saving changes?"; } }
        public virtual String Yes { get { return "Yes"; } }
        public virtual String No { get { return "No"; } }
        public virtual String UpdateSuccess { get { return "The details have been updated successfully."; } }
        public virtual String Confirm { get { return "Confirm"; } }
        public virtual String ExitMyDetailsConfirmationMessage { get { return "Updates to your details will not be saved"; } }
    }
}