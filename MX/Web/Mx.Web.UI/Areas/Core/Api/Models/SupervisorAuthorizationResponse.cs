
namespace Mx.Web.UI.Areas.Core.Api.Models
{
    public class SupervisorAuthorizationResponse
    {
        public BusinessUser User { get; set; }
        public bool Authorized { get; set; }
    }
}