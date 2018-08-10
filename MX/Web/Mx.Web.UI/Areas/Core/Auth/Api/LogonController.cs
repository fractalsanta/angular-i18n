using System;
using System.Linq;
using System.Net;
using System.Web;
using AutoMapper;
using Mx.Administration.Services.Contracts.QueryServices;
using Mx.Foundation.Services.Contracts.PartnerLogin;
using Mx.Foundation.Services.Contracts.QueryServices;
using Mx.Foundation.Services.Contracts.Responses;
using Mx.Services.Shared.Auditing.Enums;
using Mx.Services.Shared.Auditing.Interfaces;
using Mx.Services.Shared.Contracts;
using Mx.Services.Shared.Security.Interfaces;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Areas.Core.Auth.Api.Models;
using System.Web.Http;
using Mx.Web.UI.Config.Sso;
using Mx.Web.UI.Config.WebApi;
using Mx.Services.Shared.Contracts.Services;
using Mx.Services.Shared.Contracts.Enums;
using Mx.Web.UI.Config.Translations;

namespace Mx.Web.UI.Areas.Core.Auth.Api
{
    public class LogonController: ApiController
    {
        private const string MobileLoginSuccessfulAuditTitle = "Mobile Login Successful";
        private const string MobileLoginFailureAuditTitle = "Mobile Login Failure";
        private const string MobilePartnerLoginAuditTitle = "Mobile Partner Login";

        private readonly IPartnerLoginAuthenticationQueryService _partnerLoginAuthenticationQueryService;
        private readonly IUserAuthenticationQueryService _userAuthenticationQueryService;
        private readonly IAuthenticationService _authenticationService;
        private readonly IAuditService _auditService;
        private readonly INetUtilityService _netUtilityService;
        private readonly IAuthenticationTokenManagementService _tokenManagementService;
        private readonly IEntityQueryService _entityQueryService;
        private readonly IConfigurationService _configurationService;
        private readonly ITranslationService _translationService;

        public LogonController(
            IPartnerLoginAuthenticationQueryService partnerLoginAuthenticationQueryService,
            IUserAuthenticationQueryService userAuthenticationQueryService, 
            IAuthenticationService authenticationService,
            IAuditService auditService,
            IAuthenticationTokenManagementService tokenManagementService,
            IEntityQueryService entityQueryService,
            INetUtilityService netUtilityService,
            IConfigurationService configurationService,
            ITranslationService translationService)
        {
            _partnerLoginAuthenticationQueryService = partnerLoginAuthenticationQueryService;
            _userAuthenticationQueryService = userAuthenticationQueryService;
            _authenticationService = authenticationService;
            _auditService = auditService;
            _tokenManagementService = tokenManagementService;
            _entityQueryService = entityQueryService;
            _netUtilityService = netUtilityService;
            _configurationService = configurationService;
            _translationService = translationService;
        }

        [AllowAnonymous]
        public LogonResponse PostUserLogon([FromBody]Credentials credentials)
        {
            var response = _userAuthenticationQueryService.ValidateUser(credentials.Username, credentials.Password);

            if (!response.IsValid)
            {
                AuditLogonFailure(credentials.Username);
                ProcessFailedLogonAttempt(credentials.Username);
            }

            return GetTokenAndAuditLogon(response, credentials.Username);
        }

        [AllowAnonymous]
        public LogonResponse PostUserLogonWithPin(String userName, String pin, String pinToken)
        {
            var response = _userAuthenticationQueryService.ValidateUserWithPin(userName, pin, pinToken);

            if (!response.IsValid)
            {
                AuditLogonFailure(userName);
                ProcessFailedLogonAttempt(userName);
            }

            return GetTokenAndAuditLogon(response, userName);
        }

        [AllowAnonymous]
        [ElmahError]
        public LogonResponse GetUser([FromUri] Int64? entityId = null)
        {
            //shared cookie
            //automatically logs-in external user if shared cookie available
            if (SsoCookieHelper.CheckCookieBasedSso())
            {
                var userName = SsoCookieHelper.CheckCookieSsoAndGetUser();
                var userRequest = _userAuthenticationQueryService.GetByUserName(userName);

                if (userRequest != null)
                {
                    var user = Mapper.Map<BusinessUser>(_userAuthenticationQueryService.GetByUserName(userName));
                    if (user != null)
                    {
                        ProcessRequestedEntityId(entityId, user);
                        var token = _tokenManagementService.CreateToken(user.UserName, user.Id, DateTime.Now);
                        AuditLogonSuccess(user);
                        return GetLogonResponse(user, token, true);                       
                    }
                }
            }
            else
            {
                var user = _authenticationService.User;
                if (user != null && user.Id > 0)
                {
                    ProcessRequestedEntityId(entityId, user);
                    var token = _tokenManagementService.CreateToken(user.UserName, user.Id, DateTime.Now);
                    return GetLogonResponse(user, token, false);                    
                }                
            }
            throw new HttpResponseException(HttpStatusCode.Unauthorized); 
        }

        private LogonResponse GetLogonResponse(BusinessUser user, string token, bool isSharedCookie)
        {
            var logonResponse = new LogonResponse
            {
                User = user,
                AuthToken = token,
                IsSharedCookieUsed = isSharedCookie
            };

            return logonResponse;
        }

