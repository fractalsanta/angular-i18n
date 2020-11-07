using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace Rockend.WebAccess.Common
{
    [DataContract]
    public class VersionCheckResponse
    {
        [DataMember]
        public bool IsUpdateRequired { get; set; }

        [DataMember]
        public string NewVersion { get; set; }

        [DataMember]
        public byte[] ZipFile { get; set; }
    }
}
