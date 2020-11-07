using System;
using System.Collections.Generic;
using System.Data.Linq.Mapping;
using System.Linq;
using System.Text;

namespace Communicator.DAL.Entities
{
    [Table(Name = "AgentContentSTRATA")]
    public class AgentContentStrata
    {
        [Column(Name = "AgentContentStrataId", IsPrimaryKey = true, IsDbGenerated = true)]
        public int AgentContentRestId { get; set; }

        [Column(Name = "AgentContentId")]
        public int AgentContentId { get; set; }

        [Column(Name = "ShowPropertyPhoto")]
        public bool ShowPropertyPhoto { get; set; }

        [Column(Name = "ShowManagerNameAndPhoto")]
        public bool ShowManagerNameAndPhoto { get; set; }

        [Column(Name = "ShowManagerEmail")]
        public bool ShowManagerEmail { get; set; }

        [Column(Name = "ShowMaintenancePageOwner")]
        public bool ShowMaintenancePageOwner { get; set; }

        [Column(Name = "ShowMaintenancePageExec")]
        public bool ShowMaintenancePageExec { get; set; }

        [Column(Name = "ShowMaintenanceImages")]
        public bool ShowMaintenanceImages { get; set; }

        [Column(Name = "ShowMaintenanceDetailsOwner")]
        public bool ShowMaintenanceDetailsOwner { get; set; }

        [Column(Name = "ShowMaintenanceDetailsExec")]
        public bool ShowMaintenanceDetailsExec { get; set; }

        [Column(Name = "IsFsDocumentDescriptionOn")]
        public bool IsFsDocumentDescriptionOn { get; set; }

        [Column(Name = "ShowReportsPageOwner")]
        public bool ShowReportsPageOwner { get; set; }

        [Column(Name = "ShowReportsPageCommitteeMember")]
        public bool ShowReportsPageCommitteeMember { get; set; }

        [Column(Name = "ShowMeetingsPageOwner")]
        public bool ShowMeetingsPageOwner { get; set; }

        [Column(Name = "ShowMeetingsPageCommitteeMember")]
        public bool ShowMeetingsPageCommitteeMember { get; set; }

    }
}
