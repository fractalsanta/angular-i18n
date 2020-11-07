using System;
using System.Collections.Generic;
using System.Diagnostics.Eventing.Reader;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using Rockend.iStrata.StrataCommon.BusinessEntities;

namespace Rockend.iStrata.StrataCommon.Response
{
    [DataContract]
    [Serializable]
    public class MeetingAgendaItemResponse
    {
        [DataMember]
        public int AgendaItemId { get; set; }
        [DataMember]
        public string Description { get; set; }

        [DataMember]
        public string MotionText { get; set; }

        [DataMember]
        public int SortOrder { get; set; }

        [DataMember]
        public MeetingRecord MeetingRecordItem { get; set; }

        [DataMember]
        public string SaveAction { get; set; }

    }
}
