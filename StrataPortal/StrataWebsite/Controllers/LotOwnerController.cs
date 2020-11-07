using System;
using System.Web.Mvc;
using Agile.Diagnostics.Logging;
using Rockend.iStrata.StrataCommon;
using Rockend.iStrata.StrataCommon.Response;
using Rockend.iStrata.StrataWebsite.Helpers;
using Rockend.iStrata.StrataWebsite.Model;

namespace Rockend.iStrata.StrataWebsite.Controllers
{
    /// <summary>
    /// Controller for the Lot Owner details pages.
    /// </summary>
    [AuthorizeStrata(Users = RoleInfo.RoleNameOwnerAndExec)]
    public class LotOwnerController : BaseController
    {
        /// <summary>
        /// ctor
        /// </summary>
        public LotOwnerController()
        {
            Logger.Info("LotOwnerController ctor");
        }

        /// <summary>
        /// Displays the general lot owner details for the specified lot index.
        /// </summary>
        /// <param name="index">The index of the lot to show.</param>
        /// <returns>View ActionResult.</returns>
        public ActionResult General(int? index)
        {
            Logger.Info("LotOwnerController.General");
            // if the index is out of range, default to showing the first lot.
            if (!index.HasValue || index < 0 || index > UserSession.LotNames.Count)
            {
                index = 0;
            }
            LotResponse response = Messenger.GetLotInfo(UserSession.LotNames[index.Value].Id);
            LotOwnerModel model = LotOwnerModel.CreateLotOwnerModel(UserSession, response, index.Value);
            return View(model);
        }

        /// <summary>
        /// Displays the contact details for the specified lot index.
        /// </summary>
        /// <param name="index">The index of the lot to show.</param>
        /// <returns>View ActionResult.</returns>
        public ActionResult Contacts(int? index)
        {
            SetPageTitle("Owner Properties");

            // if the index is out of range, default to showing the first lot.
            if (!index.HasValue || index < 0 || index > UserSession.LotNames.Count)
            {
                index = 0;
            }
            Logger.Debug("Contacts.GetLotInfo({0})", index.Value);

            if (UserSession == null || UserSession.LotNames == null && UserSession.LotNames[index.Value] == null)
            {                
                return RedirectToAction("Logout", "Account");
            }
            LotResponse response = Messenger.GetLotInfo(UserSession.LotNames[index.Value].Id);
            LotOwnerModel model = LotOwnerModel.CreateLotOwnerModel(UserSession, response, index.Value);
            return View(model);
        }

        [OutputCache(Location = System.Web.UI.OutputCacheLocation.Client, Duration = 100000)]
        // Plan number is not used, however it is needed for caching - url would be the same for different owners corp.
        // adding the plan gives it a unique path / url.
        public ActionResult PropertyPhoto(string PlanNo)
        {
            if (Session["PropertyPhoto"] != null)
            {
                string base64img = Session["PropertyPhoto"].ToString();
                byte[] array = Convert.FromBase64String(base64img);

                Response.Cache.SetCacheability(System.Web.HttpCacheability.Public);
                Response.Cache.SetLastModified(DateTime.Now.AddMinutes(-1));

                Session["PropertyPhoto"] = null;

                return File(array, "image/jpeg");
            }
            return null;
        }
    }
}
