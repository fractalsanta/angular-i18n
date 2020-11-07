using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using Rockend.iStrata.StrataCommon.BusinessEntities;

namespace Rockend.iStrata.StrataCommon.Response
{
    [DataContract]
    public class BudgetReportResponse
    {
        [DataMember]
        public List<BudgetItem> BudgetList { get; set; }
    }
}
