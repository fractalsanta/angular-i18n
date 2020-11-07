using System;
using System.Collections.Generic;
using System.Data.Linq.Mapping;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [Table(Name = "MeetingType")]
    [DataContract]
    [Serializable]
    public class MeetingType60
    {
        [Column(Name = "lMeetingTypeID", IsPrimaryKey = true)]
        [DataMember]
        public int MeetingTypeID { get; set; }

        [Column(Name = "sMeetingCode")]
        [DataMember]
        public string MeetingCode { get; set; }

        [Column(Name = "sDescription")]
        [DataMember]
        public string Description { get; set; }

        [Column(Name = "bShowOnWeb")]
        [DataMember]
        public string ShowOnWeb { get; set; }

        [Column(Name = "bShowAllMeetings")]
        [DataMember]
        public string ShowAllMeetings { get; set; }

        [DataMember]
        [Column(Name = "lMeetingTypeDefaultID")]
        public int MeetingTypeDefaultID { get; set; }
    }
}
