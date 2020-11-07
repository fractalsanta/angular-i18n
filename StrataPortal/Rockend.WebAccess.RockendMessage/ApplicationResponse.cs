using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace Rockend.WebAccess.RockendMessage
{
#if !NETFX_CORE
    [Serializable]
#endif
    [DataContract]
    public class ApplicationResponse
    {
        [DataMember]
        public Guid RequestID { get; set; }

        [DataMember]
        public string Data { get; set; }

        [DataMember]
        public int ApplicationKey { get; set; }

        [DataMember]
        public string ApplicationCode { get; set; }
    }
}
