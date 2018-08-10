using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Workforce.Deliveries.Api.Models.Enums;

namespace Mx.Web.UI.Areas.Workforce.Deliveries.Api.Models
{

    public class DeliveryAuthorisedRequest
    {
        public int Id { get; set; }
        public ExtraDeliveryOrderStatus Status { get; set; }
        public string DenyReason { get; set; }
        public SupervisorAuthorization Authorization { get; set; }
    }
}