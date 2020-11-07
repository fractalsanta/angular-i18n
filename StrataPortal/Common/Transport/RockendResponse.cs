using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace Rockend.WebAccess.Common.Transport
{
    [DataContract]
    public class RockendResponse
    {
        [DataMember]
        public string Data { get; set; }
    }
}
