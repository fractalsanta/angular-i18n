using System;
using System.Collections.Generic;
using System.Net.Mail;
using System.Text;
using System.Web.Mvc;
using System.Web.Routing;
using System.Xml.Linq;
using Agile.Diagnostics.Logging;
using Communicator.DAL;
using Communicator.DAL.Properties;
using Communicator.ImageHelper;
using Rockend.iStrata.StrataCommon;
using Rockend.iStrata.StrataCommon.Response;
using Rockend.iStrata.StrataWebsite.Data;
using Rockend.iStrata.StrataWebsite.Helpers;
using Rockend.iStrata.StrataWebsite.Model;
using Rockend.Web.Security;
using Rockend.WebAccess.Common.ClientMessage;

namespace Rockend.iStrata.StrataWebsite.Controllers
{
    /// <summary>
    /// Controller to handle initial user login to the website.
    /// </summary>
    public class LoginController : BaseController
    {
        private const string CouldNotFindUsername = "Sorry, we could not find a match for that email address.";
        private const string CouldNotFindEmail = "Sorry, we could not find an email address for that username.";

        public IFormsAuthenticationService FormsService { get; private set; }

        /// <summary>
        /// ctor
        /// </summary>
        public LoginController(IFormsAuthenticationService formsAuthenticationService)
        {
            FormsService = formsAuthenticationService;
        }

        [OutputCache(Location = System.Web.UI.OutputCacheLocation.Client, Duration = 100000)]
        public ActionResult IPhoneIconImage()
        {
            return File(AgentContentStrata.AgentContent.IPhoneIcon, "image/jpeg");
        }

        /// <summary>
        /// Display the login form.
        /// </summary>
        /// <param name="returnUrl">The return URL to redirect to after login success.</param>
        /// <returns>View ActionResult.</returns>
        [AcceptVerbs(HttpVerbs.Get)]
        public ActionResult Logon()
        {
            if (SessionData != null
                && !string.IsNullOrWhiteSpace(SessionData.OriginalApplicationKey))
            {
                if (string.IsNullOrWhiteSpace(SessionData.ApplicationKey))
                    return RedirectToAction("Logout", "Account", new { aid = SessionData.ApplicationKey });
                else
                    return RedirectToAction("Logout", "Account", new { aid = SessionData.OriginalApplicationKey });
            }

            // if they're on mobile, and not using https - redirect to https!
            // use https for mobile clients as Vodafone (and many other carriers) inject javascript into page responses
            // to try minimise the images & scripts. This often breaks the scripts. Https - they can't inject anything. 
#if (!DEBUG)
            {
                if (Request.Browser.IsMobileDevice && !Request.IsSecureConnection)
                {
                    string secureUrl = Request.Url.ToString().Replace("http:", "https:");
                    return Redirect(secureUrl);
                }
            }
#endif

            SessionData.ApplicationKey = AppKeyHelper.GetApplicationKeyFromUrl();

            InitializeSessionData();

            ViewData["AgencyID"] = SessionData.ApplicationKey;

            if (ViewData["AgencyID"] == null)
                ViewData["AgencyID"] = "";

            ViewBag.TopText = AgentContentStrata.AgentContent.LoginPageTopText;
            return View(new LogonModel());
        }

        /// <summary>
        /// Display the login form.
        /// </summary>
        /// <param name="returnUrl">The return URL to redirect to after login success.</param>
        /// <returns>View ActionResult.</returns>
        [AcceptVerbs(HttpVerbs.Get)]
        public ActionResult Login(int? aid)
        {
            // if no appkey specified in querystring, look in session or url (path)
            if (!aid.HasValue)
            {
                int appKey = 0;
                if (int.TryParse(SessionData.ApplicationKey, out appKey))
                {
                    aid = appKey;
                }
                else
                {
                    aid = int.Parse(AppKeyHelper.GetApplicationKeyFromUrl());
                }
            }

            SessionData.ApplicationKey = aid.HasValue ? aid.ToString() : string.Empty;

            InitializeSessionData();
            ViewData["AgencyID"] = SessionData.ApplicationKey;

            return Redirect(string.Concat("/", aid.Value.ToString(), "/", "Login", "/", "Logon")); // "Login", new { aid = aid });
        }

