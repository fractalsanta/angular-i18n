using Mx.Web.UI.Areas.Core.Api.Models;

namespace Mx.Web.UI.Areas.Core.Api.Services
{
    public interface IAuthenticationService
    {
        BusinessUser User { get; }
        long UserId { get; }
    }
}
