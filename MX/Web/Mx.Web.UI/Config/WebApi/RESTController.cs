using System.Web.Http;
using Mx.Foundation.Services.Contracts.QueryServices;

namespace Mx.Web.UI.Config.WebApi
{
	[ApiExceptionFilterAttribute]
	[APIActionFilterAttribute]
    [AllowAnonymous]
	public abstract class RESTController : ApiController
	{
		public IUserAuthenticationQueryService UserAuthenticationQueryService { get;set; }
		public RESTController(IUserAuthenticationQueryService userAuthenticationQueryService)
			: base()
		{ 
			UserAuthenticationQueryService = userAuthenticationQueryService;
		}
	}
}
