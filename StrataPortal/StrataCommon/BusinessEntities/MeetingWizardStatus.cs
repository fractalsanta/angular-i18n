using System.Data.Linq.Mapping;
namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [Table(Name = "MeetingWizardStatus")]
    public partial class MeetingWizardStatus
    {
        [Column(Name = "lMeetingWizardStatusID", IsPrimaryKey = true)]
        public int MeetingWizardStatusID { get; set; }

        [Column(Name = "lValue")]
        public int Value { get; set; }

        [Column(Name = "sStandardName")]
        public string StandardName { get; set; }

        [Column(Name = "sLocalName")]
        public string LocalName { get; set; }
    }
}
