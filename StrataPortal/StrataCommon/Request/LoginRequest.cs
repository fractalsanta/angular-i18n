using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using Rockend.iStrata.StrataCommon.Response;

namespace Rockend.iStrata.StrataCommon.Request
{
    [DataContract]
    public class LoginRequest
    {
        [DataMember]
        public Role Role { get; set; }
        [DataMember]
        public string UserName { get; set; }
        [DataMember]
        public string Password { get; set; }
    }
}
