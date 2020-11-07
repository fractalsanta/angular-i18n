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
    /// <summary>
    /// This is old and for versions of SM less than 6.0
    /// </summary>
    [Table]
    [DataContract]
    [Serializable]
    public class MeetingRegister 
    {
        [Column(Name = "lMeetingRegisterID", IsPrimaryKey = true)]
        [DataMember]
        public int MeetingRegisterID { get; set; }

        [Column(Name = "lOwnersCorporationID")]
        [DataMember]
        public int OwnersCorporationID { get; set; }
        
        [Column(Name = "lMeetingTypeID")]
        [DataMember]
        public int MeetingTypeID { get; set; }
        
        [Column(Name = "sNoticeDays")]
        [DataMember]
        public string NoticeDays { get; set; }

        [Column(Name = "dMeeting")]
        [DataMember]
        public DateTime MeetingDate { get; set; }

        [Column(Name = "sMeetingTime")]
        [DataMember]
        public string MeetingTime { get; set; }

        [Column(Name = "sMeetingVenue")]
        [DataMember]
        public string MeetingVenue { get; set; }

        [Column(Name = "sBudgetPrepStatus")]
        [DataMember]
        public string BudgetPrepStatus { get; set; }

        [Column(Name = "sNoticeStatus")]
        [DataMember]
        public string NoticeStatus { get; set; }

        [Column(Name = "dNoticeIssued")]
        [DataMember]
        public DateTime NoticeIssued { get; set; }

        [Column(Name = "sMethodNoticeServed")]
        [DataMember]
        public string MethodNoticeServed { get; set; }

        [Column(Name = "bQuorum")]
        [DataMember]
        public string Quorum { get; set; }

        [Column(Name = "sMinutesStatus")]
        [DataMember]
        public string MinutesStatus { get; set; }

        [Column(Name = "dMinutesIssued")]
        [DataMember]
        public DateTime MinutesIssued { get; set; }

        [Column(Name = "sBudgetUpdated")]
        [DataMember]
        public string BudgetUpdated { get; set; }

        [Column(Name = "sECUpdated")]
        [DataMember]
        public string ECUpdated { get; set; }

        [Column(Name = "bActionRecorded")]
        [DataMember]
        public string ActionRecorded { get; set; }

        [Column(Name = "sNotes")]
        [DataMember]
        public string Notes { get; set; }

        [Column(Name = "sAuditRequired")]
        [DataMember]
        public string sAuditRequired { get; set; }

        [Column(Name = "sNominationsRequired")]
        [DataMember]
        public string NominationsRequired { get; set; }

        [Column(Name = "dNominationsCalled")]
        [DataMember]
        public DateTime NominationsCalled { get; set; }

        [Column(Name = "lStatusID")]
        public int StatusID { get; set; }

        [Column(Name = "dFinalised")]
        public DateTime Finalised { get; set; }
        
        public new string SyncMeetingStart { get; set; }
        public new string SyncMeetingFinish { get; set; }
        public new int? SyncedBy { get { return null; } set { value = value; } }
        public new DateTime SyncedDate { get; set; }
        public new string SyncIsQuorumReached { get; set; }
        public new string MeetingVenue2 { get; set; }
        public new string MeetingVenue3 { get; set; }
    }
}
