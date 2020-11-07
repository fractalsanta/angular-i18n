using System;
using System.Collections.Generic;
using System.Data.Linq.Mapping;
using System.Linq;
using System.Text;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [Table]
    public class LotRegisterType
    {
        [Column(Name = "lLotRegisterTypeID")]
        public int LotRegisterTypeID { get; set; }

        [Column(Name = "sDescription")]
        public string Description { get; set; }

        [Column(Name = "sDescriptionType")]
        public string DescriptionType { get; set; }
    }
}
