using System;
using System.Linq;
using System.Web.Mvc;
using Agile.Diagnostics.Logging;
using Communicator.DAL;
using Rockend.Cms;
using Rockend.Cms.Providers;
using Rockend.iStrata.StrataWebsite.Data;
using Rockend.iStrata.StrataWebsite.Model;
using System.Configuration;
using Rockend.WebAccess.Mail;
using System.Collections.Generic;
using System.Xml.Linq;
using Communicator.DAL.Properties;
using Rockend.iStrata.StrataWebsite.Helpers;
using CommunicatorDto;
using Rockend.Azure;
using Microsoft.WindowsAzure.ServiceRuntime;

namespace Rockend.iStrata.StrataWebsite.Controllers
{
    /// <summary>
    /// Base controller for the web application.
    /// </summary>
    public class BaseController : Controller
    {
        protected const string StrataMasterApplicationCode = "SM";
        private AgentContentStrataDto agentContent;

        const string AgentContentSessionKey = "AgentContent";

        /// <summary>
        /// ctor
        /// </summary>
        public BaseController()
        {
            Logger.Debug("BaseController ctor");
            Messenger = new StrataHttpMessenger();
        }

        private static IMessenger messenger;
        private Rmh_AgencyApplication agencyApplication;

        private RockendConfigurationManager communicatorData = new RockendConfigurationManager(new LinqToSqlDataProvider(RestCentral.ConnectionString));

        protected RockendConfigurationManager CommunicatorData
        {
            get { return communicatorData; }
            set { communicatorData = value; }
        }

        /// <summary>
        /// Gets or sets the IMessenger for data retrieval.
        /// </summary>
        /// <value>The IMessenger.</value>
        public IMessenger Messenger
        {
            get { return messenger; }
            set { messenger = value; }
        }

        /// <summary>
        /// Get the Agent Content
        /// </summary>
        public AgentContentStrataDto AgentContentStrata
        {
            get
            {
                if (agentContent == null)
                    agentContent = CommunicatorData.GetAgentContentStrata(SessionData.AgencyApplicationId, Resources.bannerStrata);

                Session[AgentContentSessionKey] = agentContent;
                return agentContent;
            }
        }

        protected Rmh_AgencyApplication AgencyApplication
        {
            get { return this.agencyApplication; }
        }

        /// <summary>
        /// Sets page title in ViewBag
        /// </summary>
        /// <param name="title">Title of page</param>
        protected void SetPageTitle(string title)
        {
            ViewBag.Title = title;
        }

        /// <summary>
        /// Gets or sets the user session.
        /// </summary>
        /// <value>The user session.</value>
        public UserSession UserSession
        {
            get
            {
                if (Session == null)
                {
                    Logger.Warning("Session is NULL! (ControllerBase)");
#if DEBUG
                    throw new Exception("Session is null!");
#endif
                    return null;
                }
                return Session["UserSession"] as UserSession;
            }
        }

        protected static T GetValueFromXml<T>(XElement element, string fieldName)
        {
            XElement matchingNode = element.Elements("Field").FirstOrDefault(e =>
                    e.Attribute("name") != null
                    && e.Attribute("name").Value.ToLower().Equals(fieldName.ToLower()));

            if (matchingNode != null && matchingNode.Attribute("value") != null)
            {
                string attrValue = matchingNode.Attribute("value").Value;
                try
                {
                    var result = Convert.ChangeType(attrValue, typeof(T));
                    return (T)result;
                }
                catch (Exception)
                {
                    return default(T);
                }
            }

            return default(T);
        }

        /// <summary>
        /// Invalidates the current session and logs out the user.
        /// </summary>
        /// <returns></returns>
        [NonAction]
        protected ActionResult InvalidateSession()
        {
            Logger.Info("InvalidateSession");
            return View(
                "Message",
                new MessageModel("Error", "Session has timed-out or is invalid. Please log in again.",
                Url.Action("Logout", "Account")));
        }

        /// <summary>
        /// Gets the referrer URI for the current request.
        /// </summary>
        /// <value>The referrer.</value>
        public Uri Referrer
        {
            get
            {
                return HttpContext.Request.UrlReferrer;
            }
        }

        private SessionData sessionData;
        protected SessionData SessionData
        {
            get
            {
                if (sessionData == null)
                {
                    sessionData = Session[SessionData.SessionDataKey] as SessionData;
                    if (sessionData == null)
                    {
                        Logger.Info("Creating new SessionData");
                        sessionData = new SessionData();
                        InitializeSessionData();
                    }
                }

                // then initialize the key and bits that we can load with the key
                if (string.IsNullOrEmpty(sessionData.ApplicationKey))
                    InitializeSessionData();

                return sessionData;
            }
        }

        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            System.Globalization.CultureInfo newCulture = (System.Globalization.CultureInfo)System.Threading.Thread.CurrentThread.CurrentCulture.Clone();
            newCulture.DateTimeFormat.ShortDatePattern = "dd/MM/yyyy";
            newCulture.DateTimeFormat.DateSeparator = "/";
            System.Threading.Thread.CurrentThread.CurrentCulture = newCulture;

            base.OnActionExecuting(filterContext);
        }

        protected override void OnActionExecuted(ActionExecutedContext filterContext)
        {
            base.OnActionExecuted(filterContext);

            string appKeyInUrl = AppKeyHelper.GetApplicationKeyFromUrl();

            if (SessionData != null && !string.IsNullOrWhiteSpace(SessionData.ApplicationKey)
                && !HttpContext.Request.Url.ToString().Contains("favicon")
                && !string.IsNullOrWhiteSpace(appKeyInUrl) && appKeyInUrl != "0"
                && SessionData.ApplicationKey != appKeyInUrl)
            {
                Session["appKeyChangedTo"] = appKeyInUrl;
                Session[SessionData.SessionDataKey] = null;
                filterContext.Result = RedirectToAction("LogoutAndChangeAppKey", "Account", new { aid = appKeyInUrl });
            }

#if(!DEBUG)
            Response.Headers["Cache-Control"] =  "no-cache, no-store, must-revalidate"; // HTTP 1.1.
            Response.Headers["Pragma"] = "no-cache"; // HTTP 1.0.
            Response.Headers["Expires"] = "0";
#endif
            SetViewBagData();
        }

