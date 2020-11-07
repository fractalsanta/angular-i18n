using System;
using System.Collections.Generic;
using System.Data.Linq.Mapping;
using System.Linq;
using System.Text;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    /// <summary>
    /// Use this version for all SM versions greater than 10.0
    /// </summary>
    [Table(Name = "AgendaWizard")]
    public class AgendaWizard100
    {
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

        [Column(Name ="lAgendaDefaultListID")]
        public int AgendaDefaultListId { get; set; }

        [Column(Name = "sFormattedTextEdit")]
        public string FormattedTextEdit { get; set; }

        [Column(Name = "sResolutionTextEdit")]
        public string ResolutionTextEdit { get; set; }

    }
}

