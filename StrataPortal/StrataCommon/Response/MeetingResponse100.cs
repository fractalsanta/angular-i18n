using System;
using System.Collections.Generic;
using System.Diagnostics.Eventing.Reader;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using System.Windows.Forms;

namespace Rockend.iStrata.StrataCommon.Response
{
    [DataContract]
    [Serializable]
    public class MeetingResponse100
    {
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
        public string VotingCutOffDate { get; set; }

        [DataMember]
        public string VotingCutOffTime { get; set; }

        [DataMember]
        public List<MeetingRecordResponse> AgendaItems { get; set; }
    }
}
    
