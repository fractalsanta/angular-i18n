using System.Runtime.Serialization;
using System;

namespace Rockend.WebAccess.Common
{
    [DataContract]
    public class VersionCheckRequest
    {
        [DataMember]
        public string ApplicationCode { get; set; }

        [DataMember]
        public int MajorVersion { get; set; }

        [DataMember]
        public int MinorVersion { get; set; }

        [DataMember]
        public string DBVersion { get; set; }

        [DataMember]
        public string SoftwareVersion { get; set; }
    }
}
