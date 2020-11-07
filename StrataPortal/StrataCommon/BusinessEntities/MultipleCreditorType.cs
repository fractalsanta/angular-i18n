using System;
using System.Collections.Generic;
using System.Data.Linq.Mapping;
using System.Linq;
using System.Text;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [Table]
    public class MultipleCreditorType
    {
        [Column(Name = "lMultipleCreditorTypeID")]
        public int MultipleCreditorTypeID { get; set; }

        [Column(Name = "lCreditorID")]
        public int CreditorID { get; set; }

        [Column(Name = "lCreditorTypeID")]
        public int CreditorTypeID { get; set; }
    }
}
