using System;
using System.Collections.Generic;
using System.Data.Linq.Mapping;
using System.Linq;
using System.Text;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [Table]
    public class LotRegister
    {
        [Column(Name = "lLotRegisterID")]
        public int LotRegisterID { get; set; }

        [Column(Name = "lOwnersCorporationID")]
        public int OwnersCorporationID { get; set; }

        [Column(Name = "lLotID")]
        public int LotID { get; set; }

        [Column(Name = "lOtherLot")]
        public int OtherLot { get; set; }

        [Column(Name = "lLotRegisterTypeID")]
        public int LotRegisterTypeID { get; set; }

        [Column(Name = "sDetails")]
        public string Details { get; set; }

        [Column(Name = "mOriginalValue")]
        public decimal OriginalValue { get; set; }

        [Column(Name = "dCommencement")]
        public DateTime Commencement { get; set; }

        [Column(Name = "dExpiry")]
        public DateTime Expiry { get; set; }

        [Column(Name = "sStatus")]
        public string Status { get; set; }

        [Column(Name = "sContactName")]
        public string ContactName { get; set; }

        [Column(Name = "sContactAddress")]
        public string ContactAddress { get; set; }

        [Column(Name = "sContactTelephone1")]
        public string ContactTelephone1 { get; set; }

        [Column(Name = "sContactTelephone2")]
        public string ContactTelephone2 { get; set; }

        [Column(Name = "sContactTelephone3")]
        public string ContactTelephone3 { get; set; }

        [Column(Name = "sContactFax")]
        public string ContactFax { get; set; }

        [Column(Name = "sContactEmail")]
        public string ContactEmail { get; set; }

        [Column(Name = "sNotes")]
        public string Notes { get; set; }
    }
}
