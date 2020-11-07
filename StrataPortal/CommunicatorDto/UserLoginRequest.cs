using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CommunicatorDto
{
    public enum ActivationStatusFilter
    {
        Active = 1,
        Inactive = 2,
        AllRecords = 3
    }


    [DataContract]
    public class UserLoginRequest
    {
        [DataMember]
        public int ApplicationKey { get; set; }

        [DataMember]
        public string SearchFilter { get; set; }

        [DataMember]
        public int MaxLogins { get; set; }

        [DataMember]
        public bool IncludeOwners { get; set; }

        [DataMember]
        public bool IncludeTenants { get; set; }

        [DataMember]
        public ActivationStatusFilter UserLoginStatus { get; set; }

        public UserLoginRequest()
        {
            ApplicationKey = 0;
            SearchFilter = string.Empty;
            MaxLogins = 1000;
            IncludeOwners = false;
            IncludeTenants = false;
            UserLoginStatus = ActivationStatusFilter.Active;
        }
    }
}

