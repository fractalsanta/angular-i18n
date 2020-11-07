using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace Rockend.WebAccess.Common
{
    [DataContract]
    public class ActionCheckRequest
    {
        [DataMember]
        public string ActionName { get; set; }

        [DataMember]
        public int Version { get; set; }

        [DataMember]
        public int? AppKey { get; set; }
    }
}
