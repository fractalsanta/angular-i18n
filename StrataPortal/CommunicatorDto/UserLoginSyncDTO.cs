using System;
using System.Runtime.Serialization;

namespace CommunicatorDto
{
    [DataContract]
    [Serializable]
    public class UserLoginSyncDTO
    {
        public UserLoginSyncDTO() { }

        public override string ToString()
        {
            return string.Format("[{0}] UserName: {1} FullName: {2} IsActive: {3}", OriginalUserId, UserName, FullName, IsActive);
        }

        [DataMember]
        public int? OriginalUserId { get; set; }

        [DataMember]
        public string FullName { get; set; }

        [DataMember]
        public string UserName { get; set; }

        [DataMember]
        public bool IsActive { get; set; } 
    }
}
