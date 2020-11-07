using System;
using System.Collections.Generic;
using System.Data.Linq.Mapping;
using System.Linq;
using System.Text;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [Table(Name = "Creditor")]
    public class Creditor
    {
        [Column(Name = "lCreditorId", IsPrimaryKey = true)]
        public int CreditorID { get; set; }

        [Column(Name = "lContactId")]
        public int ContactID { get; set; }

        [Column(Name = "sCreditorName")]
        public string CreditorName { get; set; }


        [Column(Name = "lcreditortypeid")]
        public int CreditorTypeId { get; set; }

        [Column(Name = "bActive")]
        public string Active { get; set; }
    }
}
