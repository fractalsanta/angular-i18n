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
    /// Use this version for all SM 6.0 and over
    /// </summary>
    [Table(Name="MeetingRegister")]
    [DataContract]
    [Serializable]
    public class MeetingRegister100
    {
        public override string ToString()
        {
            return string.Format("[{0}] type:{1} venue:{2}", MeetingRegisterID, MeetingTypeID, MeetingVenue);
        }

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

        [Column(Name = "sSyncMeetingStart")]
        [DataMember]
        public string SyncMeetingStart { get; set; }

        [Column(Name = "sSyncMeetingFinish")]
        [DataMember]
        public string SyncMeetingFinish { get; set; }

        [Column(Name = "lSyncBy")]
        [DataMember]
        public int? SyncedBy { get; set; }

        [Column(Name = "dSynced")]
        [DataMember]
        public DateTime SyncedDate { get; set; }

        [Column(Name = "bSyncIsQuorumReached")]
        [DataMember]
        public string SyncIsQuorumReached { get; set; }

        [Column(Name = "sMeetingVenue2")]
        [DataMember]
        public string MeetingVenue2 { get; set; }

        [Column(Name = "sMeetingVenue3")]
        [DataMember]
        public string MeetingVenue3 { get; set; }

        [Column(Name = "dFinalised")]
        [DataMember]
        public DateTime Finalised { get; set; }

        [Column(Name = "dArrearsCutOff")]
        [DataMember]
        public DateTime ArrearsCutOff { get; set; }

        [Column(Name = "lStatusID")]
        [DataMember]
        public int StatusID { get; set; }

        [Column(Name = "dPreVotingCutOffDate")]
        [DataMember]
        public DateTime PreVotingCutOffDate { get; set; }

        [Column(Name = "sPreVotingCutOffTime")]
        [DataMember]
        public String PreVotingCutOffTime { get; set; }

        [Column(Name = "bAllowElectronicVoting")]
        [DataMember]
        public string AllowElectronicVoting { get; set; }

        [Column(Name = "sMeetingOrigin")]
        [DataMember]
        public string MeetingOrigin { get; set; }

        [Column(Name = "bMeetingOpenForOnlineVoting")]
        [DataMember]
        public string MeetingOpenForOnlineVoting { get; set; }

        [Column(Name ="lAuditorId")]
        [DataMember]
        public int? AuditorId { get; set; }
    }
}
