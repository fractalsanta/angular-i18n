using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Rockend.iStrata.StrataWebsite.Model;
using Rockend.iStrata.StrataCommon.Response;
using Rockend.iStrata.StrataCommon.BusinessEntities;

namespace Rockend.iStrata.StrataWebsite.Controllers
{
    public class MeetingController : BaseController
    {
        [AuthorizeStrata]
        public ActionResult Index(int index)
        {
            SetPageTitle("Meetings");

            MeetingModel model = new MeetingModel();

            if (UserSession != null && UserSession.LotNames != null && UserSession.LotNames.Count() > index)
            {
                var lot = UserSession.LotNames[index];

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
            }
            else
            {
                return RedirectToAction("Logout", "Account");
            }            

            return View(model);
        }

        public ActionResult Vote(int index, int meeting)
        {
            SetPageTitle("Online Voting");

            var model = new VotingModel();

            if (UserSession != null && UserSession.LotNames != null && UserSession.LotNames.Count() > index)
            {
                
                var lot = UserSession.LotNames[index];
                var lotOwner = UserSession.LotOwners[index];
               
                OwnerResponse response = Messenger.GetOwnerCorpInfo(UserSession.OwnersCorpNames[0].Id);
                
                var lotEntitlementList = response.LotEntitlementList.Single(el => el.LotNumber == Convert.ToString(lot.Id));
                var lotEntitlement = lotEntitlementList.EntitlementList.SingleOrDefault(el => el.Name.ToLower() == "levy entitlement");
                
                if (lotEntitlement != null)
                {
                    model.LevyAmount = lotEntitlement.Amount;
                }
                
                model.PlanId = lot.PlanId;
                model.CurrentLotIndex = index;
                model.Meeting = UserSession.Meetings[model.PlanId].Where(m => m.MeetingDate.Date >= DateTime.Now.Date).ToList()[meeting];
                model.LotName = lot.Name;
                model.OwnerName = UserSession.CurrentUsersName;


                model.Meeting.AgendaItems = new List<MeetingAgendaItemResponse>();
                model.Meeting.AgendaItems.Add(new MeetingAgendaItemResponse()
                {
                    SortOrder = 1,
                    Description = "That we obtain quotes to replace all battery operated smoke alarms to hard wired units.",
                    MotionText = "Please refer to Addendum #2 in the attachments of the Agenda to this meeting. This is an essential change, so we are voting on whether to start the process of obtaining quotes now or whether we should wait until the new financial year.",
                    MeetingRecordItem = new MeetingRecord()
                });
                model.Meeting.AgendaItems.Add(new MeetingAgendaItemResponse()
                {
                    SortOrder = 2,
                    Description = "That we come to an agreement regarding installation of the new security gate",
                    MotionText = "A new security gate has been ordered as per the conclusion reach in the previous meeting; we must decide on a date to conduct the installation.",
                    MeetingRecordItem = new MeetingRecord()
                });
                //model.Meeting.SortOrder = 1;
                //model.Meeting.Description = "That we obtain quotes to replace all battery operated smoke alarms to hard wired units.";
                ///t model.Meeting.MotionText = "Please refer to Addendum #2 in the attachments of the Agenda to this meeting. This is an essential change, so we are voting on whether to start the process of obtaining quotes now or whether we should wait until the new financial year.";

                //model.Meeting.AgendaItems.Add(new MeetingAgendaReponse());
            }           
            else
            {
                return RedirectToAction("Logout", "Account");
            }

            return View(model);
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Vote(VotingModel model)
        {
            return View("Vote", model);
        }
    }
}
