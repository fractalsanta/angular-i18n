using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace Rockend.WebAccess.Common
{
    [DataContract]
    public class UpdateScheduleResponse
    {
        [DataMember]
        public bool IsOk { get; set; }

        [DataMember]
        public Exception Error { get; set; }

        [DataMember]
        public string Message { get; set; }
    }
}
