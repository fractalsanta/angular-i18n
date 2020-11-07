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
    public class ApplicationRequest
    {
        [DataMember]
        public string SessionID { get; set; }

        [DataMember]
        public int ServiceKey { get; set; }

        [DataMember]
        public string ServicePassword { get; set; }

        [DataMember]
        public int ApplicationKey { get; set; }

        [DataMember]
        public string ApplicationCode { get; set; }

        [DataMember]
        public string BodyXml { get; set; }

        [DataMember]
        public string ActionName { get; set; }

        [DataMember]
        public int TimeoutMS { get; set; }

        [DataMember]
        public Guid RequestID { get; set; }

        [DataMember]
        public string ClassName { get; set; }

        [DataMember]
        public string AssemblyName { get; set; }

        [DataMember]
        public bool IsTimeoutResponse { get; set; }

        [DataMember]
        public bool OneWay { get; set; }

		[DataMember]
        public bool IsError { get; set; }

        [DataMember(Order = 0)]
        public string DeviceType { get; set; }

        [DataMember(Order=1)]
        public string AppVersion { get; set; }
    }
}
