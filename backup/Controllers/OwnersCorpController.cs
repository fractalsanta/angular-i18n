using System;
using System.Web.Mvc;
using Rockend.iStrata.StrataCommon;
using Rockend.iStrata.StrataCommon.Response;
using Rockend.iStrata.StrataWebsite.Helpers;
using Rockend.iStrata.StrataWebsite.Model;

namespace Rockend.iStrata.StrataWebsite.Controllers
{
    /// <summary>
    /// Controller for the Owners Corporation details pages.
    /// </summary>
    [AuthorizeStrata(Users = RoleInfo.RoleNameOwnerAndExec)]
    public class OwnersCorpController : BaseController
    {
        /// <summary>
        /// Displays the owner's corporation general details for the specified index.
        /// </summary>
        /// <param name="index">The index of the owner's corporation to show.</param>
        /// <returns>View ActionResult.</returns>
        public ActionResult General(int? index)
        {
            SetPageTitle("Owners Corporation");

            // if the index is out of range, default to showing the first member.
            if (!index.HasValue || index < 0 || index > UserSession.OwnersCorpNames.Count)
            {
                index = 0;
            }

            if (UserSession == null || UserSession.OwnersCorpNames == null || UserSession.OwnersCorpNames[index.Value] == null)
            {
                return RedirectToAction("Logout", "Account");
            }

            OwnerResponse response = Messenger.GetOwnerCorpInfo(UserSession.OwnersCorpNames[index.Value].Id);
            OwnersCorpModel model = OwnersCorpModel.CreateOwnersCorpModel(UserSession, response, index.Value);
            return View(model);
        }

        /// <summary>
        /// Displays the owner's corporation entitlement details for the specified index.
        /// </summary>
        /// <param name="index">The index of the owner's corporation to show.</param>
        /// <returns>View ActionResult.</returns>
        public ActionResult Entitlements(int? index)
        {
            SetPageTitle("Entitlements");

            // if the index is out of range, default to showing the first member.
            if (!index.HasValue || index < 0 || index > UserSession.OwnersCorpNames.Count)
            {
                index = 0;
            }
            OwnerResponse response = Messenger.GetOwnerCorpInfo(UserSession.OwnersCorpNames[index.Value].Id);
            OwnersCorpModel model = OwnersCorpModel.CreateOwnersCorpModel(UserSession, response, index.Value);
            return View(model);
        }

        [OutputCache(Location = System.Web.UI.OutputCacheLocation.Client, Duration = 100000)]
        // Plan number is not used, however it is needed for caching - url would be the same for different owners corp.
        // adding the plan gives it a unique path / url.
        public ActionResult ManagerPhoto(string PlanNo)
        {
            if (Session["ManagerPhoto"] != null)
            {
                string base64img = Session["ManagerPhoto"].ToString();
                byte[] array = Convert.FromBase64String(base64img);

                Response.Cache.SetCacheability(System.Web.HttpCacheability.Public);
                Response.Cache.SetLastModified(DateTime.Now.AddMinutes(-1));

                Session["ManagerPhoto"] = null;

                return File(array, "image/jpeg");
            }
            return null;
        }
    }
}
