using System;
using System.Data.Linq.Mapping;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [Table(Name="tblTranEntry")]
    public class TranEntry
    {
        [Column(Name = "lTransactionID")]
        public int TransactionID { get; set; }

        [Column(Name = "lOwnersCorporationID")]
        public int OwnersCorporationID { get; set; }

        [Column(Name = "dTranDate")]
        public DateTime TranDate { get; set; }

        [Column(Name = "lAccountID")]
        public int AccountID { get; set; }

        [Column(Name = "lItemType")]
        public int ItemType { get; set; }

        [Column(Name = "lItemID")]
        public int ItemID { get; set; }

        [Column(Name = "bGST")]
        public string GST { get; set; }

        [Column(Name = "mAmount")]
        public decimal Amount { get; set; }

        [Column(Name = "lGroupCodeID")]
        public int GroupCodeID { get; set; }
    }
}