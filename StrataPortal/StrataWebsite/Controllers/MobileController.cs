using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Rockend.iStrata.StrataCommon;

namespace Rockend.iStrata.StrataWebsite.Controllers
{
    public class MobileController : BaseController
    {
        //
        // GET: /Mobile/
        [AuthorizeStrata(Users = RoleInfo.RoleNameOwnerAndExec)]
        public ActionResult Menu()
        {
            return View();
        }
    }
}
