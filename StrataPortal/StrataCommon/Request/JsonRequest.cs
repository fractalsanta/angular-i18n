using System.Runtime.Serialization;

namespace Rockend.iStrata.StrataCommon.Request
{
    [DataContract]
    public class JsonRequest
    {
        [DataMember]
        public string Json { get; set; }
    }
}