using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CommunicatorDto
{
    [DataContract]
    [Serializable]
    public class AgentContentRestDto
    {
        [DataMember]
        public AgentContentDTO AgentContent { get; set; }

        [DataMember]
        public bool ShowMaintenancePage { get; set; }

        [DataMember]
        public bool ShowMaintenanceDetails { get; set; }

        [DataMember]
        public bool ShowMaintenanceImages { get; set; }

        [DataMember]
        public bool ShowManagerPhoto { get; set; }

        [DataMember(Order = 0)]
        public bool ShowInvoicesPage { get; set; }

        [DataMember(Order = 1)]
        public bool ShowOutstandingInvoices { get; set; }

        [DataMember(Order = 2)]
        public bool ShowInspectionsTab { get; set; }

        [DataMember(Order = 3)]
        public bool ShowOwnerContacts { get; set; }
    }
}
