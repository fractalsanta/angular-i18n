using System;
using System.Collections.Generic;
using System.Data.Linq.Mapping;
using System.Linq;
using System.Text;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [Table(Name = "DiaryHeader")]
    public class DiaryHeader
    {
        [Column(Name = "lDiaryHeaderID", IsPrimaryKey = true, IsDbGenerated = false)]
        public int DiaryHeaderID { get; set; }

        [Column(Name = "sDiarySubject")]
        public string DiarySubject { get; set; }

        [Column(Name = "brecordclosed")]
        public string RecordClosed { get; set; }

        [Column(Name = "sObjectType")]
        public string ObjectType { get; set; }

        [Column(Name = "lObjectID")]
        public int ObjectID { get; set; }

        [Column(Name = "lActionUserID")]
        public int ActionUserID { get; set; }

        [Column(Name = "bActionRequired")]
        public string ActionRequired { get; set; }

        [Column(Name = "dActionDueDate")]
        public DateTime ActionDueDate { get; set; }
    }
}