        [AcceptVerbs(HttpVerbs.Get)]
        public ActionResult ForgotPassword()
        {
            return View(new RetrievePasswordModel());
        }

        /// <summary>
        /// Submits the login credentials.
        /// </summary>
        /// <param name="applicationKey">The agency id.</param>
        /// <param name="role">The role.</param>
        /// <param name="userName">Name of the user.</param>
        /// <param name="password">The password.</param>
        /// <returns>RedirectResult to URL if successful, otherwise Redirect back to Login form with validation errors.</returns>
        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Logon(LogonModel model)
        {
            Logger.Debug("[post] Login (appKey:{0}, userName:{1}, pwd:{2})"
                , model.AgencyId, model.Username, model.Password);

            int agencyId = 0;

            // if a key is passed in then we always use that, overriding any value in session.
            if (!string.IsNullOrWhiteSpace(model.AgencyId))
            {
                if (model.AgencyId == null)
                {
                    model.AgencyId = string.Empty;
                }

                // need to update the value in session
                SessionData.ApplicationKey = model.AgencyId.ToString();
                Session[SessionData.SessionDataKey] = SessionData;
                InitializeSessionData();
            }
            else
            {
                // try to set from the Session
                if (SessionData.ApplicationKey != null)
                {
                    model.AgencyId = SessionData.ApplicationKey;
                    int.TryParse(SessionData.ApplicationKey, out agencyId);
                }
            }

            if (!ModelState.IsValid)
            {
                Logger.Debug("ModelState is not valid, redirecting(1).");
                if (TempData.ContainsKey("ReturnUrl"))
                {
                    Logger.Debug("TempData contains a ReturnUrl: {0}", TempData["ReturnUrl"]);
                    // refresh the temp referrer value so it stays for another request
                    TempData["ReturnUrl"] = TempData["ReturnUrl"];
                }

                ViewBag.TopText = AgentContentStrata.AgentContent.LoginPageTopText;
                return View(model);
            }

            // Login
            var messenger = new StrataHttpMessenger();

            try
            {
                Role role = (Role)int.Parse(model.UserTypeId);
                LoginResponse response = messenger.Login(int.Parse(model.AgencyId), model.Username, model.Password, role);

                FormsService.SignIn(model.Username, false);  // model.RememberMe

                // Set up the session
                var userSession = UserSession.CreateUserSession(response, role, model.Username);

                userSession.HasFileSmartEnabled = CheckFileSmartStatus();

                Session["UserSession"] = userSession;


                //#if !(DEBUG)
                //                authCookie.Secure = true;
                //#endif
                //                Response.Cookies.Add(authCookie);

                // Redirect back to original page
                if (TempData.ContainsKey("ReturnUrl"))
                {
                    var returnUrl = (string)TempData["ReturnUrl"];
                    if (!string.IsNullOrEmpty(returnUrl))
                    {
                        Logger.Debug("Redirecting to returnUrl: {0}", returnUrl);
                        return Redirect(returnUrl);
                    }
                }

                // Lastly, if a successful login has occurred, add appKey to Session.
                SessionData.OriginalApplicationKey = model.AgencyId;

                if (Request.Browser.IsMobileDevice && !MobileViewEngine.IsIPad())
                {
                    return RedirectToAction("Menu", "Mobile");
                }

                // If no redirect, then go to the appropriate home page based on the logon role.
                switch (role)
                {
                    case Role.Owner:
                        return RedirectToAction("Contacts", "LotOwner", new RouteValueDictionary(new { applicationKey = SessionData.ApplicationKey }));
                    case Role.ExecutiveMember:
                        return RedirectToAction("Main", "ExecutiveMember", new RouteValueDictionary(new { applicationKey = SessionData.ApplicationKey }));
                }
            }
            catch (Exception ex)
            {
                Logger.Error(ex, string.Format("Login:{0}", ex.GetType().Name));
                ModelState.AddModelError("error", ex.Message);
            }

            if (!ModelState.IsValid)
            {
                Logger.Debug("ModelState is not valid, redirecting(2).");
                if (TempData.ContainsKey("ReturnUrl"))
                {
                    Logger.Debug("TempData contains a ReturnUrl: {0}", TempData["ReturnUrl"]);
                    // refresh the temp referrer value so it stays for another request
                    TempData["ReturnUrl"] = TempData["ReturnUrl"];
                }
            }
            ViewBag.TopText = AgentContentStrata.AgentContent.LoginPageTopText;

            return View(model);
        }