        private void ProcessRequestedEntityId(Int64? entityId, BusinessUser user)
        {
            if (entityId.HasValue && user.MobileSettings != null)
            {
                if (user.AssignedLocations.Contains(entityId.Value))
                {
                    if (user.MobileSettings.EntityId != entityId.Value)
                    {
                        var entity = _entityQueryService.GetById(entityId.Value);
                        if (entity != null)
                        {
                            user.MobileSettings.EntityId = entity.Id;
                            user.MobileSettings.EntityName = entity.Name;
                            user.MobileSettings.EntityNumber = entity.Number;
                        }
                        else
                        {
                            throw new HttpResponseException(HttpStatusCode.Unauthorized);
                        }
                    }
                }
            }
        }

        private LogonResponse GetTokenAndAuditLogon(ValidateUserResponse response, String userName)
        {
            var userResponse = _userAuthenticationQueryService.GetByUserId(response.Id);
            ValidatePasswordExpiry(userResponse);
                
            var token = _tokenManagementService.CreateToken(userResponse.UserName, response.Id, DateTime.Now);
            var businessUser = Mapper.Map<BusinessUser>(userResponse);
            var partnerId = SsoCookieHelper.CheckCookieAndGetPartnerId();

            if (!string.IsNullOrEmpty(partnerId))
            {
                SsoCookieHelper.ClearCookiePartnerId();
                if (_partnerLoginAuthenticationQueryService.LinkPartner(partnerId, response.Id))
                {
                    AuditPartnerLoginLinkSuccess(partnerId, businessUser);
                }
            }

            AuditLogonSuccess(businessUser);
            return GetLogonResponse(businessUser, token, false);
        }

        private void ProcessFailedLogonAttempt(String userName)
        {
            var user = _userAuthenticationQueryService.GetByUserName(userName);
            var maxLoginAttempsBeforeAccountDisabled = _configurationService.GetConfiguration(ConfigurationEnum.Labor_EmployeeManagement_MaxLoginAttemptsBeforeUserLogonIsDisabled).As<Byte>();
            var coolingOffPeriodMinutes = _configurationService.GetConfiguration(ConfigurationEnum.Labor_EmployeeManagement_DelayInMinutesBeforeDisabledLogonCanBeEnabled).As<Int32>();

            if (user.Id > 0 && maxLoginAttempsBeforeAccountDisabled > 0)
            {
                user = _userAuthenticationQueryService.HandleFailedLogonAttempt(userName, maxLoginAttempsBeforeAccountDisabled, coolingOffPeriodMinutes);
                var l10N = _translationService.Translate<Mx.Web.UI.Areas.Core.Auth.Api.Models.L10N>(user.Culture);

                if (coolingOffPeriodMinutes > 0 && user.FailedLogonAttempts == maxLoginAttempsBeforeAccountDisabled)
                    throw new CustomErrorMessageException(HttpStatusCode.Conflict, new ErrorMessage(string.Format(l10N.AccountDisabledPleaseWait, coolingOffPeriodMinutes)));

                if (user.LogonDisabled)
                    throw new CustomErrorMessageException(HttpStatusCode.Conflict, new ErrorMessage(l10N.AccountDisabled));
            }

            throw new HttpResponseException(HttpStatusCode.Unauthorized);
        }

        private void ValidatePasswordExpiry(UserResponse userResponse)
        {
            var daysUntilPasswordExpires = _configurationService.GetConfiguration(ConfigurationEnum.Labor_EmployeeManagement_NumberOfDaysUntilPasswordExpires).As<Int32>();

            if (daysUntilPasswordExpires > 0 && (DateTime.UtcNow - userResponse.PasswordLastChanged).Days > daysUntilPasswordExpires)
            {
                AuditLogonFailure(userResponse.UserName);
                var l10N = _translationService.Translate<Mx.Web.UI.Areas.Core.Auth.Api.Models.L10N>(userResponse.Culture);
                throw new CustomErrorMessageException(HttpStatusCode.Conflict, new ErrorMessage(l10N.PasswordExpired));
            }
        }

        private void AuditLogonFailure(String username)
        {
            var auditString = string.Format("Login failed for user name: {0}. User Host Name : {1}. Browser: {2}", username, GetUserHostName(), GetUserBrowser());
            var user = new AuditUser {UserName = username};
            _auditService.AuditEvent(user, AuditEvent.SystemAdmin_MxConnectUserLoginFailure, MobileLoginFailureAuditTitle, auditString,
                GetUserIp());
        }

        private void AuditLogonSuccess(BusinessUser user)
        {
            var auditString = string.Format("Login successful for user name: {0}. User Host Name : {1}. Browser: {2}", user.UserName, GetUserHostName(), GetUserBrowser());
            _auditService.AuditEvent(Mapper.Map<BusinessUser, AuditUser>(user), AuditEvent.SystemAdmin_MxConnectUserLoginSuccess,
                MobileLoginSuccessfulAuditTitle, auditString, GetUserIp());
        }

        private string GetUserIp()
        {
            return _netUtilityService.GetClientIpAddress(HttpContext.Current.Request);
        }

        private string GetUserHostName()
        {
            return HttpContext.Current.Request.UserHostName;
        }

        private string GetUserBrowser()
        {
            return _auditService.GetUserBrowserForDisplay(HttpContext.Current.Request.Browser.Browser,
                HttpContext.Current.Request.Browser.Version,
                HttpContext.Current.Request.UserAgent);
        }

        private void AuditPartnerLoginLinkSuccess(string partnerId, BusinessUser user)
        {
            var auditString = string.Format("Partner login successful link from partner Id : {0} to user id: {1}, user name: {2}", partnerId, user.Id,user.UserName);
            _auditService.AuditEvent(Mapper.Map<BusinessUser, AuditUser>(user), AuditEvent.SystemAdmin_MxConnectUserLoginSuccess,
                MobilePartnerLoginAuditTitle, auditString);
        }
    }
}