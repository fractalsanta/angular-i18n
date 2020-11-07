using System;
using System.Collections.Generic;
using System.Data.Linq.Mapping;
using System.Linq;
using System.Text;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [Table]
    public class PolicyType
    {
        [Column(Name = "lPolicyTypeID", IsPrimaryKey = true)]
        public int PolicyTypeID { get; set; }

        [Column(Name = "sDescription")]
        public string Description { get; set; }

    }
}
