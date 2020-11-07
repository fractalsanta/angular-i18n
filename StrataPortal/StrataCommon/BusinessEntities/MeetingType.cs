using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data.Linq.Mapping;
using System.Runtime.Serialization;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [Table]
    [DataContract]
    [Serializable]
    public class MeetingType
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
    }
}
