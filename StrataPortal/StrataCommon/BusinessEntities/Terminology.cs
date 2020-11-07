using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data.Linq.Mapping;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [Table]
    public class Terminology
    {
        [Column(Name = "lTerminologyID", IsPrimaryKey=true)]
        public int TerminologyID { get; set; }

        [Column(Name = "sLocalTerm")]
        public string LocalTerm { get; set; }

        [Column(Name = "sStandardTerm")]
        public string StandardTerm { get; set; }
    }
}
