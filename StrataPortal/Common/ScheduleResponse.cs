using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace Rockend.WebAccess.Common
{
    [DataContract]
    public class ScheduleResponse
    {
        [DataMember]
        public List<ScheduleDto> ScheduleList { get; set; }

        [DataMember]
        public bool IsOk { get; set; }

        [DataMember]
        public Exception Error { get; set; }

        [DataMember]
        public string Message { get; set; }

        public ScheduleResponse()
        {
            ScheduleList = new List<ScheduleDto>();
            Error = null;
            IsOk = true;
            Message = string.Empty;
        }
    }
}
