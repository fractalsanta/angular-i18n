using System;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace CommunicatorDto
{
    [DataContract]
    public class UserLoginResponse
    {
        [DataMember]
        public int LoginCount { get; set; }

        [DataMember]
        public int TotalLogins { get; set; }

        [DataMember]
        public List<UserLoginDTO> LoginList { get; set; }

        [DataMember]
        public Exception Error { get; set; }

        public UserLoginResponse()
        {
            LoginCount = 0;
            LoginList = new List<UserLoginDTO>();
            Error = null;
        }
    }
}
