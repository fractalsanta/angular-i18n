using System.Data.Linq.Mapping;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [Table(Name = "BankAccount")]
    public class BankAccount
    {

        [Column(Name = "lBankAccountID")]
        public int BankAccountID { get; set; }

        [Column(Name = "lBankID")]
        public int BankID { get; set; }

        [Column(Name = "sBSB")]
        public string BSB { get; set; }

        [Column(Name = "sAccountNumber")]
        public string AccountNumber { get; set; }

        [Column(Name = "sAccountName")]
        public string AccountName { get; set; }

        [Column(Name = "sBranch")]
        public string Branch { get; set; }

        [Column(Name = "lLastReceiptNumber")]
        public int LastReceiptNumber { get; set; }

        [Column(Name = "sLastChequeNumber")]
        public string LastChequeNumber { get; set; }

        [Column(Name = "lLastEFTNumber")]
        public int LastEFTNumber { get; set; }

        [Column(Name = "lLastOtherPaymentNumber")]
        public int LastOtherPaymentNumber { get; set; }

        [Column(Name = "bManualCheques")]
        public string ManualCheques { get; set; }

        [Column(Name = "bIsInvestmentAccount")]
        public string IsInvestmentAccount { get; set; }

        [Column(Name = "sBillerCode")]
        public string BillerCode { get; set; }

        [Column(Name = "bActive")]
        public string Active { get; set; }

        [Column(Name = "sAccountSuffix")]
        public string AccountSuffix { get; set; }

        [Column(Name = "lLastBPAYNumber")]
        public int LastBPAYNumber { get; set; }

        [Column(Name = "sAllocatedBSB")]
        public string AllocatedBSB { get; set; }

        [Column(Name = "sAllocatedAccountNumber")]
        public string AllocatedAccountNumber { get; set; }

        [Column(Name = "sPayWayCode")]
        public string PayWayCode { get; set; }
    }
}