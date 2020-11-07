using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace Rockend.iStrata.StrataCommon.Response
{
    [DataContract]
    [Serializable]
    public class MeetingAgendaReponse
    {
        [DataMember]
        public List<MeetingAgendaItemResponse> AgendaItems { get; set; }

        [DataMember]
        public int MeetingRegisterId { get; set; }

        [DataMember]
        public string ProxyName { get; set; }


    }
}
