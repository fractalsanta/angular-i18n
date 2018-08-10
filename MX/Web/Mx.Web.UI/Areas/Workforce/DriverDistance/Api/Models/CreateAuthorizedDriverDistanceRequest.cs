using Mx.Web.UI.Areas.Core.Api.Models;

namespace Mx.Web.UI.Areas.Workforce.DriverDistance.Api.Models
{
    public class CreateAuthorizedDriverDistanceRequest
    {
        public CreateDriverDistanceRequest CreateDriverDistanceRequest { get; set; }
        public SupervisorAuthorization Authorization { get; set; }
    }
}