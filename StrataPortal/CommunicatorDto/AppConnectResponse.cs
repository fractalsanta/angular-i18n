using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CommunicatorDto
{
    [DataContract]
    [Serializable]
    public class AppConnectResponse
    {
        [DataMember]
        public bool IsOk { get; set; }

        [DataMember]
        public string Message { get; set; }

        [DataMember]
        public Exception Error { get; set; }

        public AppConnectResponse()
        {
            IsOk = false;
            Message = string.Empty;
            Error = null;
        }

        public void SetErrorMessage(string message)
        {
            IsOk = false;
            Message = message;
        }
    }
}
