using System;
using System.Collections.Generic;
using System.Data.Linq.Mapping;
using System.Linq;
using System.Text;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [Table]
    [Serializable]
    public class MeetingAttendee
    {
        [Column(Name = "lMeetingAttendeeID", IsPrimaryKey = true)]
        public int MeetingAttendeeID { get; set; }

        [Column(Name = "lMeetingRegisterID")]
        public int MeetingRegisterID { get; set; }

        [Column(Name = "lLotID")]
        public int? LotID { get; set; }

        [Column(Name = "sAttendeeName")]
        public string AttendeeName { get; set; }

        [Column(Name = "sMeetingRepresentative")]
        public string MeetingRepresentative { get; set; }

        [Column(Name = "sAttendance")]
        public string Attendance { get; set; }

        [Column(Name = "sVote")]
        public string Vote { get; set; }
    }
}
