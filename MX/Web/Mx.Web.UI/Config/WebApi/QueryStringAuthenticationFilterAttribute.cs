using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Principal;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http.Filters;
using Mx.Web.UI.Areas.Core.Api.Services;
using StructureMap;

namespace Mx.Web.UI.Config.WebApi
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class QueryStringAuthenticationFilterAttribute : Attribute, IAuthenticationFilter
    {
        private const string AuthenticationTokenName = "AuthToken";
        private readonly IAuthenticationTokenManagementService _authenticationServiceFactory;

        public QueryStringAuthenticationFilterAttribute()
        {
            _authenticationServiceFactory = ObjectFactory.Container.GetInstance<IAuthenticationTokenManagementService>();
        }

        public bool AllowMultiple
        {
            get { return false; }
        }

        public Task AuthenticateAsync(HttpAuthenticationContext context, CancellationToken cancellationToken)
        {
            if (context.Request.GetQueryNameValuePairs().Any(q => q.Key == AuthenticationTokenName))
            {
                var token = context.Request.GetQueryNameValuePairs().First(q => q.Key == AuthenticationTokenName).Value;

                var verificationResponse = _authenticationServiceFactory.VerifyIdentity(token, DateTime.Now);

                if (verificationResponse != null)
                {
                    context.Principal = new GenericPrincipal(verificationResponse.Identity, new string[0]);
                }
            }
            
            if (!context.Principal.Identity.IsAuthenticated)
            {
                context.ActionContext.Response = new HttpResponseMessage(HttpStatusCode.Forbidden);    
            }
            
            return Task.FromResult(0);
        }

        public Task ChallengeAsync(HttpAuthenticationChallengeContext context, CancellationToken cancellationToken)
        {
            return Task.FromResult(0);
        }
    }
}