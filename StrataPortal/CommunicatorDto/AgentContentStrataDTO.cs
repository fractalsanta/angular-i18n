using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CommunicatorDto
{
    [DataContract]
    [Serializable]
    public class AgentContentStrataDto
    {
        [DataMember]
        public AgentContentDTO AgentContent { get; set; }

        [DataMember]
        public bool ShowPropertyPhoto { get; set; }

        [DataMember]
        public bool ShowManagerNameAndPhoto { get; set; }
        
        [DataMember]
        public bool ShowManagerEmail { get; set; }

        [DataMember]
        public bool ShowMaintenancePageOwner { get; set; }

        [DataMember]
        public bool ShowMaintenancePageExec { get; set; }

        [DataMember]
        public bool ShowMaintenanceImages { get; set; }

        [DataMember]
        public bool ShowMaintenanceDetailsOwner { get; set; }

        [DataMember]
        public bool ShowMaintenanceDetailsExec { get; set; }

        [DataMember]
        public bool IsFsDocumentDescriptionOn { get; set; }

        [DataMember]
        public bool ShowReportsPageOwner { get; set; }

        [DataMember]
        public bool ShowReportsPageCommitteeMember { get; set; }

        [DataMember]
        public bool ShowMeetingsPageOwner { get; set; }

        [DataMember]
        public bool ShowMeetingsPageCommitteeMember { get; set; }
    }
}
