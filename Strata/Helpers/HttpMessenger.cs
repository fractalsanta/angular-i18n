using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.ServiceModel;
using System.Web;
using Agile.Diagnostics.Logging;
using Microsoft.WindowsAzure.ServiceRuntime;
using Rockend.Azure;
using Rockend.WebAccess.Common.ClientMessage;
using Rockend.WebAccess.Common.Transport;
using Rockend.WebAccess.RockendMessage;
using Rockend.iStrata.StrataCommon.Request;
using Rockend.iStrata.StrataCommon.Response;
using Rockend.WebAccess.Common;
using Rockend.iStrata.StrataWebsite.Data;
using Role = Rockend.iStrata.StrataCommon.Role;
using System.Xml.Linq;
using Rockend.iStrata.StrataWebsite.Model;

namespace Rockend.iStrata.StrataWebsite.Helpers
{
    /// <summary>
    /// Implementation of the IMessager interface using the RMH as the data source.
    /// </summary>
    public class HttpMessenger : IMessenger
    {
        private const string ApplicationCode = "SM";
        private const string RmhAddress = "RmhAddress";

        /// <summary>
        /// Initializes a new instance of the <see cref="HttpMessenger"/> class.
        /// </summary>
        public HttpMessenger()
        {
        }

        private int ApplicationKey {
            get 
            {
                var key = HttpContext.Current.Session[SessionData.SessionDataKey] as SessionData;
                if (key == null)
                    return -1;
                return key.ApplicationKey.AsInt();
            }
        }

        protected XElement CreateXElement(string fieldName, string value)
        {
            // If a null value is passed in, replace with empty string to prevent crashing.
            if (value == null)
            {
                value = string.Empty;
            }

            return new XElement("Field", new XAttribute("name", fieldName), new XAttribute("value", value));
        }

        /// <summary>
        /// Sends the specified object to the RMH.
        /// </summary>
        /// <param name="request">The request object to send.</param>
        /// <param name="actionName"></param>
        /// <returns>Response object.</returns>
        protected object Send(object request, string actionName = "")
        {
            try
            {
                var factory = new ChannelFactory<IRequestService>("RMHService");
                
                var addressUri = AzureHelper.IsInFabric 
                    ? RoleEnvironment.GetConfigurationSettingValue(RmhAddress) 
                    : ConfigurationManager.AppSettings[RmhAddress];
                Logger.Debug("CMH: {0}", addressUri);
                var address = new EndpointAddress(new Uri(addressUri));

                var rmh = factory.CreateChannel(address);
                var message = new StrataMessage
                {
                    ApplicationKey = ApplicationKey,
                    Body = request,
                    ServiceKey = 2000000,
                    ApplicationCode = ApplicationCode,
                    ActionName = actionName,
                    ServicePassword = "r0ckend",
                    SessionID = string.Empty,    // TODO: Get session from somewhere
                    ContactID = UserSession == null ? 0 : UserSession.CurrentContactID
                };

                MessageRequest response = rmh.ProcessStrata(message);
                return response.Body;
            }
            catch (Exception ex)
            {
                Logger.Error(ex);
                // Any exception here means that something happened during comms to the RMH.
                throw new StrataWebException("An error occurred contacting the agency", ex);
            }
        }

        private UserSession UserSession
        {
            get 
            {
                return HttpContext.Current.Session["UserSession"] as UserSession;
            }
        }

        /// <summary>
        /// Sends the specified object to the RMH.
        /// </summary>
        /// <typeparam name="TRequest">The type of the request.</typeparam>
        /// <typeparam name="TResponse">The type of the response.</typeparam>
        /// <param name="request">The request object to send.</param>
        /// <param name="actionName"></param>
        /// <returns>Response object.</returns>
        protected TResponse Send<TRequest, TResponse>(TRequest request, string actionName = "")
            where TRequest : class
            where TResponse : class
        {
            Logger.Debug("Send action:{0}, RequstType:{1}", actionName ?? "none", request.GetType().Name);
            object result = Send(request, actionName);
            if (result is TResponse)
            {
                // proper response received.
                return (TResponse)result;
            }

            if (result is ErrorResponse)
            {
                Logger.Info("ErrorResponse received for action:{0}", actionName);
                var errorResponse = (ErrorResponse)result;
                throw new StrataWebException(errorResponse.ErrorMessage, errorResponse.Exception);
            }
            
            // we got some object back, but not what was expected.
            Exception exception = new StrataWebException("Invalid response received from the agency.");
            exception.Data["response"] = result;
            throw exception;
        }

        #region IMessenger Members

        /// <summary>
        /// Gets the agency info.
        /// </summary>
        /// <returns>AgencyResponse with the agency info.</returns>
        public AgencyResponse GetAgencyInfo()
        {
            var request = new AgencyRequest
            {
                ApplicationKey = this.ApplicationKey
            };
            return Send<AgencyRequest, AgencyResponse>(request);
        }

