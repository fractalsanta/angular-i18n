using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Rockend.iStrata.StrataCommon.Response;

namespace Rockend.iStrata.StrataWebsite.Model
{
    public class MeetingModel
    {
        private int planId, currentLotIndex;

        public int PlanId
        {
            get { return this.planId; }
            set { this.planId = value; }
        }

        public int CurrentLotIndex 
        {
            get { return this.currentLotIndex; }
            set { this.currentLotIndex = value; }
        }

        public UserSession UserSession { get; set; }

        public List<MeetingResponse> Meetings { get; set; }
        public List<MeetingResponse> PastMeetings { get; set; }

        public List<MeetingAgendaItemResponse> AgendaItems { get; set; }

        public bool IsVotingClosed(int meetingIndex)
        {
            var meeting = this.Meetings[meetingIndex];
            var cutOffDateTime = DateTime.Parse(meeting.VotingCutOffDate.ToLocalTime().ToShortDateString() + " " + meeting.VotingCutOffTime);            

            return DateTime.Now.ToLocalTime() >= cutOffDateTime;
        }
    }
}
