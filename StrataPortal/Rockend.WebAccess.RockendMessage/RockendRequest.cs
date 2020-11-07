using System.Runtime.Serialization;

namespace Rockend.WebAccess.RockendMessage
{
    [DataContract]
    public class RockendRequest
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
        public string BodyXml { get; protected set; }

        [DataMember]
        public string ActionName { get; set; }

        [DataMember]
        public int TimeoutMS { get; set; }

        #if !NETFX_CORE
        public object Body
        {
            get
            {
                return BodyXml?.DeserializeFromXML();
            }
            set
            {
                BodyXml = value.SerializeToXML();
            }
        }

        public T BodyAs<T>() where T : class
        {
            return BodyXml?.DeserializeFromXML<T>();
        }
        #endif
    }
}
