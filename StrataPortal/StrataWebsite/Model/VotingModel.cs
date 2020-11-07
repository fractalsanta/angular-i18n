using Rockend.iStrata.StrataCommon.Response;
using System;
using Rockend.iStrata.StrataCommon.BusinessEntities;
using System.Collections.Generic;
using System.Web.Mvc;

namespace Rockend.iStrata.StrataWebsite.Model
{
    public class VotingModel
    {
        public int PlanId { get; set; }
        public int CurrentLotIndex { get; set; }
        public MeetingResponse Meeting { get; set; }
        public List<MeetingAgendaItemResponse> AgendaItems { get; set; }
        public string Timezone { get; set; }

        private IList<SelectListItem> voteOptions;
        public IList<SelectListItem> VoteOptions
        {
            get
            {
                if (this.voteOptions == null)
                {
                    this.voteOptions = new List<SelectListItem>();
                    this.voteOptions.Add(new SelectListItem() { Value = "Y", Text = "Yes" });
                    this.voteOptions.Add(new SelectListItem() { Value = "N", Text = "No" });
                    this.voteOptions.Add(new SelectListItem() { Value = "A", Text = "Abstain" });
                }

                return this.voteOptions;
            }
        }
            
        public string LotName { get; set; }
        public string OwnerName { get; set; }
        public string LevyAmount { get; set; }
        public List<LotEntitlements> LotEntitlements { get; set; }
        public string DeclarationBy { get; set; }
        public string ProxyName { get; set; }
        public DateTime VotingCutoffDateTimeUTC { get; set; }
        
        public string VotingCutoffDescription()
        {
            var description = IsVotingClosed() ? "Voting for this meeting closed on {0} @ {1}" : "Voting closes on {0} @ {1}";

            return string.Format(description, Meeting.VotingCutOffDate.ToLocalTime().ToShortDateString(), Meeting.VotingCutOffTime);
        }

        public bool IsVotingClosed()
        {            
            return DateTime.UtcNow >= VotingCutoffDateTimeUTC.ToLocalTime();
        }

        public bool IsVoteOptionSelected(MeetingRecord meetingRecord, string expected)
        {
            return meetingRecord.Vote.ToLowerInvariant() == expected.ToLowerInvariant();
        }
    }
}