using System.Web.Http;
using Mx.Web.UI.Config;

namespace Mx.Web.UI.Areas.Core.Api
{
    [AllowAnonymous]
    public class BackplaneController : ApiController
    {
        [HttpGet]
        public bool IsBackplaneActive()
        {
            return SignalRHubConfig.IsBackplaneActive;
        }

    }
}