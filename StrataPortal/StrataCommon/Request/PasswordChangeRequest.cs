using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Rockend.iStrata.StrataCommon.Response;
using System.Runtime.Serialization;

namespace Rockend.iStrata.StrataCommon.Request
{
    [DataContract]
    public class PasswordChangeRequest
    {
        [DataMember]
        public string UserName { get; set; }

        [DataMember]
        public string OldPassword { get; set; }

        [DataMember]
        public string NewPassword { get; set; }
    }
}
