using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace Rockend.iStrata.StrataCommon.Response
{
    [DataContract]
    [Serializable]
    public class MeetingResponse
    {
        [DataMember]
        public int MeetingRecordID { get; set; }

        [DataMember]
        public int LotID { get; set; }

        [DataMember]
        public string Description { get; set; }

        [DataMember]
        public string Manager { get; set; }

        [DataMember]
        public DateTime MeetingDate { get; set; }

        [DataMember]
        public string MeetingTime { get; set; }

        [DataMember]
        public string VenueName { get; set; }

        [DataMember]
        public bool AllowVoting { get; set; }

        [DataMember]
        public DateTime VotingCutOffDate { get; set; }

        [DataMember]
        public string VotingCutOffTime { get; set; }

        [DataMember]
        public string Venue2 { get; set; }

        [DataMember]
        public string Venue3 { get; set; }
    }
}
