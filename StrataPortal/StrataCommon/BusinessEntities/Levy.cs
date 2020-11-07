using System;
using System.Collections.Generic;
using System.Data.Linq.Mapping;
using System.Linq;
using System.Text;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [Table]
    public class Levy
    {
        [Column(Name = "lLevyID", IsPrimaryKey = true)]
        public int LevyID { get; set; }

        [Column(Name = "lLotID")]
        public int LotID { get; set; }

        [Column(Name = "dDue")]
        public DateTime Due { get; set; }

        [Column(Name = "sLevyFrequency")]
        public string LevyFrequency { get; set; }

        [Column(Name = "lDRAccountID")]
        public int? DRAccountID { get; set; }

        [Column(Name = "lCRAccountID")]
        public int? CRAccountID { get; set; }

        [Column(Name = "mAdminDebt")]
        public decimal AdminDebt { get; set; }

        [Column(Name = "mAdminGSTdebt")]
        public decimal AdminGSTdebt { get; set; }

        [Column(Name = "mAdminPaid")]
        public decimal AdminPaid { get; set; }

        [Column(Name = "mAdminGSTpaid")]
        public decimal AdminGSTpaid { get; set; }

        [Column(Name = "mAdminInterestPaid")]
        public decimal AdminInterestPaid { get; set; }

        [Column(Name = "mSinkDebt")]
        public decimal SinkDebt { get; set; }

        [Column(Name = "mSinkGSTdebt")]
        public decimal SinkGSTdebt { get; set; }

        [Column(Name = "mSinkPaid")]
        public decimal SinkPaid { get; set; }

        [Column(Name = "mSinkGSTpaid")]
        public decimal SinkGSTpaid { get; set; }

        [Column(Name = "mSinkInterestPaid")]
        public decimal SinkInterestPaid { get; set; }

        [Column(Name = "lOtherFundID")]
        public int? OtherFundID { get; set; }

        [Column(Name = "mOtherDebt")]
        public decimal OtherDebt { get; set; }

        [Column(Name = "mOtherGSTdebt")]
        public decimal OtherGSTdebt { get; set; }

        [Column(Name = "mOtherPaid")]
        public decimal OtherPaid { get; set; }

        [Column(Name = "mOtherGSTpaid")]
        public decimal OtherGSTpaid { get; set; }

        [Column(Name = "mOtherInterestPaid")]
        public decimal OtherInterestPaid { get; set; }

        [Column(Name = "bFinalInterestTaken")]
        public string FinalInterestTaken { get; set; }

        [Column(Name = "sLevyType")]
        public string LevyType { get; set; }

        [Column(Name = "sDescription")]
        public string Description { get; set; }

        [Column(Name = "lLevySummaryID")]
        public int? LevySummaryID { get; set; }

        [Column(Name = "sImportKey")]
        public string ImportKey { get; set; }

        [Column(Name = "bOpeningBalance")]
        public string OpeningBalance { get; set; }

        [Column(Name = "sStatus")]
        public string Status { get; set; }

        [Column(Name = "lSubmeterInvoiceDetailID")]
        public int? SubmeterInvoiceDetailID { get; set; }

        [Column(Name = "sReasonCancelled")]
        public string ReasonCancelled { get; set; }

        [Column(Name = "dDateCancelled")]
        public DateTime DateCancelled { get; set; }

        [Column(Name = "mLevyDiscount")]
        public decimal LevyDiscount { get; set; }
        
        [Column(Name = "lGroupCodeID")]
        public int GroupCodeID { get; set; }
    }
}
