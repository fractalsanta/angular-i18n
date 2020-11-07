using System;
using System.Collections.Generic;
using System.Data.Linq.Mapping;
using System.Linq;
using System.Text;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [Table]
    public class ContractRegister
    {
        [Column(Name = "lContractRegisterID", IsPrimaryKey = true)]
        public int ContractRegisterID { get; set; }

        [Column(Name = "lOwnersCorporationID")]
        public int OwnersCorporationID { get; set; }

        [Column(Name = "lCreditorID")]
        public int CreditorID { get; set; }

        [Column(Name = "lContractTypeID")]
        public int ContractTypeID { get; set; }

        [Column(Name = "dExpiry")]
        public DateTime Expiry { get; set; }

        [Column(Name = "dCommencement")]
        public DateTime Commencement { get; set; }

        [Column(Name = "sTerm")]
        public string Term { get; set; }

        [Column(Name = "mAnnualFee")]
        public decimal AnnualFee { get; set; }

        [Column(Name = "sContactName")]
        public string ContactName { get; set; }

        [Column(Name = "sContactTelephone1")]
        public string ContactTelephone1 { get; set; }

        [Column(Name = "sContactTelephone2")]
        public string ContactTelephone2 { get; set; }

        [Column(Name = "sContactTelephone3")]
        public string ContactTelephone3 { get; set; }

        [Column(Name = "sNotes")]
        public string Notes { get; set; }
    }
}
