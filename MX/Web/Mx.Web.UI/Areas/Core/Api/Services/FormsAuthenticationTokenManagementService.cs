using System;
using System.Web;
using System.Web.Security;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Config.Helpers;
using Mx.Web.UI.Config.WebApi;

namespace Mx.Web.UI.Areas.Core.Api.Services
{
    public class FormsAuthenticationTokenManagementService : IAuthenticationTokenManagementService
    {
        public TokenVerificationResponse VerifyIdentity(string token, DateTime verificationTime)
        {
            FormsAuthenticationTicket ticket = null;

            try
            {
                if (token != null)
                {
                    ticket = FormsAuthentication.Decrypt(token);
                }
            }
            catch (HttpException)
            {
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
            }

            Int64 userId;
            if (ticket != null && !ticket.Expired && Int64.TryParse(ticket.UserData, out userId))
            {
                var response = new TokenVerificationResponse
                {
                    Identity = new BaseIdentity(userId, ticket.Name)
                };

                if (ticket.IssueDate.AddMinutes(1) < verificationTime)
                {
                    response.SlidingToken = CreateToken(ticket.Name, userId, verificationTime);
                }

                return response;
            }

            return null;
        }

        public String CreateToken(String username, Int64 userId, DateTime creationTime)
        {
            var ticket = new FormsAuthenticationTicket(1, username, creationTime, creationTime.AddMinutes(120), false, userId.Str());
            return FormsAuthentication.Encrypt(ticket);
        }
    }
}