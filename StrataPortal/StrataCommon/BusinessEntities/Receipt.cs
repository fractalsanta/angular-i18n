using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using System.Data;
using System.Data.Linq;
using System.Data.Linq.Mapping;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [DataContract]
    [Table]
    public class Receipt
    {
        [DataMember]
        [Column(Name = "lReceiptID")]
        public Int32 ReceiptID { get; set; }

        [DataMember]
        [Column(Name = "lOwnerID")]
        public Int32? OwnerID { get; set; }

        [DataMember]
        [Column(Name = "lOwnersCorporationID")]
        public Int32? OwnersCorporationID { get; set; }

        [DataMember]
        [Column(Name = "lAccountID")]
        public Int32? AccountID { get; set; }

        [DataMember]
        [Column(Name = "lTrustLedgerAccountID")]
        public Int32 TrustLedgerAccountID { get; set; }

        [DataMember]
        [Column(Name = "lDepositID")]
        public Int32 DepositID { get; set; }

        [DataMember]
        [Column(Name = "lBankAccountID")]
        public Int32 BankAccountID { get; set; }

        [DataMember]
        [Column(Name = "dReceiptDate")]
        public DateTime ReceiptDate { get; set; }

        [DataMember]
        [Column(Name = "mAmountTotal")]
        public Decimal AmountTotal { get; set; }

        [DataMember]
        [Column(Name = "mGSTamount")]
        public Decimal GSTamount { get; set; }

        [DataMember]
        [Column(Name = "mAmountCheque")]
        public Decimal AmountCheque { get; set; }

        [DataMember]
        [Column(Name = "sChequeNumber")]
        public string ChequeNumber { get; set; }

        [DataMember]
        [Column(Name = "sDrawer")]
        public string Drawer { get; set; }

        [DataMember]
        [Column(Name = "sBank")]
        public string Bank { get; set; }

        [DataMember]
        [Column(Name = "sBranch")]
        public string Branch { get; set; }

        [DataMember]
        [Column(Name = "sBSB")]
        public string BSB { get; set; }

        [DataMember]
        [Column(Name = "sReceiptType")]
        public string ReceiptType { get; set; }

        [DataMember]
        [Column(Name = "sStatus")]
        public string Status { get; set; }

        [DataMember]
        [Column(Name = "lPrintedReceiptNumber")]
        public Int32 PrintedReceiptNumber { get; set; }

        [DataMember]
        [Column(Name = "sPaymentBy")]
        public string PaymentBy { get; set; }

        [DataMember]
        [Column(Name = "sDescription")]
        public string Description { get; set; }

        [DataMember]
        [Column(Name = "dPaidFrom")]
        public DateTime PaidFrom { get; set; }

        [DataMember]
        [Column(Name = "dPaidTo")]
        public DateTime PaidTo { get; set; }

        [DataMember]
        [Column(Name = "lUserID")]
        public Int32 UserID { get; set; }

        [DataMember]
        [Column(Name = "sImportKey")]
        public string ImportKey { get; set; }

        [DataMember]
        [Column(Name = "bDirectDeposit")]
        public string DirectDeposit { get; set; }

        [DataMember]
        [Column(Name = "dEnteredDate")]
        public DateTime EnteredDate { get; set; }

        [DataMember]
        [Column(Name = "sSubType")]
        public string SubType { get; set; }

        [DataMember]
        [Column(Name = "lPaymentID")]
        public Int32? PaymentID { get; set; }

        [DataMember]
        [Column(Name = "lSource")]
        public Int32 Source { get; set; }

    }
}
