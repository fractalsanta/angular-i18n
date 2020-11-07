using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace Rockend.WebAccess.Common.ClientMessage
{
    [DataContract]
    public class UtilityResponse
    {
        [DataMember]
        public bool DownloadOk { get; set; }

        [DataMember]
        public bool UnzipOk { get; set; }

        [DataMember]
        public bool CopyToTargetOk { get; set; }

        [DataMember]
        public bool RunOk { get; set; }

        [DataMember]
        public bool UtilityAlreadyActive { get; set; }
    }
}
