using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Rockend.iStrata.StrataWebsite.Model;

namespace Rockend.iStrata.StrataWebsite.Controllers
{
    public class MeetingController : BaseController
    {
        [AuthorizeStrata]
        public ActionResult Index(int index)
        {
            SetPageTitle("Meetings");

            var lot = UserSession.LotNames[index];

            MeetingModel model = new MeetingModel();
            model.PlanId = lot.PlanId;
            model.CurrentLotIndex = index;

            if (UserSession.Meetings[model.PlanId] != null && UserSession.Meetings[model.PlanId].Count > 0)
            {
                model.Meetings = UserSession.Meetings[model.PlanId].Where(m => 
                    m.MeetingDate.Date >= DateTime.Now.Date).ToList();

                model.PastMeetings = UserSession.Meetings[model.PlanId].Where(m =>
                    m.MeetingDate.Date < DateTime.Now.Date).OrderByDescending(m => m.MeetingDate).ToList();
            }
            
            model.UserSession = UserSession;

            return View(model);
        }
    }
}
