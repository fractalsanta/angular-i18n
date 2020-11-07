using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using System.Xml.Linq;

namespace Rockend.WebAccess.Common.ClientMessage
{
    [DataContract]
    [Serializable]
    public class XMLDataResponse
    {
        [DataMember]
        public string Data { get; set; }
    }
}