        /// <summary>
        /// Gets the budget info.
        /// </summary>
        /// <param name="ownersCorpIds">The owners corp ids.</param>
        /// <returns>
        /// BudgetReportResponse containing a list of budgets for the given owner Ids.
        /// </returns>
        public BudgetReportResponse GetBudgetInfo(IEnumerable<int> ownersCorpIds)
        {
            BudgetReportRequest request = new BudgetReportRequest()
            {
                OwnerCorpOIDList = ownersCorpIds.ToList()
            };
            return Send<BudgetReportRequest, BudgetReportResponse>(request);
        }

        /// <summary>
        /// Gets the executive member info.
        /// </summary>
        /// <param name="executiveId">The id of the executive member.</param>
        /// <returns>
        /// ExecutiveResponse with the executive member info.
        /// </returns>
        public ExecutiveResponse GetExecInfo(int executiveId)
        {
            ExecutiveRequest request = new ExecutiveRequest()
            {
                ExecID = executiveId
            };
            return Send<ExecutiveRequest, ExecutiveResponse>(request);
        }

        /// <summary>
        /// Logins the specified agency id.
        /// </summary>
        /// <param name="applicationKey">The agency id.</param>
        /// <param name="userName">Name of the user.</param>
        /// <param name="password">The password.</param>
        /// <param name="role">The role.</param>
        /// <returns></returns>
        public LoginResponse Login(int applicationKey, string userName, string password, Role role)
        {
            var request = new LoginRequest
            {
                UserName = userName,
                Password = password,
                Role = role
            };

            return Send<LoginRequest, LoginResponse>(request, "SMH.LoginCheck");
        }

        public FileSmartSearchResponse FSDocumentSearch(XElement xmlRequest)
        {
            return Send<string, FileSmartSearchResponse>(xmlRequest.ToString(), "FileSmartStrataSearch");
        }

        public XMLDataResponse GetJobDetails(XElement xmlRequest)
        {
            return Send<string, XMLDataResponse>(xmlRequest.ToString(), "GetMaintJobDetails");
        }

        public FileSmartDownloadResponse FSGetDocument(XElement xmlRequest)
        {
            return Send<string, FileSmartDownloadResponse>(xmlRequest.ToString(), "FileSmartGetDocument");
        }

        public XMLDataResponse FindPassword(string username, string userType)
        {
            XDocument requestDoc = new XDocument(new XElement("StrataRequest"));

            requestDoc.Root.Add(CreateXElement("UserName", username));
            requestDoc.Root.Add(CreateXElement("UserType", userType));

            return Send<string, XMLDataResponse>(requestDoc.ToString(), "StrataForgotPassword");
        }

        public XMLDataResponse FindUsername(string email, string userType)
        {
            XDocument requestDoc = new XDocument(new XElement("StrataRequest"));

            requestDoc.Root.Add(CreateXElement("EmailAddress", email));
            requestDoc.Root.Add(CreateXElement("UserType", userType));

            return Send<string, XMLDataResponse>(requestDoc.ToString(), "StrataForgotUsername");
        }

        /// <summary>
        /// Gets the lot info.
        /// </summary>
        /// <param name="lotId"></param>
        /// <returns>LotResponse with the lot info.</returns>
        public LotResponse GetLotInfo(int lotId)
        {
            LotRequest request = new LotRequest
            {
                LotID = lotId,
                IsAgent = true,
                IsGeneral = true,
                IsLevy = true
            };
            return Send<LotRequest, LotResponse>(request, "LotRequest");
        }

        /// <summary>
        /// Gets the owner's corporation info.
        /// </summary>
        /// <param name="ownersCorpId">The id of the owner's corporation.</param>
        /// <returns>
        /// OwnerResponse with the owner's corporation info.
        /// </returns>
        public OwnerResponse GetOwnerCorpInfo(int ownersCorpId)
        {
            OwnerRequest request = new OwnerRequest()
            {
                OwnersCorpID = ownersCorpId
            };
            return Send<OwnerRequest, OwnerResponse>(request, "OwnersRequest");
        }

        /// <summary>
        /// Changes the password of the user.
        /// </summary>
        /// <param name="userName">Name of the user.</param>
        /// <param name="oldPassword">The old password.</param>
        /// <param name="newPassword">The new password.</param>
        /// <returns>
        /// PasswordChangeResponse indicating success or failure.
        /// </returns>
        public PasswordChangeResponse ChangePassword(string userName, string oldPassword, string newPassword)
        {
            PasswordChangeRequest request = new PasswordChangeRequest()
            {
                NewPassword = newPassword,
                OldPassword = oldPassword,
                UserName = userName
            };
            return Send<PasswordChangeRequest, PasswordChangeResponse>(request);
        }

        /// <summary>
        /// Get the report.
        /// </summary>
        /// <param name="request">The request with the report name and parameters.</param>
        /// <returns>ReportResponse with the report body.</returns>
        public ReportResponse GetReport(ReportRequest request)
        {
            request.ErrorsOccured = "N";
            request.ProgressCounter = 0;
            request.StrataLaunchConfirmed = "N";
            request.TaskIsFinished = "N";
            return Send<ReportRequest, ReportResponse>(request);
        }

        #endregion
    }
}
