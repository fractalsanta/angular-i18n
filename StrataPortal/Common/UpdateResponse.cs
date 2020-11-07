using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace Rockend.WebAccess.Common
{
    [DataContract]
    public class UpdateResponse
    {
        [DataMember]
        public bool IsOk { get; set; }

        [DataMember]
        public string Result { get; set; }

        [DataMember]
        public Exception Error { get; set; }
    }
}
