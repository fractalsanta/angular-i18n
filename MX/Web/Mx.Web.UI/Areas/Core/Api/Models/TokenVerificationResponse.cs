using Mx.Web.UI.Config.WebApi;

namespace Mx.Web.UI.Areas.Core.Api.Models
{
    public class TokenVerificationResponse
    {
        public BaseIdentity Identity { get; set; }
        public string SlidingToken { get; set; }
    }
}