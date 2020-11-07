using System;
using System.Runtime.Serialization;

namespace Rockend.WebAccess.Common.Transport
{
    [DataContract]
    [Serializable]
    public class ErrorResponse
    {
        [DataMember]
        public string ErrorMessage { get; set; }

        [DataMember]
        public Exception Exception { get; set; }
    }
}
