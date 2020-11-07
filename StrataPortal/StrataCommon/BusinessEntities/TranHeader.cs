using System;
using System.Collections.Generic;
using System.Data.Linq.Mapping;
using System.Linq;
using System.Text;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [Table(Name="tblTranHeader")]
    public class TranHeader
    {
        [Column(Name = "lTransactionID")]
        public int TransactionID { get; set; }

        [Column(Name = "sRefNumber")]
        public string RefNumber { get; set; }

        [Column(Name = "sDescription")]
        public string Description { get; set; }

        [Column(Name="lWorkOrderID")]
        public int WorkOrderID { get; set; }

        [Column(Name = "sTranType")]
        public string TranType { get; set; }
    }
}
