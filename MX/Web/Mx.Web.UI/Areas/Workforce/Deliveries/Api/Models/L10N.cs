using System;
using Mx.Web.UI.Config.Translations;

namespace Mx.Web.UI.Areas.Workforce.Deliveries.Api.Models
{
    [Translation("WorkforceDeliveries")]
    public class L10N
    {
        public virtual String Deliveries { get { return "Deliveries"; } }
        public virtual String AddExtraDelivery { get { return "Add Extra Delivery"; } }
        public virtual String TotalDeliveries { get { return "Total Deliveries"; } }
        public virtual String ExtraDeliveries { get { return "Extra Deliveries"; } }
        public virtual String Employee { get { return "Employee"; } }
        public virtual String Comment { get { return "Comment"; } }
        public virtual String AuthorisedBy { get { return "Authorised By"; } }
        public virtual String Status { get { return "Status"; } }
        public virtual String Approve { get { return "Approve"; } }
        public virtual string ApproveExtraDeliveryFor { get { return "Approve extra delivery for"; } }
        public virtual string DenyExtraDeliveryFor { get { return "Deny extra delivery for"; } }
        public virtual String Deny { get { return "Deny"; } }
        public virtual String Authorization { get { return "Authorization"; } }
        public virtual String DeliveryDeny { get { return "Are you sure you want to deny this entry?"; } }
        public virtual String Approved { get { return "Approved"; } }
        public virtual String Denied { get { return "Denied"; } }
        public virtual String PendingApproval { get { return "Pending Approval"; } }
        public virtual String OrderNumber { get { return "Order #"; } }
        public virtual String Username { get { return "Username"; } }
        public virtual String Password { get { return "Password"; } }
        public virtual String Submit { get { return "Submit"; } }
        public virtual String Cancel { get { return "Cancel"; } }
        public virtual String Authorize { get { return "Authorize"; } }
        public virtual String ExtraDelivery { get { return "Extra Delivery"; } }
        public virtual String InvalidCredentials { get { return "Credentials supplied are invalid to authorize this request"; } }
        public virtual String PleaseSelect { get { return "Please select.."; } }
    }
}
