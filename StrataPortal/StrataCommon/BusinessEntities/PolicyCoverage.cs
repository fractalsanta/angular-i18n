using System;
using System.Collections.Generic;
using System.Data.Linq.Mapping;
using System.Linq;
using System.Text;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [Table]
    public class PolicyCoverage
    {
        // added to RWAC 20160122
        // added to Strata in at least v6.5

        [Column(Name = "lPolicyCoverageID", IsPrimaryKey = true)]
        public int PolicyCoverageID { get; set; }

        [Column(Name = "lCoverageCodeID")]
        public int CoverageCodeID { get; set; }

        [Column(Name = "lInsuranceID")]
        public int InsuranceID { get; set; }

        [Column(Name = "sStatus")]
        public string Status { get; set; }

        [Column(Name = "sSumInsured")]
        public string SumInsured { get; set; }

        [Column(Name = "sNotes")]
        public string Notes { get; set; }

        [Column(Name = "mExcess")]
        public decimal Excess { get; set; }
    }

    [Table]
    public class CoverageCode
    {
        [Column(Name = "lCoverageCodeID", IsPrimaryKey = true)]
        public int CoverageCodeID { get; set; }

        [Column(Name = "sDescription")]
        public string Description { get; set; }
    }
}
