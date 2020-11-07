using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace Rockend.WebAccess.Common
{
    [DataContract]
    public class UpdateScheduleRequest
    {
        [DataMember]
        public ScheduleDto Schedule { get; set; }
    }
}
