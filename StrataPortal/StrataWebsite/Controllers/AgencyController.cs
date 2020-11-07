using System.Web.Mvc;
using Agile.Diagnostics.Logging;
using Rockend.iStrata.StrataCommon;
using Rockend.iStrata.StrataCommon.Response;
using Rockend.iStrata.StrataWebsite.Helpers;
using Rockend.iStrata.StrataWebsite.Model;

namespace Rockend.iStrata.StrataWebsite.Controllers
{
    /// <summary>
    /// Controller for the Agency contact page.
    /// </summary>
    public class AgencyController : BaseController
    {
        /// <summary>
        /// Displays the agency contact page.
        /// </summary>
        /// <returns>View ActionResult.</returns>
        [AuthorizeStrata(Users = RoleInfo.RoleNameOwnerAndExec)]
        public ActionResult Contact()
        {
            SetPageTitle("Contact Agency");

            SetAgencyModelInSession();

            if (base.UserSession == null || base.UserSession.Agency == null)
            {
                return RedirectToAction("Logout", "Account");
            }

            return View(base.UserSession.Agency);
        }

        [AuthorizeStrata(Users = RoleInfo.RoleNameOwnerAndExec)]
        public ActionResult Help()
        {
            return View();
        }


        public ActionResult FAQ()
        {
            return View();
        }

        [AuthorizeStrata(Users = RoleInfo.RoleNameOwnerAndExec)]
        public ActionResult ContactForm()
        {
            SetPageTitle("Contact Agency");

            SetAgencyModelInSession();
            // used to only check on UserSession.Agency.Email ...mw 

            var model = new ContactFormModel();
            ReSetModelAndViewBagProperties(model);
            return View(model);
        }

        [HttpPost]
        [AuthorizeStrata(Users = RoleInfo.RoleNameOwnerAndExec)]
        public ActionResult ContactForm(ContactFormModel model)
        {
            SetPageTitle("Contact Agency");
            // pass email to model, validate & save.
            if (model.ValidateAndSend(ModelState, AgentContentStrata.AgentContent.StrataContactEmail))
            {
                return RedirectToAction("ContactReceived");
            }

            ReSetModelAndViewBagProperties(model);

            return View(model);
        }

        private void ReSetModelAndViewBagProperties(ContactFormModel model)
        {
            // As we're going back to the same page, need to reset the viewbag field..
            if ((AgentContentStrata.AgentContent != null && string.IsNullOrWhiteSpace(AgentContentStrata.AgentContent.StrataContactEmail))
                && string.IsNullOrWhiteSpace(UserSession.Agency.Email))
            {
                ViewBag.NoContactEmailExists = true;
            }
            else
            {
                ViewBag.NoContactEmailExists = false;
            }

            model.IsContactEmailMandatory = AgentContentStrata.AgentContent.IsContactEmailMandatory;
            model.IsFsDocumentDescriptionOn = AgentContentStrata.IsFsDocumentDescriptionOn;
        }

        [AuthorizeStrata(Users = RoleInfo.RoleNameOwnerAndExec)]
        public ActionResult UpdateRequestForm(string subject, string heading)
        {
            SetAgencyModelInSession();
            
            var model = new ContactFormModel();
            model.Subject = subject;
            model.PageHeading = heading;

            ReSetModelAndViewBagProperties(model);

            return View(model);
        }

        private void SetAgencyModelInSession()
        {
            // Create a blank model - if one exists in session, overwrite with that. Better than passing an empty one.
            var agencyContactModel = new AgencyModel();
            if (base.UserSession != null && base.UserSession.Agency == null)
            {
                AgencyResponse response = Messenger.GetAgencyInfo();
                agencyContactModel = AgencyModel.CreateAgencyModel(response);
                base.UserSession.Agency = agencyContactModel;
            }
        }

        [AuthorizeStrata(Users = RoleInfo.RoleNameOwnerAndExec)]
        public ActionResult ContactReceived()
        {
            SetPageTitle("Contact Sent");
            return View();
        }

        // this is pretty much a duplicate of the ContactForm method, but in case it changes... 
        // decided to separate them out...
        [HttpPost]
        [AuthorizeStrata(Users = RoleInfo.RoleNameOwnerAndExec)]
        public ActionResult UpdateRequestForm(ContactFormModel model)
        {
            // pass email to model, validate & save.
            if (model.ValidateAndSend(ModelState, AgentContentStrata.AgentContent.StrataContactEmail))
            {
                return RedirectToAction("ContactReceived");
            }

            ReSetModelAndViewBagProperties(model);

            return View(model);
        }
    }
}
