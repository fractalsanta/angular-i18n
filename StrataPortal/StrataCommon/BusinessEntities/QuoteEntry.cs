using System;
using System.Collections.Generic;
using System.Data.Linq.Mapping;
using System.Linq;
using System.Text;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [Table(Name = "QuoteEntry")]
    public class QuoteEntry
    {
        [Column(Name = "lQuoteEntryID", IsPrimaryKey = true, IsDbGenerated = false)]
        public int QuoteEntryID { get; set; }

        [Column(Name = "lWorkOrderID")]
        public int WorkOrderID { get; set; }

        [Column(Name = "lQuoteNumber")]
        public int QuoteNumber { get; set; }

        [Column(Name = "sStatus")]
        public string Status { get; set; }

        [Column(Name = "lCreditorId")]
        public int CreditorID { get; set; }

        [Column(Name = "mAmount")]
        public decimal Amount { get; set; }
    }
}
