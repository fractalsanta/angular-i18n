using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace Rockend.WebAccess.Common
{
    [DataContract]
    public class VersionUpdateRequest
    {
        [DataMember]
        public int ApplicationKey { get; set; }

        [DataMember]
        public int Version { get; set; }
    }
}
