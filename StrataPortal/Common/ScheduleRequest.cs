using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace Rockend.WebAccess.Common
{
    [DataContract]
    public class ScheduleRequest
    {
        [DataMember]
        public int ApplicationKey { get; set; }

        [DataMember]
        public string ApplicationCode { get; set; }
    }
}
