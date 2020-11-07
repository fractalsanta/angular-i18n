using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Rockend.iStrata.StrataCommon.Response;
using System.Runtime.Serialization;

namespace Rockend.iStrata.StrataCommon.Request
{
    [DataContract]
    public class BudgetReportRequest
    {
        [DataMember]
        public List<int> OwnerCorpOIDList { get; set; }
    }
}
