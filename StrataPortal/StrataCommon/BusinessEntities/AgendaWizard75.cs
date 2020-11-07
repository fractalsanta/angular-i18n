using System.Collections.Generic;
using System.Data.Linq;
using System.Data.Linq.Mapping;

namespace Rockend.Strata.Processor.MeetingAppSyncMeetingsV5.BusinessEntities
{
    /// <summary>
    /// This version is for SM7.5 and greater
    /// </summary>
    [Table(Name = "AgendaWizard")]
    public class AgendaWizard75
    {
        /// <summary>
        /// ctor
        /// </summary>
        public AgendaWizard75()
        {
        }

        public override string ToString()
        {
            return string.Format("[{0}] mrid:{1} desc:{2}", AgendaWizardID, MeetingRegisterID, Description);
        }

        /// <summary>
        /// This is the new info available from 7.5
        /// </summary>
        private EntitySet<AgendaResolution> resolutions;
        [Association(Storage = "resolutions", OtherKey = "AgendaWizardID", IsForeignKey = true)]
        public EntitySet<AgendaResolution> Resolutions
        {
            get { return resolutions; }
            set { resolutions.Assign(value); }
        }

        [Column(Name = "lAgendaWizardID", IsPrimaryKey = true)]
        public int AgendaWizardID { get; set; }

        [Column(Name = "lMeetingRegisterID")]
        public int MeetingRegisterID { get; set; }

        [Column(Name = "lSortOrder")]
        public int SortOrder { get; set; }

        [Column(Name = "lAgendaNumber")]
        public int AgendaNumber { get; set; }

        [Column(Name = "sDescription")]
        public string Description { get; set; }

        [Column(Name = "sFormattedText")]
        public string FormattedText { get; set; }

        [Column(Name = "sResolutionText")]
        public string ResolutionText { get; set; }

        [Column(Name = "sNotesText")]
        public string NotesText { get; set; }

        [Column(Name = "bFullPage")]
        public string FullPage { get; set; }

        [Column(Name = "sResolved")]
        public string Resolved { get; set; }

        [Column(Name = "bPoll")]
        public string Poll { get; set; }

        [Column(Name = "sPollLotNumber")]
        public string PollLotNumber { get; set; }

        [Column(Name = "sPollRequestor")]
        public string PollRequestor { get; set; }

        [Column(Name = "bAmended")]
        public string Amended { get; set; }

        [Column(Name = "bSelected")]
        public string Selected { get; set; }

        [Column(Name = "bAgenda")]
        public string Agenda { get; set; }

        [Column(Name = "bMinutes")]
        public string Minutes { get; set; }
    }
}
