using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [Serializable]
    public class BudgetItem
    {
        public int OwnerCorpOID { get; set; }
        public int OID { get; set; }
        public DateTime StartDate { get; set; }
        public bool DateIsCurrent { get; set; }
    }
}