        private bool CheckFileSmartStatus()
        {
            int fileSmartServiceKey = (int)Rockend.Common.RockendHelper.RwacService.DocsOnPortals;

            // If agent content & agency application haven't been loaded, can't check service or content...
            if (base.AgencyApplication != null && base.AgencyApplication.ApplicationKey.HasValue && AgentContentStrata != null)
            {
                Rmh_ServiceAgencyApplication fileSmartService = CommunicatorData.LoadAgentServicesByServiceKey(AgencyApplication.ApplicationKey.Value, fileSmartServiceKey);
                return fileSmartService != null && fileSmartService.IsActive && AgentContentStrata.AgentContent.HasFileSmart;
            }
            return false;
        }

        [HttpPost]
        public ActionResult FindPassword(string username, string userType)
        {
            Logger.Debug("FindPassword({0}, {1})", username ?? "-", userType ?? "-");

            var result = new JsonResult();
            if (string.IsNullOrEmpty(username))
            {
                result.Data = new { emailSent = false, result = "Please enter a valid username" };
                return result;
            }

            try
            {
                if (SessionData == null || (!SessionData.IsApplicationKeyValid))
                {
                    const string invalidAppKeyMessage = "Cannot Find Password";
                    Logger.Warning(invalidAppKeyMessage);
                    result.Data = new { emailSent = false, result = invalidAppKeyMessage };
                    return result;
                }

                HttpMessenger messenger = new HttpMessenger();
                XMLDataResponse response = messenger.FindPassword(username, userType);

                string password = "", email = "";

                if (response != null)
                {
                    XDocument responseXml = XDocument.Parse(response.Data);
                    password = GetValueFromXml<string>(responseXml.Root, "Password");
                    email = GetValueFromXml<string>(responseXml.Root, "EmailAddress");
                }

                if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
                {
                    XDocument responseXml = XDocument.Parse(response.Data);
                    string error = GetValueFromXml<string>(responseXml.Root, "ErrorMessage");
                    result.Data = new { emailSent = false, result = error };
                    return FailedFindPasswordResult as JsonResult;
                }

                var body = string.Format("This email has been sent to you in response to your request to retrieve your password.\n\nYour password is: {0}\n\nYou may now login using this password and your User ID.\n", password);
                SendEmail(new List<string> { email }, body);
                result.Data = new { emailSent = true, result = "Your password has been sent to your email address" };
            }
            catch (Exception ex)
            {
                Logger.Error(ex, "FindPassword({0})", username);
                result.Data = FailedFindPasswordResult;
            }
            return result;
        }

