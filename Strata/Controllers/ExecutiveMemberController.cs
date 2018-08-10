using System.Web.Mvc;
using Rockend.iStrata.StrataCommon;
using Rockend.iStrata.StrataCommon.Response;
using Rockend.iStrata.StrataWebsite.Helpers;
using Rockend.iStrata.StrataWebsite.Model;

namespace Rockend.iStrata.StrataWebsite.Controllers
{
    /// <summary>
    /// Controller for the Executive Member details page.
    /// </summary>
    [AuthorizeStrata(Users = RoleInfo.RoleNameExecMember)]
    public class ExecutiveMemberController : BaseController
    {
        /// <summary>
        /// Displays the executive member details for the specified member index.
        /// </summary>
        /// <param name="index">The index of the member to show.</param>
        /// <returns>View ActionResult.</returns>
        public ActionResult Main(int? index)
        {
            SetPageTitle("Executive Member");

            // if the index is out of range, default to showing the first member.
            if (!index.HasValue || index < 0 || index > UserSession.ExecutiveMemberNames.Count)
            {
                index = 0;
            }
            ExecutiveResponse response = Messenger.GetExecInfo(UserSession.ExecutiveMemberNames[index.Value].Id);
            ExecutiveMemberModel model = ExecutiveMemberModel.CreateExecutiveMemberModel(UserSession, response, index.Value);
            return View(model);
        }
    }
}
