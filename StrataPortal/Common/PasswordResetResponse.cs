using System;
using System.Runtime.Serialization;

namespace Rockend.WebAccess.Common
{
    [DataContract]
    public class PasswordResetResponse
    {
        [DataMember]
        public string NewPassword { get; set; }

        [DataMember]
        public string Email { get; set; }
    }
}
