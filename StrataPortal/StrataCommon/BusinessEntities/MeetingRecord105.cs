using System;
using System.Collections.Generic;
using System.Data.Linq;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using System.Data.Linq.Mapping;
using Rockend.iStrata.StrataCommon.Helpers;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [Table(Name = "MeetingRecord")]
    [DataContract]
    [Serializable]
    public class MeetingRecord105
    {
        [Column(Name = "lMeetingRecordID", IsPrimaryKey = true)]
        [DataMember]
        public int MeetingRecordID { get; set; }

        [Column(Name = "lMeetingRegisterID")]
        [DataMember]
        public int MeetingRegisterID { get; set; }
        
        [Column(Name = "lLotID")]
        [DataMember]
        public int LotID { get; set; }
        
        [Column(Name = "lAgendaWizardID")]
        [DataMember]
        public int AgendaWizardID { get; set; }

        [Column(Name = "sVote")]
        [DataMember]
        public string Vote { get; set; }

        [Column(Name = "dDateChanged")]
        [DataMember]
        public DateTime DateChanged { get; set; }

        [Column(Name ="sProxyUsed")]
        [DataMember]
        public string VoterProxyName { get; set; }

    }
}
