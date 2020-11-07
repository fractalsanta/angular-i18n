using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data.Linq.Mapping;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [Table]
    public class Budget
    {
        [Column(Name = "lOwnersCorporationID")]
        public int OwnersCorporationID { get; set; }

        [Column(Name = "dApplies")]
        public DateTime Applies { get; set; }

        [Column(Name = "lBudgetID")]
        public int BudgetID { get; set; }
    }
}
