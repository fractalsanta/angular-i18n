using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace Rockend.WebAccess.Common.ClientMessage
{
    [DataContract]
    public class FileCheckResponse
    {
        [DataMember]
        public bool OK { get; set; }
    }
}
