using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Web;

namespace Mx.Web.Shared.Providers
{
    public interface IBusinessUserProvider
    {
        BusinessUser GetBusinessUser(HttpContext httpContext, IPrincipal userPrincipal);
    }
}
