using System;
using System.Collections.Generic;
using System.Data.Linq.Mapping;
using System.Linq;
using System.Text;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [Table]
    public class ContractType
    {
        [Column(Name = "lContractTypeID", IsPrimaryKey = true)]
        public int ContractTypeID { get; set; }

        [Column(Name = "sDescription")]
        public string Description { get; set; }
    }
}
