using System;
using System.Collections.Generic;
using System.Data.Linq.Mapping;
using System.Linq;
using System.Text;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [Table(Name = "DiaryEntry")]
    public class DiaryEntry
    {
        [Column(Name = "lDiaryEntryID", IsPrimaryKey = true, IsDbGenerated = false)]
        public int DiaryEntryID { get; set; }

        [Column(Name = "lDiaryHeaderID")]
        public int DiaryHeaderID { get; set; }
    }
}
