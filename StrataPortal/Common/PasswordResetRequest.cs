using System.Runtime.Serialization;

namespace Rockend.WebAccess.Common
{
    [DataContract]
    public class PasswordResetRequest
    {
        [DataMember]
        public string UserName { get; set; }
    }
}
