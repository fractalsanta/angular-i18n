using System;
using System.Collections.Generic;
using System.Data.Linq.Mapping;
using System.Linq;
using System.Text;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [Table(Name = "WorkOrder")]
    public class WorkOrder
    {
        [Column(Name = "lWorkOrderID", IsPrimaryKey = true, IsDbGenerated = false)]
        public int WorkOrderID { get; set; }

        [Column(Name = "lOwnersCorporationID")]
        public int OwnersCorporationID { get; set; }

        [Column(Name = "dOrderDate")]
        public DateTime OrderDate { get; set; }

        [Column(Name = "sStatus")]
        public string Status { get; set; }

        [Column(Name = "lOrderNumber")]
        public int OrderNumber { get; set; }

        [Column(Name = "lDiaryEntryID")]
        public int DiaryEntryID { get; set; }

        [Column(Name = "dDateQuoteRequested")]
        public DateTime DateQuoteRequested { get; set; }

        [Column(Name = "dDateReported")]
        public DateTime DateReported { get; set; }

        [Column(Name = "sReportedBy")]
        public string ReportedBy { get; set; }

        [Column(Name = "mAmountInvoiced")]
        public decimal AmountInvoiced { get; set; }

        [Column(Name = "sProblemDescription")]
        public string ProblemDescription { get; set; }

        // WARNING: This field was added in V6.5
        [Column(Name = "sQuoteDetail")]
        public string QuoteDetail { get; set; }

        [Column(Name = "lCreditorId")]
        public int CreditorID { get; set; }

        [Column(Name = "dRequestedDue")]
        public DateTime RequestedDue { get; set; }

        [Column(Name = "dWorkOrderDue")]
        public DateTime WorkOrderDue { get; set; }
        
        //[Column(Name = "lOwnersCorporationID")]
        //public int OwnersCorporationID { get; set; }

        //[Column(Name = "lOwnersCorporationID")]
        //public int OwnersCorporationID { get; set; }
    }
}
