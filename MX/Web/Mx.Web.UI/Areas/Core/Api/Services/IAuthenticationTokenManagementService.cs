using System;
using Mx.Web.UI.Areas.Core.Api.Models;

namespace Mx.Web.UI.Areas.Core.Api.Services
{
    public interface IAuthenticationTokenManagementService
    {
        TokenVerificationResponse VerifyIdentity(string token, DateTime verificationTime);
        string CreateToken(string username, long userId, DateTime creationTime);
    }
}