using System;
using System.Collections.Generic;
using System.Data.Linq.Mapping;
using System.Linq;
using System.Text;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [Table]
    [Serializable]
    public class MeetingStep
    {
        [Column(Name = "lMeetingStepID", IsPrimaryKey = true)]
        public int MeetingStepID { get; set; }

        [Column(Name = "lOwnersCorporationID")]
        public int OwnersCorporationID { get; set; }

        [Column(Name = "lMeetingRegisterID")]
        public int MeetingRegisterID { get; set; }

        [Column(Name = "lMeetingWizardListID")]
        public int MeetingWizardListID { get; set; }

        [Column(Name = "lSortOrder")]
        public int SortOrder { get; set; }

        [Column(Name = "bIsCompleted")]
        public string IsCompleted { get; set; }

        [Column(Name = "lCompletedBy")]
        public int? CompletedBy { get; set; }

        [Column(Name = "dCompleted")]
        public DateTime Completed { get; set; }

        [Column(Name = "sName")]
        public string Name { get; set; }

        [Column(Name = "sDescription")]
        public string Description { get; set; }
    }
}
