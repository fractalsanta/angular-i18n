using System;
using System.Data.Linq.Mapping;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [Table(Name="DebtRecoveryAction")]
    public partial class DebtRecoveryAction
    {
        [Column(Name = "lDebtRecoveryActionID", IsPrimaryKey = true)]
        public int DebtRecoveryActionID { get; set; }

        [Column(Name = "lOwnerID")]
        public int OwnerID { get; set; }

        [Column(Name = "lDebtRecoveryID")]
        public int DebtRecoveryID { get; set; }

        [Column(Name = "lDebtCollectorID")]
        public int? DebtCollectorID { get; set; }

        [Column(Name = "dActionDate")]
        public DateTime ActionDate { get; set; }

        [Column(Name = "dClearedDate")]
        public DateTime ClearedDate { get; set; }

        [Column(Name = "mCharge")]
        public decimal Charge { get; set; }

        [Column(Name = "bPaymentPlan")]
        public string PaymentPlan { get; set; }

        [Column(Name = "bNotify")]
        public string Notify { get; set; }

        [Column(Name = "sNotes")]
        public string Notes { get; set; }

        [Column(Name = "mAmountOwingInNotice")]
        public decimal AmountOwingInNotice { get; set; }

        [Column(Name = "mInterestIncluded")]
        public decimal InterestIncluded { get; set; }

        [Column(Name = "dInterestCalculatedTo")]
        public DateTime InterestCalculatedTo { get; set; }

        [Column(Name = "mPendingCharge")]
        public decimal PendingCharge { get; set; }

        [Column(Name = "mPendingGST")]
        public decimal PendingGST { get; set; }

        [Column(Name = "mWaivedCharge")]
        public decimal WaivedCharge { get; set; }
    }
}
