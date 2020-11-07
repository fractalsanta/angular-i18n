using System;
using System.Collections.Generic;
using System.Data.Linq.Mapping;
using System.Linq;
using System.Text;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [Table]
    public class ReceiptAllocation
    {
        [Column(Name = "lReceiptAllocationID", IsPrimaryKey = true)]
        public int ReceiptAllocationID { get; set; }

        [Column(Name = "lReceiptID")]
        public int ReceiptID { get; set; }

        [Column(Name = "lLevyID")]
        public int LevyID { get; set; }

        [Column(Name = "mAdminPaid")]
        public decimal AdminPaid { get; set; }

        [Column(Name = "mAdminGSTpaid")]
        public decimal AdminGSTpaid { get; set; }

        [Column(Name = "mAdminInterestPaid")]
        public decimal AdminInterestPaid { get; set; }

        [Column(Name = "mSinkPaid")]
        public decimal SinkPaid { get; set; }

        [Column(Name = "mSinkGSTpaid")]
        public decimal SinkGSTpaid { get; set; }

        [Column(Name = "mSinkInterestPaid")]
        public decimal SinkInterestPaid { get; set; }

        [Column(Name = "lOtherFundID")]
        public int? OtherFundID { get; set; }

        [Column(Name = "mOtherPaid")]
        public decimal OtherPaid { get; set; }

        [Column(Name = "mOtherGSTpaid")]
        public decimal OtherGSTpaid { get; set; }

        [Column(Name = "mOtherInterestPaid")]
        public decimal OtherInterestPaid { get; set; }

        [Column(Name = "mAmount")]
        public decimal Amount { get; set; }
    }
}
