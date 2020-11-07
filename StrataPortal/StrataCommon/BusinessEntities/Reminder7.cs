using System;
using System.Collections.Generic;
using System.Data.Linq.Mapping;
using System.Linq;
using System.Text;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [Table(Name="Reminder")]
    public class Reminder7
    {
        [Column(Name = "lReminderID")]
        public Int32 ReminderID { get; set; }

        [Column(Name = "sFunction")]
        public string Function { get; set; }

        [Column(Name = "sCriteria")]
        public string Criteria { get; set; }

        [Column(Name = "sDefaultValue1")]
        public string DefaultValue1 { get; set; }

        [Column(Name = "sDefaultValue2")]
        public string DefaultValue2 { get; set; }

        [Column(Name = "sDefaultUnit")]
        public string DefaultUnit { get; set; }

        [Column(Name = "sDefaultType")]
        public string DefaultType { get; set; }

        [Column(Name = "sAlert")]
        public string Alert { get; set; }

        [Column(Name = "lOrderBy")]
        public Int32 OrderBy { get; set; }
    }
}
