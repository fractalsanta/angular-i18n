using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace Rockend.WebAccess.Common.ClientMessage
{
    [DataContract]
    public class FileCheckRequest
    {
        [DataMember]
        public string FileName { get; set; }

        [DataMember]
        public long Filesize { get; set; }
    }
}
