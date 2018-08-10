using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using Rockend.WebAccess.Mail;
using System.Net.Mail;
using Rockend.iStrata.StrataWebsite.Helpers;
using System.Web.Mvc;
using Rockend.WebAccess.Common.Helpers;
using System.Text;
using Rockend.iStrata.StrataCommon.BusinessEntities;

namespace Rockend.iStrata.StrataWebsite.Model
{
    public class ContactFormModel : ModelBase
    {
        public string EmailAddress { get; set; }
        public string Subject { get; set; }
        public string Message { get; set; }
        public string PageHeading { get; set; }
        public int LotIndex { get; set; }
        public bool IsContactEmailMandatory { get; set; }
        public bool IsFsDocumentDescriptionOn { get; set; }

        internal bool ValidateAndSend(ModelStateDictionary ModelState, string toAddress = "")
        {
            if (string.IsNullOrWhiteSpace(toAddress))
            {
                toAddress = base.UserSession.Agency.Email;
            }

            Message = PrepareMessage();

            if (string.IsNullOrEmpty(EmailAddress) && AgentContentStrata.AgentContent.IsContactEmailMandatory)
            {
                ModelState.AddModelError("EmailAddress", "You must enter a Reply to Email Address");
                return false;
            }

            if (!string.IsNullOrWhiteSpace(EmailAddress) && !EmailAddress.IsValidEmailAddress())
            {
                ModelState.AddModelError("EmailAddress", "Email address is not valid.");
                return false;
            }

            AwsMailHelper.DefaultFromAddress = WebsiteMailHelper.GetFromAddressFromConfig();
            AwsMailHelper.SendEmail(toAddress, Subject, Message, EmailAddress);
            return true;
        }

        private string PrepareMessage()
        {
            try
            {
                StringBuilder message = new StringBuilder();

                message.AppendLine("Message received:\n\n");

                DropdownItem selectedLot = UserSession.LotOwners[LotIndex];
                int lotId = selectedLot.Id;
                string lotName = UserSession.LotOwners.FirstOrDefault(l => l.Id == lotId).Name;
                int planId = UserSession.LotOwners.FirstOrDefault(l => l.Id == lotId).PlanId;
                string planName = UserSession.OwnersCorpNames.FirstOrDefault(p => p.Id == planId).Name;
                string userName = UserSession.CurrentUsersName;
                string userLogin = UserSession.UserName;

                message.AppendFormat("User Name: {0}\n", userName);
                message.AppendFormat("User Login: {0}\n", userLogin);
                message.AppendFormat("User Type: {0}\n", base.UserSession.Role == StrataCommon.Role.Owner ? "Owner" : "Executive");
                message.AppendFormat("Plan: {0}\n", planName);
                message.AppendFormat("Lot: {0}\n\n", lotName);

                message.Append("\nMessage:\n");
                message.AppendLine("------------------------------------------------------------------------\n");
                message.Append(Message);
                

                return message.ToString();
            }
            catch (Exception)
            {
                return Message;
            }
        }

    }
}