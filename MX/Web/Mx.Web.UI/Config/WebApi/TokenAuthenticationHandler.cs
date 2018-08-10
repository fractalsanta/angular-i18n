using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Security.Principal;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Config.Helpers;

namespace Mx.Web.UI.Config.WebApi
{
    public class TokenAuthenticationHandler: DelegatingHandler
    {
        private const string AuthenticationTokenName = "AuthToken";
        private readonly Func<IAuthenticationTokenManagementService> _managementServiceFactory;

        public TokenAuthenticationHandler(Func<IAuthenticationTokenManagementService> managementServiceFactory)
        {
            _managementServiceFactory = managementServiceFactory;
        }

        protected override Task<HttpResponseMessage> SendAsync(
            HttpRequestMessage request, 
            CancellationToken cancellationToken)
        {
            IEnumerable<string> foundValues = null;
            if (request.Headers.TryGetValues(AuthenticationTokenName, out foundValues))
            {
                string token = foundValues.FirstOrDefault();
                var result = _managementServiceFactory().VerifyIdentity(token, DateTime.Now);
                if (result != null)
                {
                    IPrincipal principal = new GenericPrincipal(result.Identity, new string[0]);
                    Thread.CurrentPrincipal = principal;
                    HttpContext.Current.User = principal;
                    return base.SendAsync(request, cancellationToken).ContinueWith(
                        task =>
                        {
                            var response = task.Result;
							if(response.StatusCode != System.Net.HttpStatusCode.Unauthorized)
							{
								if (result.SlidingToken.HasValue())
								{
									response.Headers.Add(AuthenticationTokenName, result.SlidingToken);
								}
							}
                            return response;
                        }, cancellationToken);

                }
            }
            return base.SendAsync(request, cancellationToken);
        }
    }
}