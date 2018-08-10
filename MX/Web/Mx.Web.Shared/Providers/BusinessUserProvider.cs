using System.Security.Principal;
using System.Web;
using System.Web.Security;

namespace Mx.Web.Shared.Providers
{
    public class BusinessUserProvider : IBusinessUserProvider
    {
        private readonly IProviderCache _providerCache;
        private BusinessUser _businessUser;

        public BusinessUserProvider(IProviderCache providerCache)
        {
            _providerCache = providerCache;
        }
        public BusinessUser GetBusinessUser(HttpContext httpContext, IPrincipal userPrincipal)
        {
            if (!userPrincipal.Identity.IsAuthenticated)
                return _providerCache.GetMissingUser();

            if (_businessUser != null)
                return _businessUser;

            if (!userPrincipal.Identity.IsAuthenticated) return _businessUser;

            var user = httpContext.Profile.GetPropertyValue("BusinessUser") as BusinessUser;

            if (user == null)
            {
                FormsAuthentication.SignOut();
                return _providerCache.GetMissingUser();
            }

            _businessUser = user;

            return _businessUser;
        }
    }
}
