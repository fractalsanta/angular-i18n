using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceModel;
using Rockend.WebAccess.Common.Transport;
using System.Runtime.Serialization;

namespace Rockend.WebAccess.Common.ClientMessage
{
    [DataContract]
    public class ApplicationRegistration
    {
        [DataMember]
        public string ApplicationCode { get; set; }
        
        [DataMember]
        public string ServiceName { get; set; }
        
        [DataMember]
        public EndpointAddress10 Endpoint { get; set; }

        [DataMember]
        public List<RockendApplication> ApplicationList { get; set; }
    }
}
