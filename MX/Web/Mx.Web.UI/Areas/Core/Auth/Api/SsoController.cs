using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Net.Http.Headers;
using System.Security;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Web;
using System.Web.Http;
using System.Xml;
using ComponentSpace.SAML2.Protocols;
using Mx.Configuration;
using Mx.Foundation.Services.Contracts.QueryServices;
using Mx.Services.Shared.Contracts.Enums;
using Mx.Services.Shared.Contracts.Services;
using Mx.Services.Shared.Persistence;
using Mx.Services.Shared.Persistence.Enums;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Config.Saml;
using Mx.Web.UI.Config;
using Mx.Web.UI.Config.Sso;

namespace Mx.Web.UI.Areas.Core.Auth.Api
{
    [AllowAnonymous]
    public class SsoController : ApiController
    {
        private static Boolean? _useFederationId;
        private readonly IUserAuthenticationQueryService _userAuthenticationQueryService;
        private readonly IAuthenticationTokenManagementService _tokenManagementService;
        private readonly IConfigurationService _configService;
        private readonly IUnitOfWorkManager _unitOfWorkManager;

        public SsoController(IUserAuthenticationQueryService userAuthenticationQueryService,
            IAuthenticationTokenManagementService tokenManagementService,
            IConfigurationService configService,
            IUnitOfWorkManager unitOfWorkManager
            )
        {
            _userAuthenticationQueryService = userAuthenticationQueryService;
            _tokenManagementService = tokenManagementService;
            _configService = configService;
            _unitOfWorkManager = unitOfWorkManager;
        }


        public bool GetSsoEnabled()
        {
            return SamlHelper.IsSamlEnabled;
        }
        
        public HttpResponseMessage SsoLogoutLanding([FromBody]FormDataCollection formbody)
        {
            var samlResponse = formbody.GetValues("SAMLResponse")[0];
            var samlResponseXml = Encoding.UTF8.GetString(Convert.FromBase64String(samlResponse));
            var doc = new XmlDocument();
            doc.LoadXml(samlResponseXml);
            var logoutResponseXml = doc.DocumentElement;
            var x509Certificate = (X509Certificate2)HttpContext.Current.Application[SamlHelper.IdpX509Certificate];

            if (!SAMLMessageSignature.Verify(logoutResponseXml, x509Certificate))
                throw new SecurityException("The SAML response signature failed to verify");
            
            var response = Request.CreateResponse(HttpStatusCode.Found);
            var rootUrl = HttpContext.Current.Request.Url.Scheme + "://" + HttpContext.Current.Request.Url.Authority + "/";
            response.Headers.Location = new Uri(rootUrl);
            // handles situation where the SsoAuth cookie was passed from MMS on the .macromatix domain
            SsoCookieHelper.ClearSsoCookie("SsoAuth",true);
            return response;
        }

        public HttpResponseMessage PostSsoLogon()
        {
            var useFederationId = GetUseFederationIdSetting();
            String userName, requestedUrl;
            string rootUrl = Request.RequestUri.Scheme + "://" + Request.RequestUri.Authority;

            SamlHelper.ProcessLoginResponse(rootUrl, useFederationId,
                useFederationId ? (en => LookupEmployeeUserNameByEmployeeNumber(en)) : (Func<String, String>)null, out userName, out requestedUrl,
                MxAppSettings.MobileIdpArtifactResponderURL);

            var user = _userAuthenticationQueryService.GetByUserName(userName);
            var token = _tokenManagementService.CreateToken(user.UserName, user.Id, DateTime.Now);

            var response = Request.CreateResponse(HttpStatusCode.Redirect);

            // if the user is not mapped internally, redirect them to the logon screen
            if (user.UserName != null)
            {
                var cookie = new CookieHeaderValue(Startup.SsoAuthCookieName, "\"" + token + "\"")
                {
                    Expires = DateTimeOffset.Now.AddDays(1),
                    Domain = null,
                    Path = "/"
                };
                response.Headers.AddCookies(new[] { cookie });
                response.Headers.Location = new Uri(string.IsNullOrEmpty(requestedUrl) ? rootUrl : requestedUrl);
            }
            else
            {
                var url = SamlHelper.LogoutSaml(userName);
                response.Headers.Location = new Uri(url);               
            }

            return response;
        }

        private Boolean GetUseFederationIdSetting()
        {
            if (!_useFederationId.HasValue)
            {
                using (_unitOfWorkManager.CreateUnitOfWork(UnitOfWorkCommit.Never))
                {
                    var configSetting = _configService.GetConfiguration(ConfigurationEnum.Core_SystemSetup_UseFederationIDForSSO);
                    _useFederationId = configSetting.As<Boolean>();
                }
            }
            return _useFederationId.Value;
        }

        private String LookupEmployeeUserNameByEmployeeNumber(String empNumber)
        {
            var users = _userAuthenticationQueryService.GetByEmployeeNumber(empNumber, 0).ToList();

            if (!users.Any() || users.First().EmployeeId == 0)
            {
                return null;
            }

            if (users.Count() > 1)
            {
                throw new SecurityException(String.Format("Employee Number: {0} does not uniquely identify a single employee.", empNumber));
            }

            return users.First().UserName;
        }
    }
}