        [HttpPost]
        public ActionResult FindUsername(string email, string userType)
        {
            Logger.Debug("FindUsername({0}, {1})", email ?? "-", userType ?? "-");

            var result = new JsonResult();
            if (string.IsNullOrEmpty(email) || !IsValidEmail(email))
            {
                result.Data = new { emailSent = false, result = "Please enter a valid email" };
                return result;
            }

            try
            {
                if (SessionData == null || (!SessionData.IsApplicationKeyValid))
                {
                    const string invalidAppKeyMessage = "Cannot Find Username";
                    Logger.Warning(invalidAppKeyMessage);
                    result.Data = new { emailSent = false, result = invalidAppKeyMessage };
                    return result;
                }

                HttpMessenger messenger = new HttpMessenger();
                XMLDataResponse response = messenger.FindUsername(email, userType);

                XDocument responseXml = XDocument.Parse(response.Data);

                List<string> usernames = new List<string>();

                bool isError = false;
                string errorMessage = string.Empty;

                var userNameElements = responseXml.Root.Elements("Field");
                foreach (XElement userNameElement in userNameElements)
                {
                    string username = string.Empty;

                    if (userNameElement.Attribute("name") != null && userNameElement.Attribute("name").Value.Equals("ErrorMessage"))
                    {
                        isError = true;
                        errorMessage = userNameElement.Attribute("value").Value;
                        continue;
                    }

                    if (userNameElement.Attribute("value") != null)
                    {
                        username = userNameElement.Attribute("value").Value;
                    }

                    if (!string.IsNullOrWhiteSpace(username))
                    {
                        usernames.Add(username);
                    }
                }

                if (isError || usernames.Count == 0)
                {
                    return FailedFindUsernameResult;
                }

                StringBuilder body = new StringBuilder("In response to your request to be reminded of your User ID, please find the below information we have on file for you.\n\nAll User IDs we have listed for your email address:-\n\n");

                usernames.ForEach(name => body.AppendLine(string.Format("Username: {0}", name)));
                body.AppendLine();
                body.AppendLine(string.Format("Your next step is to return to our website to retrieve {0}\n\nThankyou!", (usernames.Count > 1) ? "your passwords using these User IDs." : "your password using this User ID."));
                body.AppendLine();
                SendEmail(new List<string> { email }, body.ToString());
                result.Data = new { emailSent = true, result = "Your username(s) has been sent to your email address" };
            }
            catch (Exception ex)
            {
                Logger.Error(ex, "FindPassword({0})", email);
                result.Data = FailedFindUsernameResult;
            }
            return result;
        }

        private bool IsValidEmail(string email)
        {
            try
            {
                MailAddress address = new MailAddress(email);
            }
            catch (Exception)
            {
                return false;
            }
            return true;
        }

        private JsonResult FailedFindPasswordResult
        {
            get { return new JsonResult() { Data = new { emailSent = false, result = string.Format(CouldNotFindEmail) } }; }
        }

        private JsonResult FailedFindUsernameResult
        {
            get { return new JsonResult() { Data = new { emailSent = false, result = string.Format(CouldNotFindUsername) } }; }
        }

        /// <summary>
        /// Gets the banner for the current agent
        /// </summary>
        [OutputCache(Location = System.Web.UI.OutputCacheLocation.Client, Duration = 100000)]
        public ActionResult BannerImage()
        {
            try
            {
                return File(AgentContentStrata.AgentContent.Banner, "image/jpg");
            }
            catch (Exception ex)
            {
                Logger.Error(ex);
                return File(Resources.bannerStrata.ToByteArrayJpeg(), "image/jpg");
            }
        }

        [OutputCache(Location = System.Web.UI.OutputCacheLocation.Client, Duration = 100000)]
        public ActionResult FooterImage()
        {
            Response.Cache.SetCacheability(System.Web.HttpCacheability.Public);
            Response.Cache.SetLastModified(DateTime.Now.AddMinutes(-1));
            return File(AgentContentStrata.AgentContent.FooterBanner, "image/jpeg");
        }

        /// <summary>
        /// needed because Chrome seems to hit server twice on some calls, the second being for favicon
        /// </summary>
        protected bool IsFavIconCall()
        {
            return HttpContext.Request != null
                && HttpContext.Request.Url != null
                && HttpContext.Request.Url.AbsolutePath.Contains("favicon.ico");
        }
    }
}
