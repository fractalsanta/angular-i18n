using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace Rockend.WebAccess.Common
{
    [DataContract]
    [Serializable]
    public class ScheduleParameterDto
    {
        [DataMember]
        public int ScheduleParameterId { get; set; }

        [DataMember]
        public int ScheduleId { get; set; }

        [DataMember]
        public string Name { get; set; }

        [DataMember]
        public string Value { get; set; }
    }
}