        protected virtual void SetViewBagData()
        {
            if (AgentContentStrata == null)
                return;
            ViewBag.TopText = AgentContentStrata.AgentContent.LoginPageTopText;
            ViewBag.ButtonColor = AgentContentStrata.AgentContent.ButtonColor;
            ViewBag.AgencyUrl = AgentContentStrata.AgentContent.AgencyUrl;
            ViewBag.FooterUrl = AgentContentStrata.AgentContent.FooterBannerUrl;

            ViewBag.ButtonColour = AgentContentStrata.AgentContent.ButtonColor;
            ViewBag.ButtonFontColour = AgentContentStrata.AgentContent.ButtonTextColor;

            ViewBag.ShowAgencyContactDetails = AgentContentStrata.AgentContent.ShowAgencyContactDetails;
            ViewBag.StrataShowMeetings = AgentContentStrata.AgentContent.StrataShowMeetings;

            ViewBag.HasIPhoneIcon = (AgentContentStrata.AgentContent.IPhoneIcon != null && AgentContentStrata.AgentContent.IPhoneIcon.Length > 0);

            ViewBag.ShowMaintenanceTab = MaintenanceHelper.ShowMaintenanceTab(AgentContentStrata, UserSession);

            ViewBag.HasBanner = AgentContentStrata.AgentContent.HasBanner;
            ViewBag.HasFooterBanner = AgentContentStrata.AgentContent.HasFooterBanner;
            ViewBag.HasIPhoneIcon = AgentContentStrata.AgentContent.HasIPhoneIcon;

            if (UserSession != null)
            {
                ViewBag.LoggedInLabel = string.Format("Logged in as {0}", UserSession.UserName);
                ViewBag.IsExecutiveMember = UserSession.Role == StrataCommon.Role.ExecutiveMember;
                ViewBag.Title = UserSession.Role == StrataCommon.Role.ExecutiveMember ? "Executive" : "Owner";
                ViewBag.ShowDocumentsTab = UserSession.HasFileSmartEnabled;
            }
            else
            {
                ViewBag.IsExecutiveMember = false;
                ViewBag.ShowDocumentsTab = false;
            }

            string env = AzureHelper.ServerEnvironment;

            ViewBag.BannerUrl = string.Format("http://rockendstorage.blob.core.windows.net/portals/{0}/images/{1}/Banner.jpg", env, SessionData.ApplicationKey);
            ViewBag.FooterBannerUrl = string.Format("http://rockendstorage.blob.core.windows.net/portals/{0}/images/{1}/FooterBanner.jpg", env, SessionData.ApplicationKey);
            ViewBag.IPhoneIconUrl = string.Format("http://rockendstorage.blob.core.windows.net/portals/{0}/images/{1}/IPhoneIcon.jpg", env, SessionData.ApplicationKey);
        }


        protected void InitializeSessionData()
        {
            Logger.Debug("SessionData.ApplicationKey:{0}", sessionData.ApplicationKey ?? "notset");

            int key = 0;
            var result = int.TryParse(sessionData.ApplicationKey, out key);
            if (result)
            {
                // try to load the AgencyApplication
                agencyApplication = CommunicatorData.LoadAgencyApplicationData(key);
                sessionData.IsApplicationKeyRegistered
                    = (agencyApplication != null && agencyApplication.AgencyAccessID.HasValue);

                int portalServiceKey = (int)Rockend.Common.RockendHelper.RwacService.StratePortal;
                
                Rmh_ServiceAgencyApplication strataPortalService = CommunicatorData.LoadAgentServicesByServiceKey(key, portalServiceKey);

                if (strataPortalService == null || !strataPortalService.IsActive)
                {
                    ModelState.AddModelError("", "Portals Service has not been activated for this agency.");
                }

                if (agencyApplication != null)
                {
                    sessionData.AgencyAccessId = agencyApplication.AgencyAccessID;
                    sessionData.AgencyApplicationId = agencyApplication.AgencyApplicationID;
                }
                else
                {
                    sessionData.AgencyAccessId = 0;
                    sessionData.AgencyApplicationId = 0;
                }
            }
            else
            {
                Logger.Warning("failed to parse int for appKey [{0}]", sessionData.ApplicationKey);
                sessionData.IsApplicationKeyRegistered = false;
            }

            // add to session
            Session[SessionData.SessionDataKey] = sessionData;
        }

        public static void SendEmail(List<string> toAddresses, string messageBody, string subject = "", string replyTo = "")
        {
            if (toAddresses == null || toAddresses.Count == 0)
            {
                Logger.Warning("Cannot send email as toAddresses is null or has 0 items");
                return;
            }

            if (string.IsNullOrEmpty(subject))
                subject = ConfigurationManager.AppSettings["DefaultMailSubject"];
            Logger.Debug("SendEmail subject:{2}, to.Count[{0}], first: {1}", toAddresses.Count, toAddresses[0], subject);

            AwsMailHelper.DefaultFromAddress = WebsiteMailHelper.GetFromAddressFromConfig();
            AwsMailHelper.SendEmail(toAddresses, null, null, subject, messageBody, string.IsNullOrEmpty(replyTo) ? AwsMailHelper.DefaultFromAddress : replyTo);
        }
    }
}
