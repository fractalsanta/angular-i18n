using Rockend.iStrata.StrataCommon.BusinessEntities;
using Rockend.iStrata.StrataCommon.Response;
using Rockend.iStrata.StrataWebsite.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace Rockend.iStrata.StrataWebsite.Controllers
{
    public class MeetingController : BaseController
    {        
        [AuthorizeStrata]
        public ActionResult Index(int index, DateTime? voteSubmitted = null, int? meetingRegisterId = null)
        {
            SetPageTitle("Meetings");

            MeetingModel model = new MeetingModel();
            string timezone = string.Empty;

            if (UserSession != null && UserSession.LotNames != null && UserSession.LotNames.Count() > index && UserCanViewMeetings()) 
            {
                if (SessionData != null)
                {
                    base.InitializeSessionData();
                    timezone = base.AgencyApplication.Timezone;
                }
                
                var lot = UserSession.LotNames[index];

                model.PlanId = lot.PlanId;
                model.CurrentLotIndex = index;
                model.TimeZoneId = timezone;
               
                if (UserSession.Meetings[model.PlanId] != null && UserSession.Meetings[model.PlanId].Count > 0)
                {
                    model.Meetings = UserSession.Meetings[model.PlanId].Where(m =>
                        m.MeetingDate.Date >= DateTime.Now.Date).ToList();

                    model.PastMeetings = UserSession.Meetings[model.PlanId].Where(m =>
                        m.MeetingDate.Date < DateTime.Now.Date).OrderByDescending(m => m.MeetingDate).ToList();
                }

                model.UserSession = UserSession;

                if (voteSubmitted.HasValue)
                {
                    model.VoteSubmittedDate = !string.IsNullOrEmpty(timezone) ? ConvertToUTCFromTimezone(voteSubmitted.Value, timezone) : voteSubmitted.Value;
                }
                
                model.SubmittedMeetingRegisterId = meetingRegisterId;
            }
            else
            {
                return RedirectToAction("Logout", "Account");
            }            

            return View(model);
        }

        [AuthorizeStrata]
        public ActionResult Vote(int index, int meetingRegisterId)
        {
            SetPageTitle("Online Voting");

            var model = new VotingModel();
            string timezone = string.Empty;

            if (UserSession != null && UserSession.LotNames != null && UserSession.LotNames.Count() > index)
            {
                if (SessionData!= null)
                {
                    base.InitializeSessionData();
                    timezone = base.AgencyApplication.Timezone;
                }                

                var lot = UserSession.LotNames[index];
                var lotOwner = UserSession.LotOwners[index];
               
                OwnerResponse response = Messenger.GetOwnerCorpInfo(lot.PlanId);
                
                var lotEntitlementList = response.LotEntitlementList.SingleOrDefault(el => el.LotNumber == Convert.ToString(lot.LotNumber));

                if (lotEntitlementList != null)
                {
                    var lotEntitlement = lotEntitlementList.EntitlementList.SingleOrDefault(el => el.Name.ToLower() == "levy entitlement");

                    if (lotEntitlement != null)
                    {
                        model.LevyAmount = lotEntitlement.Amount;
                    }
                }                
                
                model.PlanId = lot.PlanId;
                model.CurrentLotIndex = index;
                model.Meeting = UserSession.Meetings[model.PlanId].Single(m => m.MeetingRecordID == meetingRegisterId);
                model.LotName = lot.Name;
                model.OwnerName = UserSession.CurrentUsersName;
                
                var meetingAgendaResponse = Messenger.GetMeetingAgenda(lot.Id, model.Meeting.MeetingRecordID);
                var votingCutoffDateTime = DateTime.Parse(model.Meeting.VotingCutOffDate.ToShortDateString() + " " + model.Meeting.VotingCutOffTime);

                model.ProxyName = string.IsNullOrEmpty(meetingAgendaResponse.ProxyName) ? string.Empty : meetingAgendaResponse.ProxyName;
                model.AgendaItems = meetingAgendaResponse.AgendaItems;
                model.VotingCutoffDateTimeUTC = !string.IsNullOrEmpty(timezone) ? ConvertToUTCFromTimezone(votingCutoffDateTime, timezone) : votingCutoffDateTime;
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
            var agenda = new MeetingAgendaReponse() {
                AgendaItems = model.AgendaItems,
                ProxyName = model.DeclarationBy == "proxy" ? model.ProxyName : null
            };

            foreach (var item in agenda.AgendaItems)
            {
                item.MeetingRecordItem.DateChanged = DateTime.Now;
            }

            var result = Messenger.SyncVotesToStrata(agenda);
            var meetingRegisterId = agenda.AgendaItems.First().MeetingRecordItem.MeetingRegisterID;
           
            return RedirectToAction("Index", new { Index = model.CurrentLotIndex, voteSubmitted = result.VotePlaced, meetingRegisterId = meetingRegisterId });            
        }

        private DateTime ConvertToUTCFromTimezone(DateTime value, string timezoneId)
        {
            var timezone = TimeZoneInfo.FindSystemTimeZoneById(timezoneId);

            return TimeZoneInfo.ConvertTimeToUtc(value, timezone);
        }

        private bool UserCanViewMeetings()
        {
            if(UserSession != null)
            {
                if(UserSession.StrataVersionNumber < 1050)
                {
                    return AgentContentStrata.AgentContent.StrataShowMeetings;
                }

                if (UserSession.Role == StrataCommon.Role.Owner)
                {
                    return AgentContentStrata.ShowMeetingsPageOwner;
                }
                if (UserSession.Role == StrataCommon.Role.ExecutiveMember)
                {
                    return AgentContentStrata.ShowMeetingsPageCommitteeMember;
                }
            }
            return false;
        }
    }
}