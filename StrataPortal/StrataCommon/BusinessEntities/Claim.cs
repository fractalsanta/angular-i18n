using System;
using System.Collections.Generic;
using System.Data.Linq.Mapping;
using System.Linq;
using System.Text;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [Table]
    public class Claim
    {
        [Column(Name = "lClaimID", IsPrimaryKey = true)]
        public int ClaimID { get; set; }

        [Column(Name = "lInsuranceID")]
        public int InsuranceID { get; set; }

        [Column(Name = "sStatus")]
        public string Status { get; set; }

        [Column(Name = "sClaimType")]
        public string ClaimType { get; set; }

        [Column(Name = "dClaimDate")]
        public DateTime ClaimDate { get; set; }
    }
}
