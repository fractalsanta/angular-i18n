using System;
using System.Collections.Generic;
using System.Data.Linq.Mapping;
using System.Linq;
using System.Text;

namespace Communicator.DAL.Entities
{
    [Table(Name = "AgentContentREST")]
    public class AgentContentRest
    {
        [Column(Name = "AgentContentRestId", IsPrimaryKey = true, IsDbGenerated=true)]
        public int AgentContentRestId { get; set; }

        [Column(Name = "AgentContentId")]
        public int AgentContentId { get; set; }

        [Column(Name = "ShowMaintenancePage")]
        public bool ShowMaintenancePage { get; set; }

        [Column(Name = "ShowMaintenanceDetails")]
        public bool ShowMaintenanceDetails { get; set; }

        [Column(Name = "ShowMaintenanceImages")]
        public bool ShowMaintenanceImages { get; set; }

        [Column(Name = "ShowManagerPhoto")]
        public bool ShowManagerPhoto { get; set; }

        [Column(Name = "ShowInvoicesPage")]
        public bool ShowInvoicesPage { get; set; }

        [Column(Name = "ShowOutstandingInvoices")]
        public bool ShowOutstandingInvoices { get; set; }

        [Column(Name = "ShowInspectionsTab")]
        public bool ShowInspectionsTab { get; set; }

        [Column(Name = "ShowOwnerContacts")]
        public bool ShowOwnerContacts { get; set; }
    }
}
