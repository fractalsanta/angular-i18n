using Rockend.iStrata.StrataCommon.Response;
using System;
using System.Collections.Generic;

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
        public string TimeZoneId { get; set; }
        public int? SubmittedMeetingRegisterId { get; set; }
        public DateTime? VoteSubmittedDate { get; set; }

        public bool IsVotingClosed(MeetingResponse meeting)
        {
            var cutOffDateTimeUTC = ConvertToUTCFromTimezone(DateTime.Parse(meeting.VotingCutOffDate.ToShortDateString() + " " + meeting.VotingCutOffTime));
            
            return DateTime.UtcNow >= cutOffDateTimeUTC;
        }
  
        public string VenuesMeetingVenues(MeetingResponse meeting)
        {
            var venues = new List<string>();

            if (safeTrim(meeting.VenueName).Length > 0)
                venues.Add(meeting.VenueName);
            if (safeTrim(meeting.Venue2).Length > 0)
                venues.Add(meeting.Venue2);
            if (safeTrim(meeting.Venue3).Length > 0)
                venues.Add(meeting.Venue3);

            return venues.Count > 0 ? string.Join(", ", venues) : "";
        }

        private string safeTrim(string value)
        {
            return string.IsNullOrEmpty(value) ? string.Empty : value.Trim();
        }

        private DateTime ConvertToUTCFromTimezone(DateTime value)
        {
            if (string.IsNullOrEmpty(this.TimeZoneId))
                return value;

            var timezone = TimeZoneInfo.FindSystemTimeZoneById(this.TimeZoneId);

            return TimeZoneInfo.ConvertTimeToUtc(value, timezone);
        }
    }
}
