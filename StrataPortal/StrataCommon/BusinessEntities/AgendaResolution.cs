using System.Data.Linq.Mapping;

namespace Rockend.Strata.Processor.MeetingAppSyncMeetingsV5.BusinessEntities
{
    /// <summary>
    /// Maps to the SM table
    /// </summary>
    [Table(Name = "AgendaWizardResolution")]
    public class AgendaResolution
    {
        [Column(Name = "lAgendaWizardResolutionID", IsPrimaryKey = true)]
        public int AgendaResolutionID { get; set; }

        [Column(Name = "lAgendaWizardID")]
        public int AgendaWizardID { get; set; }

        [Column(Name = "sDescription")]
        public string Description { get; set; }

        [Column(Name = "sFormattedText")]
        public string FormattedText { get; set; }

    }

}
