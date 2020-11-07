using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace Rockend.WebAccess.Common.ClientMessage
{
    [DataContract]
    public class UtilityRequest
    {
        [DataMember]
        public string UtilityName { get; set; }

        [DataMember]
        public bool IsDownloadRequired { get; set; }

        [DataMember]
        public string BlobPath { get; set; }

        [DataMember]
        public string FileName { get; set; }

        [DataMember]
        public string TargetPath { get; set; }

        [DataMember]
        public bool RunUtility { get; set; }

        [DataMember]
        public string UtilityExeFilename { get; set; }

        [DataMember]
        public string MutexName { get; set; }
    }
}
