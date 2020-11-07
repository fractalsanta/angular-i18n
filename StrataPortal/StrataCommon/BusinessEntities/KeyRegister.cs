using System;
using System.Data.Linq.Mapping;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [Table]
    public class KeyRegister
    {
        [Column(Name = "lKeyRegisterID", IsPrimaryKey = true)]
        public int KeyRegisterID { get; set; }

        [Column(Name = "bRefundable")]
        public string Refundable { get; set; }

        [Column(Name = "dIssued")]
        public DateTime Issued { get; set; }

        [Column(Name = "dReturned")]
        public DateTime Returned { get; set; }

        [Column(Name = "lKeyTypeID")]
        public int KeyTypeID { get; set; }

        [Column(Name = "lLotID")]
        public int LotID { get; set; }

        [Column(Name = "lOtherLot")]
        public int OtherLot { get; set; }

        [Column(Name = "lOwnersCorporationID")]
        public int OwnersCorporationID { get; set; }

        [Column(Name = "mAmount")]
        public decimal Amount { get; set; }

        [Column(Name = "sContactAddress")]
        public string ContactAddress { get; set; }

        [Column(Name = "sContactName")]
        public string ContactName { get; set; }

        [Column(Name = "sContactTelephone1")]
        public string ContactTelephone1 { get; set; }

        [Column(Name = "sContactTelephone2")]
        public string ContactTelephone2 { get; set; }

        [Column(Name = "sKeyID")]
        public string KeyID { get; set; }

        [Column(Name = "sLocation")]
        public string Location { get; set; }

        [Column(Name = "sNotes")]
        public string Notes { get; set; }

        [Column(Name = "sNumberOfKeys")]
        public string NumberOfKeys { get; set; }

    }
}