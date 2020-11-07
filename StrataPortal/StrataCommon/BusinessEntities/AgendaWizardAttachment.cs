using System;
using System.Collections.Generic;
using System.Data.Linq.Mapping;
using System.Linq;
using System.Text;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [Table]
    public class AgendaWizardAttachment
    {
        [Column(Name = "lAgendaWizardAttachmentID", IsPrimaryKey = true)]
        public int AgendaWizardAttachmentID { get; set; }

        [Column(Name = "lMeetingRegisterID")]
        public int MeetingRegisterID { get; set; }

        [Column(Name = "sAttachmentName")]
        public string AttachmentName { get; set; }

        [Column(Name = "sFilePathName")]
        public string FilePathName { get; set; }

        [Column(Name = "lSortOrder")]
        public int SortOrder { get; set; }
    }
}
