using Mx.Web.UI.Areas.Core.Api.Models;

namespace Mx.Web.UI.Areas.Core.Api.Services
{
    public interface ISupervisorAuthorizationService
    {
        /// <summary>
        /// Take security tokens (currently username and password) and check for authorization
        /// </summary>
        /// <returns>user and whether they have all permissions listed</returns>
        SupervisorAuthorizationResponse Authorize(SupervisorAuthorization auth, Task[] tasks);
    }
}
