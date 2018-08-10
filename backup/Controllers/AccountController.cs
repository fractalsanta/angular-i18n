using System;
using System.Web.Mvc;
using System.Web.Security;
using Agile.Diagnostics.Logging;
using Rockend.iStrata.StrataWebsite.Helpers;
using Rockend.iStrata.StrataWebsite.Model;
using Rockend.iStrata.StrataCommon.Response;
using Rockend.iStrata.StrataCommon;

namespace Rockend.iStrata.StrataWebsite.Controllers
{
    /// <summary>
    /// Controller for user account actions.
    /// </summary>
    [AuthorizeStrata(Users = RoleInfo.RoleNameOwnerAndExec)]
    public class AccountController : BaseController
    {
        /// <summary>
        /// Display the Change Password page.
        /// </summary>
        /// <returns>View ActionResult.</returns>
        [AcceptVerbs(HttpVerbs.Get)]
        public ActionResult ChangePassword()
        {
            SetPageTitle("Change Password");

            TempData["Referrer"] = this.HttpContext.Request.UrlReferrer;
            return View();
        }

        /// <summary>
        /// Submits the Change Password form.
        /// </summary>
        /// <param name="oldPassword">The old password.</param>
        /// <param name="newPassword">The new password.</param>
        /// <param name="verifyNewPassword">The new password for verification.</param>
        /// <returns>Success Message, or redirects back to Change Password page with validation errors.</returns>
        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult ChangePassword(ChangePasswordModel model)
        {
            SetPageTitle("Change Password");

            if (string.IsNullOrEmpty(model.OldPassword))
            {
                ModelState.AddModelError("oldPassword", "Old password is required");
            }
            if (string.IsNullOrEmpty(model.NewPassword))
            {
                ModelState.AddModelError("newPassword", "New password is required");
            }
            if (string.IsNullOrEmpty(model.ConfirmPassword))
            {
                ModelState.AddModelError("verifyNewPassword", "New password verification is required");
            }
            if (!string.IsNullOrEmpty(model.NewPassword) && !string.IsNullOrEmpty(model.ConfirmPassword) && model.NewPassword != model.ConfirmPassword)
            {
                ModelState.AddModelError("verifyNewPassword", "Password verification does not match");
            }

            if (!ModelState.IsValid)
            {
                // refresh the temp referrer value so it stays for another request
                TempData["Referrer"] = TempData["Referrer"];
                return View();
            }

            PasswordChangeResponse response = Messenger.ChangePassword(UserSession.UserName, model.OldPassword, model.NewPassword);
            if (response.Result)
            {
                MessageModel message = new MessageModel("Change Password", "Password changed successfully", ((Uri)TempData["Referrer"]).AbsoluteUri);
                return View("Message", message);
            }

            ModelState.AddModelError("oldPassword", response.ResultText);

            // refresh the temp referrer value so it stays for another request
            if (TempData.ContainsKey("Referrer"))
            {
                TempData["Referrer"] = TempData["Referrer"];
            }
            return View();
        }

        /// <summary>
        /// Logout from the current session and redirects to the application root.
        /// </summary>
        /// <returns>Redirect ActionResult.</returns>
        public ActionResult Logout()
        {
            var key = string.Empty;
            if (SessionData.IsApplicationKeyValid)
            {
                key = string.Format("?aid={0}", SessionData.ApplicationKey);
            }
            else
            {
                key = AppKeyHelper.GetApplicationKeyFromUrl(Request.Url.AbsoluteUri);
                if (key == null || key.Length != 6)
                    key = string.Empty;
            }

            Logger.Debug("Logout key:{0}", key);
            FormsAuthentication.SignOut();
            SessionData.Reset();
            Session.Abandon();
            return Redirect(string.Format("/{0}", key));
        }

        public ActionResult LogoutAndChangeAppKey(string aid)
        {
            Logger.Debug("Logout and change to appkey: {0}", aid);
            FormsAuthentication.SignOut();
            SessionData.Reset();
            Session.Abandon();

            if (!string.IsNullOrWhiteSpace(aid))
            {
                aid = string.Concat("?aid=", aid);
            }

            return Redirect(string.Format("/{0}", aid));
        }

        public ActionResult Login()
        {
            Logger.Debug("Login");
            return RedirectToAction("Login", "Login");
        }
    }
}
